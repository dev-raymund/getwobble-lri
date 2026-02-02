import { useState, useRef, useEffect } from "react";
import { Loader2, X } from "lucide-react";

type Option = { id: number | string; name: string };

interface SearchSelectProps {
    apiEndpoint: string;
    selected: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    allOptions?: Option[];
}

export function SearchSelect({ 
    apiEndpoint, 
    selected, 
    onChange, 
    placeholder = "Search...",
    allOptions = []
}: SearchSelectProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("");

    // Initialize selectedLabel from allOptions or selected value
    useEffect(() => {
        if (selected && allOptions.length > 0) {
            const selectedOption = allOptions.find(opt => opt.id === selected || opt.id === parseInt(selected as string));
            if (selectedOption) {
                setSelectedLabel(selectedOption.name);
            }
        }
    }, [selected, allOptions]);

    // Fetch options when input changes
    useEffect(() => {
        if (!inputValue) {
            setOptions([]);
            return;
        }

        const timer = setTimeout(() => {
            setLoading(true);
            fetch(`${apiEndpoint}?search=${encodeURIComponent(inputValue)}`)
                .then(res => res.json())
                .then(data => {
                    setOptions(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue, apiEndpoint]);

    const handleSelect = (option: Option) => {
        onChange(option.id);
        setSelectedLabel(option.name);
        setInputValue("");
        setOpen(false);
    };

    const handleClear = () => {
        onChange("");
        setSelectedLabel("");
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            setOpen(false);
        }
    };

    return (
        <div className="overflow-visible bg-transparent">
            <div className="group border border-input px-3 py-2 mb-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex items-center justify-between">
                <div className="flex-1">
                    {selectedLabel && !inputValue ? (
                        <div className="text-sm text-foreground">{selectedLabel}</div>
                    ) : (
                        <input
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={() => setOpen(true)}
                            onBlur={() => setTimeout(() => setOpen(false), 200)}
                            onKeyDown={handleKeyDown}
                            placeholder={selectedLabel ? "" : placeholder}
                            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
                        />
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    {selectedLabel && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 hover:bg-accent rounded transition-colors"
                        >
                            <X className="h-3 w-3 text-muted-foreground" />
                        </button>
                    )}
                </div>
            </div>
            <div className="relative mt-2">
                {open && (
                    <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in max-h-60 overflow-y-auto">
                        {loading ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                Loading...
                            </div>
                        ) : options.length > 0 ? (
                            options.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => handleSelect(option)}
                                    className="px-3 py-2 cursor-pointer hover:bg-accent capitalize transition-colors"
                                >
                                    {option.name}
                                </div>
                            ))
                        ) : inputValue ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                No results found
                            </div>
                        ) : (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                Start typing to search...
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
