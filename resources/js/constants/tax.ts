export const TAX_STATUS = [
    { value: "none", label: "None" },
    { value: "taxable", label: "Taxable" },
    { value: "shipping_only", label: "Shipping Only" }
] as const;

export const TAX_CLASS = [
    { value: "standard", label: "Standard" },
    { value: "reduced_rate", label: "Reduced rate" },
    { value: "zero_rate", label: "Zero rate" }
] as const;