import { Head, Link } from '@inertiajs/react';

import { useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Home() {

    const products = [
        { 
            title: 'Occupational Therapy', 
            desc: 'Helping children develop essential skills for daily living and play.', 
            color: 'bg-[#8a94b5]',
            img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400' 
        },
        { 
            title: 'Private Sessions', 
            desc: 'One-on-one tailored sessions to address specific emotional needs.', 
            color: 'bg-[#5698cc]',
            img: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&w=400' 
        },
        { 
            title: 'Speech Therapy', 
            desc: 'Building communication confidence through proven speech techniques.', 
            color: 'bg-[#cc877b]',
            img: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=400' 
        },
        { 
            title: 'Child Psychology', 
            desc: 'Specialized mental health support for young minds and adolescents.', 
            color: 'bg-[#7b86a7]',
            img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400' 
        }
    ];

    // Separate component for clean logic
    function FAQItem({ question, answer }: { question: string, answer: string }) {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all shadow-sm">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
                >
                    <span className="font-bold text-[#2d3a5e] text-lg">{question}</span>
                    <span className={`text-2xl transition-transform duration-300 text-[#4a90e2] ${isOpen ? 'rotate-45' : ''}`}>
                        +
                    </span>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 p-6 pt-0 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <p className="text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                        {answer}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans text-[#333]">
            <Head title="Home" />

            <header className="absolute top-0 left-0 w-full z-50 py-6 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/90 backdrop-blur-md rounded-full px-8 py-3 shadow-md">
                    
                    {/* Logo Section */}
                    <div className="flex items-center gap-2">
                        <div className="font-['Quicksand'] w-10 h-10 bg-[#4a90e2] rounded-lg flex items-center justify-center text-white font-bold text-xl">W</div>
                        <span className="font-['Quicksand'] text-2xl font-black text-[#2d3a5e] tracking-tight">Wooble</span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-8 text-[#2d3a5e] font-semibold text-sm">
                        <Link href="/" className="hover:text-[#4a90e2] transition-colors">Home</Link>
                        <Link href="#" className="hover:text-[#4a90e2] transition-colors">Browse Therapists</Link>
                        <Link href="#" className="hover:text-[#4a90e2] transition-colors">Partnership</Link>
                        <Link href="#" className="hover:text-[#4a90e2] transition-colors">About Us</Link>
                        <Link href="#" className="hover:text-[#4a90e2] transition-colors">Services</Link>
                        <Link href="#" className="hover:text-[#4a90e2] transition-colors">Blog</Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/login" 
                            className="text-[#2d3a5e] font-bold text-sm px-5 py-2 hover:text-[#4a90e2] transition-colors"
                        >
                            Login
                        </Link>
                        <Link 
                            href="/register" 
                            className="bg-[#4a90e2] text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-[#357abd] transition-all shadow-sm"
                        >
                            Register
                        </Link>
                        
                    </div>
                </div>
            </header>

            {/* ================= HERO SECTION ================= */}
            <section className="bg-[#fdf6f0] pt-40 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="relative z-10">
                        <span className="text-[#d97e6e] font-bold tracking-widest text-sm uppercase mb-4 block">
                            Stigma shouldn't stop support
                        </span>
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-[#2d3a5e]">
                            Therapy with <br /> 
                            <span className="text-[#6c7a9c]">Wobble</span>
                        </h1>
                        <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
                            Connect with over 100 qualified therapists across the UK.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="#" className="bg-[#4a90e2] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[#357abd] transition-all">
                                Find My Therapist
                            </Link>
                            <button className="flex items-center gap-3 text-[#2d3a5e] font-bold group">
                                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md group-hover:scale-110 transition-transform">▶</span>
                                Watch Video
                            </button>
                        </div>
                    </div>

                    {/* Right Images (Polaroid Layout) */}
                    <div className="relative flex justify-center items-center">
                        <div className="relative w-full max-w-md">
                            {/* Top Polaroid */}
                            <div className="bg-white rounded-2xl p-3 shadow-xl rotate-[-6deg] absolute -top-10 -left-10 z-20 w-56">
                                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400" alt="Therapy" className="rounded" />
                            </div>
                            {/* Main Center Polaroid */}
                            <div className="bg-white rounded-2xl p-4 shadow-2xl z-10 relative">
                                <img src="https://images.unsplash.com/photo-1502781252888-9143ba7f074e?auto=format&fit=crop&w=600" alt="Child playing" className="rounded" />
                            </div>
                            {/* Bottom Polaroid */}
                            <div className="bg-white rounded-2xl p-3 shadow-xl rotate-[8deg] absolute -bottom-12 -right-10 z-20 w-56">
                                <img src="https://images.unsplash.com/photo-1484665754804-74b091211472?auto=format&fit=crop&w=400" alt="Support" className="rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= PARTNERS LOGO SLIDER ================= */}
            <section className="py-12 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-[#6c7a9c] mt-2">
                            Trusted By
                        </h2>
                    </div>
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={50}
                        slidesPerView={2}
                        loop={true}
                        speed={5000}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: { slidesPerView: 3 },
                            1024: { slidesPerView: 5 },
                        }}
                        className="flex items-center"
                    >
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <SwiperSlide key={i} className="flex justify-center items-center opacity-40 hover:opacity-100 transition-opacity">
                                <img 
                                    src={`https://via.placeholder.com/150x50?text=PARTNER+${i}`} 
                                    alt="Partner Logo" 
                                    className="h-10 grayscale" 
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* ================= FEATURES BAR ================= */}
            <section className="bg-[#7b86a7] py-16 text-white font-['Quicksand']">
                <div className="text-center mb-12">
                    <span className="text-zinc-100 font-bold tracking-widest text-sm uppercase">
                        Making quality therapy
                    </span>
                    <h2 className="text-4xl font-bold text-white mt-2">
                        Simple and Accessible
                    </h2>
                </div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { 
                            title: 'Professional', 
                            description: 'All therapists are verified and meet strict qualification standards.',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                </svg>
                            )
                        },
                        { 
                            title: 'Flexible', 
                            description: 'No subscriptions or lock-ins—book as and when you need.',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                            )
                        },
                        { 
                            title: 'Accessible', 
                            description: 'Affordable, convenient support tailored to your needs.',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )
                        },
                        { 
                            title: 'Changing Perceptions', 
                            description: 'Removing stigma and making mental health support normal for everyone.',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                                </svg>
                            )
                        },
                    ].map((item) => (
                        <div key={item.title} className="flex flex-col items-center text-center group cursor-default">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-white/20 group-hover:bg-white group-hover:text-[#7b86a7] transition-all duration-300">
                                {item.icon}
                            </div>
                            <h3 className="font-['Quicksand'] leading-tight font-bold text-lg">{item.title}</h3>
                            <p className="text-sm text-blue-100 mt-2 opacity-80">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= THERAPISTS ================= */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-[#d97e6e] font-bold tracking-widest text-sm uppercase">
                            Get matched
                        </span>
                        <h2 className="text-4xl font-bold text-[#2d3a5e] mt-2">
                            Featured Therapists
                        </h2>
                    </div>

                    {/* Swiper Slider */}
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        centeredSlides={false}
                        loop={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        pagination={{ clickable: true, el: '.custom-pag' }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-16"
                    >
                        {products.map((item, index) => (
                            <SwiperSlide key={index} className="pt-10">
                                <div className={`${item.color} rounded-[40px] p-8 text-white h-full flex flex-col transition-transform duration-300 hover:-translate-y-2`}>
                                    <div className="mb-6 h-48 overflow-hidden rounded-3xl">
                                        <img 
                                            src={item.img} 
                                            alt={item.title} 
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                    <p className="opacity-90 mb-8 flex-grow">{item.desc}</p>
                                    <Link 
                                        href="#" 
                                        className="inline-block w-fit font-bold border-b-2 border-white pb-1 hover:opacity-80 transition"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="flex items-center mt-10 justify-center gap-6">
                        <Link href="#" className="bg-[#4a90e2] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[#357abd] transition-all">
                            View All Therapist
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= OUR APPROACH (Steps) ================= */}
            <section className="py-24 bg-[#fdf6f0]">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-[#2d3a5e] mb-6">Why Should You Choose Us as The Solution?</h2>
                        <p className="text-gray-500 mb-8">We provide a safe, nurturing environment where children can express themselves and develop the tools they need for a bright future.</p>
                        <Link href="/about" className="bg-[#4a90e2] text-white px-8 py-4 rounded-full font-bold shadow-lg inline-block">Learn More</Link>
                    </div>
                    
                    {/* Simple Contact Form Box */}
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                        <div className="space-y-4">
                            <input type="text" placeholder="Full Name" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#4a90e2]" />
                            <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#4a90e2]" />
                            <textarea placeholder="Your Message" rows={4} className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#4a90e2]"></textarea>
                            <button className="w-full bg-[#d97e6e] text-white py-4 rounded-xl font-bold hover:bg-[#c66a5b] transition">Send Message</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 items-center">
                    {/* Testimonial Cards */}
                    <div className="md:col-span-2 grid md:grid-cols-2 gap-8">
                        {[
                            { name: "Alena", text: "Kidstera has been a blessing for our family. The therapists are so patient and kind." },
                            { name: "Jessica", text: "I've seen a massive improvement in my daughter's confidence and social skills." }
                        ].map((item, i) => (
                            <div key={i} className="bg-[#7b86a7] p-8 rounded-[40px] text-white relative">
                                <div className="text-4xl mb-4 opacity-50 font-serif">“</div>
                                <p className="text-lg italic mb-6">"{item.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden border-2 border-white">
                                        <img src={`https://i.pravatar.cc/150?u=${item.name}`} alt={item.name} />
                                    </div>
                                    <span className="font-bold">{item.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar Info */}
                    <div className="bg-[#fdf6f0] p-10 rounded-3xl border-2 border-dashed border-[#7b86a7]/30">
                        <h3 className="text-3xl font-bold text-[#2d3a5e] mb-4">What Clients Say</h3>
                        <p className="text-gray-500 mb-6">Read about the experiences of families who have trusted us with their children's growth.</p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[#4a90e2] font-bold text-2xl">2k+</span>
                                <span className="text-sm text-gray-400">Happy Parents</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[#4a90e2] font-bold text-2xl">4.9</span>
                                <span className="text-sm text-gray-400">Average Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FAQ SECTION ================= */}
            <section className="py-24 bg-[#fdf6f0]">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[#d97e6e] font-bold tracking-widest text-sm uppercase">Common Questions</span>
                        <h2 className="text-4xl font-bold text-[#2d3a5e] mt-2">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "How much does therapy cost?",
                                a: "Therapy sessions typically range from £40-£80 per session, depending on the therapist and session type. We believe in transparent pricing with no hidden fees."
                            },
                            {
                                q: "How do I know if a therapist is right for me?",
                                a: "Our matching quiz helps connect you with therapists who align with your needs. You can also book a free 15-minute intro call to see if it's a good fit before committing to a full session."
                            },
                            {
                                q: "Can I switch therapists if needed?",
                                a: "Absolutely! Finding the right therapist is important for your journey. You can easily browse other therapists and switch at any time - no questions asked."
                            },
                            {
                                q: "Is my information kept confidential?",
                                a: "Yes, complete confidentiality is maintained. All therapists are bound by professional ethics and we use secure, encrypted platforms for all communications and sessions."
                            }
                        ].map((faq, index) => <FAQItem key={index} question={faq.q} answer={faq.a} />)}
                    </div>
                </div>
            </section>

            {/* ================= BLOG / ARTICLE ================= */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-[#d97e6e] font-bold tracking-widest text-sm uppercase">Insights</span>
                        <h2 className="text-4xl font-bold text-[#2d3a5e] mt-2">Blog & Articles</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((post) => (
                            <div key={post} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                                <img src={`https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80`} alt="Blog" className="h-56 w-full object-cover" />
                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                        <span>Jan 16, 2026</span>
                                        <span>By Admin</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-[#2d3a5e] mb-3">Raising Happy and Healthy Children</h4>
                                    <p className="text-gray-500 text-sm mb-4">Insights into child development and psychological well-being...</p>
                                    <Link href="#" className="text-[#4a90e2] font-bold text-sm">Read More →</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="bg-[#2d3a5e] text-white pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Wobble</h2>
                        <p className="text-gray-400">
                            Connecting you with qualified mental health professionals for your healing journey.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/services">Services</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Contact</h4>
                        <p className="text-gray-400">123 Therapy Blvd, Health City</p>
                        <p className="text-gray-400">contact@kidstera.com</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Newsletter</h4>
                        <div className="flex">
                            <input type="text" placeholder="Your Email" className="bg-white/10 border-none rounded-l-lg p-3 w-full" />
                            <button className="bg-[#4a90e2] px-4 rounded-r-lg">Send</button>
                        </div>
                    </div>
                </div>
                <p className="text-center mt-10 text-gray-500 text-sm">© 2026 Wobble. All rights reserved.</p>
            </footer>
        </div>
    );
}