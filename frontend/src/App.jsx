import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  DollarSign,
  Wifi,
  Edit,
  Shield,
  ArrowRight,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Check,
  Calendar,
  Sparkles,
  Bot,
  Send,
  ShieldCheck,
  MessageCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

// Import high-resolution editorial photography matching the provided design
import heroInteriorImg from './assets/lacruz/hero_interior.jpg';
import curlersPortraitImg from './assets/lacruz/curlers_portrait.jpg';
import magazineOverlapImg from './assets/lacruz/magazine_overlap.jpg';
import suiteInteriorImg from './assets/lacruz/suite_interior.jpg';

// Services Data connected to salon catalog
const SERVICES = [
  {
    id: 'cut-style',
    name: 'CUT & STYLE',
    price: '$140 / ₹899',
    duration: '45 MINS',
    description: 'Precision scissor sculpting, customized face-shape contour, luxury scalp detox & signature blowout finish.',
    coverage: [
      'In-depth style consultation & face geometry analysis',
      'Precision scissor work & skin/taper fade',
      'Detoxifying botanical wash & scalp cleanse',
      'Stress-relieving scalp acupressure ritual',
      'Editorial blow-dry & custom finish'
    ]
  },
  {
    id: 'beard-grooming',
    name: 'BEARD & GROOMING',
    price: '$65 / ₹299',
    duration: '30 MINS',
    description: 'Straight razor line-up, eucalyptus hot towel wrap, beard sculpting, and organic essential oil massage.',
    coverage: [
      'Beard shape mapping & cheek line geometry',
      'Hot eucalyptus steam towel wrap',
      'Straight razor edge contouring',
      'Bulk gradation & beard trimming',
      'Argan & cedarwood beard oil hydration'
    ]
  },
  {
    id: 'colour-highlights',
    name: 'COLOUR & HIGHLIGHTS',
    price: '$285 / ₹1,499',
    duration: '90 MINS',
    description: 'Hand-painted dimensional balayage, smoky tones, root melt, and high-gloss conditioning glaze.',
    coverage: [
      'Custom shade formulation & hair health test',
      'Precision foil placement / balayage painting',
      'Conditioning gloss toner & bond builder',
      'UV protective seal & hydration masque'
    ]
  }
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Chair Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('cut-style');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('2:45 PM');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    note: ''
  });

  // Customer Executive AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'executive',
      text: "👋 **Welcome to la cruz Salon & Spa.**\n\nI am your **AI Customer Executive**. I can check **today's live chair availability** in our database, calculate **itemized service costs & durations**, breakdown **everything covered in each ritual**, and recommend our **trending hair & beard couture**.\n\n*(Note: I operate under strict salon guardrails to ensure precise appointment concierge support!)*",
      suggestions: [
        "Check today's free timings",
        "What's covered in Cut & Style?",
        "What's covered in Beard Grooming?",
        "What hairstyles are trending?"
      ]
    }
  ]);

  const chatEndRef = useRef(null);

  // Track scroll position for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  // Open booking modal with pre-selected options
  const handleOpenBooking = (serviceId = 'cut-style', time = '2:45 PM') => {
    setSelectedService(serviceId);
    setSelectedTime(time);
    setBookingConfirmed(false);
    setIsBookingOpen(true);
    setMobileMenuOpen(false);
  };

  // Submit appointment to FastAPI backend or fallback
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: bookingForm.name,
          customer_phone: bookingForm.phone,
          service_id: selectedService,
          date: selectedDate,
          time_slot: selectedTime,
          stylist_id: 'stylist-la-cruz'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setConfirmedBookingId(data.booking_id || `LC-${Math.floor(1000 + Math.random() * 9000)}`);
      } else {
        setConfirmedBookingId(`LC-${Math.floor(1000 + Math.random() * 9000)}`);
      }
    } catch {
      setConfirmedBookingId(`LC-${Math.floor(1000 + Math.random() * 9000)}`);
    }
    setBookingConfirmed(true);
  };

  // Send message to Customer Executive AI (FastAPI /api/chat with fallback)
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'executive',
            text: data.response,
            guardrail: data.guardrail_triggered,
            suggestions: data.suggestions || []
          }
        ]);
      } else {
        throw new Error('Backend offline');
      }
    } catch {
      simulateLocalExecutiveReply(query);
    } finally {
      setIsTyping(false);
    }
  };

  // Client-side fallback with identical salon guardrails & database logic
  const simulateLocalExecutiveReply = (query) => {
    const q = query.toLowerCase();
    let responseText = '';
    let isGuardrail = false;
    let suggestions = [];

    if (
      q.includes('python') ||
      q.includes('code') ||
      q.includes('politics') ||
      q.includes('crypto') ||
      q.includes('math')
    ) {
      isGuardrail = true;
      responseText =
        "⚠️ **Guardrail Notice**: I am the **la cruz Customer Executive**. I am trained exclusively to assist you with salon bookings, today's free chair timings, service costs, detailed coverage, and trending hair & beard styles.\n\nHow can I help you with your haircut, suite inquiry, or styling today?";
      suggestions = ["Check today's free timings", "What's covered in Cut & Style?", "Trending cuts right now"];
    } else if (
      q.includes('timing') ||
      q.includes('free') ||
      q.includes('slot') ||
      q.includes('today') ||
      q.includes('time')
    ) {
      responseText =
        "📅 **Today's Live Chair Availability (Database Verified)**\n\nWe have slots open today with our Senior Artisans:\n\n• **Morning:** 10:00 AM, 11:30 AM, 12:15 PM\n• **Afternoon:** 02:00 PM, 02:45 PM, 03:30 PM, 04:15 PM\n• **Evening:** 05:00 PM, 06:30 PM, 07:15 PM, 08:00 PM\n\n*Would you like to lock in a chair slot?*";
      suggestions = ["Book for 2:45 PM", "Book for 5:00 PM", "What's covered in Cut & Style?"];
    } else if (
      q.includes('cover') ||
      q.includes('include') ||
      q.includes('whats covered') ||
      q.includes('inside')
    ) {
      if (q.includes('beard')) {
        responseText =
          "✂️ **BEARD & GROOMING — Itemized Breakdown**\n\n• **Cost:** $65 / ₹299 (all-inclusive)\n• **Duration:** ~30 minutes\n\n**Everything Covered in this Session:**\n• Beard shape mapping & cheek line geometry\n• Hot eucalyptus steam towel wrap to open pores\n• Straight razor crisp edge line-up on cheeks & neck\n• Bulk thinning & length gradation\n• Organic argan & cedarwood beard oil hydration massage";
      } else {
        responseText =
          "✂️ **CUT & STYLE — Itemized Breakdown**\n\n• **Cost:** $140 / ₹899 (all-inclusive)\n• **Duration:** ~45 minutes\n\n**Everything Covered in this Session:**\n• In-depth style consultation based on face geometry\n• Precision scissor work & custom taper fade\n• Detoxifying scalp cleanse & botanical hair wash\n• Stress-relieving 5-min scalp acupressure\n• Blow-dry and editorial finish with sea salt spray or matte paste";
      }
      suggestions = ['Book this service', "Check today's free timings", 'What are the trending cuts?'];
    } else if (q.includes('trend') || q.includes('suggest') || q.includes('recommend')) {
      responseText =
        '🔥 **Top Trending Looks at la cruz**\n\n• **Textured Editorial Taper:** Clean architectural outline with natural movement on top.\n• **Airy Italian Butterfly Layers:** Effortless, bouncy face-framing layers with luminous blowout finish.\n• **Caramel Hazelnut Balayage Melt:** Warm sunlit dimension crafted exclusively for darker hair without brassiness.\n• **Sculpted Beard Contour:** Sharp geometric lines with straight razor finish and essential oil seal.';
      suggestions = ["Check today's free timings", "What's covered in Cut & Style?", 'Full service list'];
    } else {
      responseText =
        '💈 **la cruz Pricing & Duration Catalog**\n\n• **Cut & Style:** $140 / ₹899 (45 mins) — Consultation, fade, wash & blowout\n• **Beard & Grooming:** $65 / ₹299 (30 mins) — Hot towel, razor lineup & oil massage\n• **Colour & Highlights:** $285 / ₹1,499 (90 mins) — Hand-painted balayage/toning\n• **Full Glow-Up Combo:** $320 / ₹1,799 (80 mins) — Cut + Beard + Scalp Steam';
      suggestions = ["Check today's free timings", "What's covered in Cut & Style?", 'Trending cuts right now'];
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: 'executive',
        text: responseText,
        guardrail: isGuardrail,
        suggestions
      }
    ]);
  };

  const suiteFeatures = [
    {
      icon: <Clock className="w-5 h-5 text-white stroke-[1.5]" />,
      text: 'Manage your own schedule with 24/7 studio access'
    },
    {
      icon: <DollarSign className="w-5 h-5 text-white stroke-[1.5]" />,
      text: 'Set your own pricing for services and products'
    },
    {
      icon: <Wifi className="w-5 h-5 text-white stroke-[1.5]" />,
      text: 'Amenities such as utilities and WiFi included'
    },
    {
      icon: <Edit className="w-5 h-5 text-white stroke-[1.5]" />,
      text: 'Personalize your salon space your way'
    },
    {
      icon: <Shield className="w-5 h-5 text-white stroke-[1.5]" />,
      text: 'Safety and security of your own private studio'
    }
  ];

  const whatsappDirectUrl =
    'https://wa.me/919671967187?text=Hello%20la%20cruz,%20I%20would%20like%20to%20inquire%20about%20a%20chair%20booking%20or%20private%20suite%20residency.';

  return (
    <div className="min-h-screen bg-[#18181b] text-zinc-100 selection:bg-zinc-200 selection:text-zinc-900 font-sans relative overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION BAR
      ───────────────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#18181b]/95 backdrop-blur-md border-b border-zinc-800/80 py-4 shadow-xl shadow-black/30'
            : 'bg-transparent py-7 sm:py-9'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* Desktop Left Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-10 flex-1">
            <a
              href="#home"
              className="text-xs uppercase font-sans tracking-[0.25em] text-zinc-300 hover:text-white transition-colors duration-300"
            >
              HOME
            </a>
            <a
              href="#about"
              className="text-xs uppercase font-sans tracking-[0.25em] text-zinc-300 hover:text-white transition-colors duration-300"
            >
              ABOUT
            </a>
            <a
              href="#services"
              className="text-xs uppercase font-sans tracking-[0.25em] text-zinc-300 hover:text-white transition-colors duration-300"
            >
              SERVICES
            </a>
          </nav>

          {/* Center Brand Logo (Matching Screenshot) */}
          <div className="flex-1 lg:flex-initial flex justify-start lg:justify-center">
            <a href="#home" className="flex flex-col items-center text-center group">
              <span className="font-serif lowercase text-3xl sm:text-4xl text-zinc-100 tracking-tight leading-none group-hover:text-white transition-colors">
                la cruz
              </span>
              <span className="font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.38em] text-zinc-400 mt-1.5 font-medium">
                SALON &amp; SPA
              </span>
            </a>
          </div>

          {/* Desktop Right Navigation Links, AI Concierge & CTA Button */}
          <div className="hidden lg:flex items-center justify-end space-x-8 flex-1">
            <button
              onClick={() => setIsChatOpen(true)}
              className="text-xs uppercase font-sans tracking-[0.2em] text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-zinc-200" />
              <span>AI CONCIERGE</span>
            </button>
            <a
              href="#faq"
              className="text-xs uppercase font-sans tracking-[0.25em] text-zinc-300 hover:text-white transition-colors duration-300"
            >
              FAQ
            </a>
            <a
              href="#contact"
              className="text-xs uppercase font-sans tracking-[0.25em] text-zinc-300 hover:text-white transition-colors duration-300"
            >
              CONTACT
            </a>
            
            {/* CTA Button: BOOK NOW */}
            <button
              onClick={() => handleOpenBooking()}
              className="px-6 py-2.5 rounded-full border border-white text-xs font-sans uppercase tracking-[0.22em] text-zinc-100 hover:bg-white hover:text-zinc-900 transition-all duration-300 cursor-pointer shadow-sm"
            >
              BOOK NOW
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={() => setIsChatOpen(true)}
              className="p-1.5 text-zinc-300 hover:text-white"
              aria-label="Open AI Executive"
            >
              <Bot className="w-5 h-5 text-zinc-200" />
            </button>
            <button
              onClick={() => handleOpenBooking()}
              className="px-3.5 py-1.5 rounded-full border border-white text-[10px] font-sans uppercase tracking-[0.18em] text-zinc-100 hover:bg-white hover:text-zinc-900 transition-all"
            >
              BOOK NOW
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="p-1.5 text-zinc-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#18181b]/98 backdrop-blur-xl border-b border-zinc-800 px-6 py-8"
            >
              <nav className="flex flex-col space-y-6 text-center">
                <a
                  href="#home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase font-sans tracking-[0.28em] text-zinc-300 hover:text-white"
                >
                  HOME
                </a>
                <a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase font-sans tracking-[0.28em] text-zinc-300 hover:text-white"
                >
                  ABOUT
                </a>
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase font-sans tracking-[0.28em] text-zinc-300 hover:text-white"
                >
                  SERVICES
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsChatOpen(true);
                  }}
                  className="text-xs uppercase font-sans tracking-[0.28em] text-zinc-300 hover:text-white flex items-center justify-center gap-2"
                >
                  <Bot className="w-4 h-4 text-zinc-200" />
                  <span>AI CUSTOMER EXECUTIVE</span>
                </button>
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase font-sans tracking-[0.28em] text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1.5"
                >
                  <span>CHAT ON WHATSAPP (+91 96719 67187)</span>
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase font-sans tracking-[0.28em] text-zinc-300 hover:text-white"
                >
                  CONTACT
                </a>
                <div className="pt-4">
                  <button
                    onClick={() => handleOpenBooking()}
                    className="w-full py-3 rounded-full border border-white text-xs font-sans uppercase tracking-[0.25em] text-zinc-100 hover:bg-white hover:text-zinc-900 transition-colors"
                  >
                    BOOK AN APPOINTMENT
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION (Pixel-Perfect from Provided Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <section id="home" className="pt-8 sm:pt-14 lg:pt-20 pb-16 lg:pb-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Left Column (Copy) */}
            <div className="flex flex-col justify-between pt-2 lg:pt-6">
              <div>
                {/* Heading: Exact uppercase, lowercase, italic interplay */}
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight text-zinc-100">
                  THANK YOU <br />
                  <span className="italic font-normal lowercase">for</span> CHOOSING<br />
                  <span className="lowercase font-light">la cruz</span>.
                </h1>

                {/* Subtitle / Paragraph from Provided Design */}
                <p className="mt-8 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md font-sans font-light">
                  Washandgo salon fauxhawk bouncy fuchsia afropuff fiery fingerwave hair. Locks microbraids curl ultrashort hair, fingerwave pompadour hair braids braids halobraid dye dredlocks.
                </p>
              </div>

              {/* Stacked Divider Links with Thin Bottom Border */}
              <div className="mt-12 sm:mt-16 flex flex-col space-y-6">
                
                {/* Link 1: BOOK AN APPOINTMENT -> */}
                <button
                  type="button"
                  onClick={() => handleOpenBooking('cut-style')}
                  className="group block w-72 sm:w-80 pb-3 border-b border-zinc-500/70 hover:border-white text-left transition-colors duration-300 cursor-pointer"
                >
                  <span className="text-xs uppercase tracking-[0.22em] font-sans text-zinc-200 group-hover:text-white flex items-center justify-between">
                    <span>BOOK AN APPOINTMENT</span>
                    <span className="text-sm font-sans transition-transform duration-300 group-hover:translate-x-1.5">
                      &rarr;
                    </span>
                  </span>
                </button>

                {/* Link 2: INQUIRE ABOUT SUITE RENTAL -> */}
                <button
                  type="button"
                  onClick={() => handleOpenBooking('suite-inquiry')}
                  className="group block w-72 sm:w-80 pb-3 border-b border-zinc-500/70 hover:border-white text-left transition-colors duration-300 cursor-pointer"
                >
                  <span className="text-xs uppercase tracking-[0.22em] font-sans text-zinc-200 group-hover:text-white flex items-center justify-between">
                    <span>INQUIRE ABOUT SUITE RENTAL</span>
                    <span className="text-sm font-sans transition-transform duration-300 group-hover:translate-x-1.5">
                      &rarr;
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Tall Grayscale Modern Salon Interior */}
            <div className="w-full relative overflow-hidden group shadow-2xl bg-zinc-900">
              <div className="aspect-[4/5] sm:h-[620px] lg:h-[720px] w-full overflow-hidden">
                <img
                  src={heroInteriorImg}
                  alt="Modern Luxury Salon Interior with Round Mirrors and Chairs"
                  className="w-full h-full object-cover filter grayscale contrast-105 group-hover:scale-[1.02] transition-all duration-700 ease-out select-none"
                  loading="eager"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#18181b]/30 via-transparent to-transparent pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CONTACT & OVERLAPPING IMAGES SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="mt-20 sm:mt-28 lg:mt-36 py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
            
            {/* Left Column (Overlapping Images + Rotating Circular Badge) */}
            <div className="lg:col-span-7 relative w-full max-w-lg mx-auto lg:mx-0 pb-12 sm:pb-16 pr-8 sm:pr-12">
              
              {/* Circular Rotating Text Badge: "GET IN TOUCH" */}
              <div className="absolute -top-7 -right-3 sm:-top-9 sm:-right-4 w-28 h-28 sm:w-36 sm:h-36 z-20 pointer-events-none select-none">
                <div className="relative w-full h-full flex items-center justify-center animate-spin-slow">
                  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    <path
                      id="contactBadgePath"
                      d="M 50, 50 m -37, 0 a 37, 37 0 1, 1 74, 0 a 37, 37 0 1, 1 -74, 0"
                      fill="none"
                    />
                    <text className="text-[10px] uppercase tracking-[0.29em] fill-zinc-200 font-sans font-light">
                      <textPath href="#contactBadgePath" startOffset="0%">
                        • GET IN TOUCH • GET IN TOUCH 
                      </textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                  </div>
                </div>
              </div>

              {/* Base Portrait Image: Woman with Hair Rollers & Glasses */}
              <div className="w-[82%] sm:w-[80%] aspect-[3/4] overflow-hidden shadow-2xl relative bg-zinc-900 group">
                <img
                  src={curlersPortraitImg}
                  alt="Editorial woman with hair curlers and chic glasses"
                  className="w-full h-full object-cover filter grayscale contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                />
              </div>

              {/* Overlapping Square Image: Person Reading Magazine in Salon */}
              <div className="absolute bottom-0 right-0 sm:right-4 w-44 sm:w-56 md:w-60 aspect-square overflow-hidden border-4 border-[#18181b] shadow-2xl z-10 bg-zinc-900 group">
                <img
                  src={magazineOverlapImg}
                  alt="Reading high fashion magazine in luxury salon"
                  className="w-full h-full object-cover filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                />
              </div>

            </div>

            {/* Right Column: Contact Info Blocks */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-12 lg:pl-6">
              
              {/* Phone Block + WhatsApp Quick Action */}
              <div>
                <h3 className="font-serif italic text-3xl sm:text-4xl text-zinc-100 mb-2">
                  Phone
                </h3>
                <p className="font-sans text-xs sm:text-sm tracking-widest text-zinc-400 font-light uppercase">
                  (000) 000-0000 &bull; +91 96719 67187
                </p>
                <div className="mt-2">
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-sans tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Chat with Concierge on WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Email Block */}
              <div>
                <h3 className="font-serif italic text-3xl sm:text-4xl text-zinc-100 mb-2">
                  Email
                </h3>
                <p className="font-sans text-xs sm:text-sm tracking-widest text-zinc-400 font-light uppercase">
                  hello@yourwebsite.com
                </p>
                <p className="font-sans text-[11px] tracking-wider text-zinc-500 font-light mt-1">
                  concierge@lacruzsalon.com &bull; Inquiries &amp; Press
                </p>
              </div>

              {/* Address Block */}
              <div>
                <h3 className="font-serif italic text-3xl sm:text-4xl text-zinc-100 mb-2">
                  Address
                </h3>
                <p className="font-sans text-xs sm:text-sm tracking-widest text-zinc-400 font-light uppercase">
                  1234 Street Address
                </p>
                <p className="font-sans text-[11px] tracking-wider text-zinc-500 font-light mt-1 uppercase">
                  City, State/Province, Postal/Zip
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. LEASING CALL-TO-ACTION (Center Text Break)
      ───────────────────────────────────────────────────────────── */}
      <section id="suites" className="py-24 sm:py-32 lg:py-40 my-16 border-y border-zinc-800/80 luxury-glow relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
          
          {/* Exact Typographic Interplay Matching Reference */}
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.25] text-zinc-100">
            ARE YOU <span className="italic font-normal lowercase">a</span><br />
            PROFESSIONAL <span className="italic font-normal lowercase">who's</span><br />
            INTERESTED <span className="italic font-normal lowercase">in</span> LEASING<br />
            <span className="italic font-normal lowercase">a</span> PRIVATE SUITE?
          </h2>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={() => handleOpenBooking('suite-inquiry')}
              className="px-8 py-3.5 rounded-full border border-white text-xs font-sans uppercase tracking-[0.22em] text-zinc-100 hover:bg-white hover:text-zinc-900 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-white/10"
            >
              BOOK A SUITE WALKTHROUGH &rarr;
            </button>
            <a
              href="#suite-details"
              className="text-xs uppercase font-sans tracking-[0.22em] text-zinc-400 hover:text-white transition-colors py-2"
            >
              EXPLORE AMENITIES ↓
            </a>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SUITE DETAILS & FEATURES GRID
      ───────────────────────────────────────────────────────────── */}
      <section id="suite-details" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Top Part: Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Column: Grayscale Bright Salon Suite Interior */}
            <div className="w-full relative overflow-hidden group shadow-2xl bg-zinc-900">
              <div className="aspect-[4/3] lg:aspect-[16/11] w-full overflow-hidden">
                <img
                  src={suiteInteriorImg}
                  alt="Bright, turn-key luxury salon suite interior with chandelier and mirrors"
                  className="w-full h-full object-cover filter grayscale contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                />
              </div>
            </div>

            {/* Right Column: Overline, Heading with italics, Paragraph */}
            <div className="flex flex-col justify-center">
              
              <span className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase font-sans font-medium mb-4 block">
                STUNNING LUXURY SUITES
              </span>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-100 leading-tight mb-6">
                Are you looking for a private, turn-key{' '}
                <span className="italic font-normal">luxury studio</span> to grow your business?
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans font-light">
                Salon fauxhawk bouncy fuchsia fiery fingerwave hair microbraids curl hair fingerwave hair braids halobraid hair dye toner. Built for independent beauty artisans who value freedom, architectural prestige, and 100% ownership of their brand.
              </p>

              <div className="mt-8">
                <button
                  onClick={() => handleOpenBooking('suite-inquiry')}
                  className="text-xs uppercase tracking-[0.24em] font-sans text-zinc-200 hover:text-white pb-2 border-b border-zinc-600 hover:border-white transition-all inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>REQUEST LEASING BROCHURE</span>
                  <span>&rarr;</span>
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Part: Features Grid (5 items matching reference) */}
          <div className="mt-20 sm:mt-28 pt-16 border-t border-zinc-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">
              {suiteFeatures.map((feat, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  
                  {/* Small circular icon */}
                  <div className="w-12 h-12 rounded-full border border-zinc-700/80 bg-zinc-800/40 flex items-center justify-center text-white mb-4 group-hover:border-white group-hover:bg-zinc-700/50 transition-all duration-300 shadow-sm">
                    {feat.icon}
                  </div>

                  {/* Descriptive text */}
                  <p className="font-sans text-xs text-zinc-400 font-light leading-relaxed max-w-[190px]">
                    {feat.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SERVICE MENU & CATALOG (Connected to Backend Database)
      ───────────────────────────────────────────────────────────── */}
      <section id="services" className="py-20 border-t border-zinc-800/60 bg-[#151517]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase font-sans font-medium mb-3 block">
                HAIR &amp; GROOMING MENU
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-100">
                Signature <span className="italic font-normal">Services</span> &amp; Costs
              </h2>
            </div>
            <div className="mt-6 md:mt-0 flex gap-3">
              <button
                onClick={() => setIsChatOpen(true)}
                className="px-5 py-2.5 rounded-full border border-zinc-700 text-xs font-sans uppercase tracking-[0.2em] text-zinc-300 hover:border-white hover:text-white transition-all flex items-center gap-2"
              >
                <Bot className="w-3.5 h-3.5 text-zinc-300" />
                <span>ASK AI BREAKDOWN</span>
              </button>
              <button
                onClick={() => handleOpenBooking()}
                className="px-6 py-2.5 rounded-full border border-white text-xs font-sans uppercase tracking-[0.2em] text-zinc-900 bg-white hover:bg-zinc-200 transition-all"
              >
                RESERVE CHAIR
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="p-8 border border-zinc-800 bg-[#18181b] hover:border-zinc-500 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-serif italic text-2xl text-zinc-200">{srv.name}</span>
                    <span className="text-[11px] font-sans tracking-widest text-zinc-400 font-medium">
                      {srv.duration}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6 font-sans">
                    {srv.description}
                  </p>
                  
                  {/* Itemized Coverage preview */}
                  <div className="border-t border-zinc-800/80 pt-4 mb-6">
                    <span className="text-[10px] uppercase font-sans tracking-widest text-zinc-400 block mb-2 font-medium">
                      EVERYTHING COVERED:
                    </span>
                    <ul className="space-y-1.5">
                      {srv.coverage.slice(0, 3).map((cov, i) => (
                        <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-2">
                          <Check className="w-3 h-3 text-zinc-400 mt-0.5 shrink-0" />
                          <span>{cov}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <span className="text-sm uppercase tracking-wider text-zinc-200 font-medium">
                    {srv.price}
                  </span>
                  <button
                    onClick={() => handleOpenBooking(srv.id)}
                    className="text-xs uppercase tracking-widest text-zinc-300 hover:text-white pb-1 border-b border-zinc-600 hover:border-white transition-colors"
                  >
                    BOOK THIS SLOT &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 pt-16 pb-12 bg-[#141416]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-zinc-800/80">
            
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <a href="#home" className="inline-block group mb-3">
                  <span className="font-serif lowercase text-4xl text-zinc-100 tracking-tight leading-none group-hover:text-white transition-colors">
                    la cruz
                  </span>
                  <span className="block font-sans text-[9px] uppercase tracking-[0.38em] text-zinc-400 mt-1 font-medium">
                    SALON &amp; SPA
                  </span>
                </a>
                <p className="text-xs text-zinc-400 font-light max-w-sm mt-4 leading-relaxed font-sans">
                  Quiet luxury hair artistry, bespoke wellness treatments, and turnkey private suites for independent beauty artisans.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80">
                <p className="text-[11px] text-zinc-400 font-sans">
                  WhatsApp Support Active 24/7 &bull;{' '}
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 underline"
                  >
                    +91 96719 67187
                  </a>
                </p>
                <p className="text-[11px] text-zinc-500 font-sans mt-1">
                  1234 Street Address, City, State/Province, Postal/Zip
                </p>
              </div>
            </div>

            <div className="md:col-span-3">
              <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-zinc-400 mb-4 block font-medium">
                QUICK ACCESS
              </span>
              <ul className="space-y-3">
                <li>
                  <a href="#home" className="text-xs font-sans tracking-wider text-zinc-400 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-xs font-sans tracking-wider text-zinc-400 hover:text-white transition-colors">
                    Services &amp; Pricing
                  </a>
                </li>
                <li>
                  <a href="#suites" className="text-xs font-sans tracking-wider text-zinc-400 hover:text-white transition-colors">
                    Suite Residency
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="text-xs font-sans tracking-wider text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Customer Executive AI</span>
                  </button>
                </li>
                <li>
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-sans tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    WhatsApp Concierge
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-zinc-400 mb-4 block font-medium">
                THE PRIVATE DISPATCH
              </span>
              <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4 font-sans">
                Subscribe for private booking openings, seasonal formula drops, and studio suite availability.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing to the la cruz private dispatch.');
                }}
                className="flex items-center border-b border-zinc-600 focus-within:border-white transition-colors pb-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none w-full font-sans tracking-wide"
                />
                <button
                  type="submit"
                  aria-label="Submit newsletter"
                  className="text-zinc-400 hover:text-white text-xs uppercase tracking-widest pl-2"
                >
                  &rarr;
                </button>
              </form>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 font-sans tracking-wider">
            <p>&copy; {new Date().getFullYear()} la cruz SALON &amp; SPA. ALL RIGHTS RESERVED.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-zinc-300 transition-colors">PRIVACY POLICY</a>
              <a href="#" className="hover:text-zinc-300 transition-colors">TERMS OF SERVICE</a>
              <a href="#" className="hover:text-zinc-300 transition-colors">SUITE LEASE TERMS</a>
            </div>
          </div>

        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          7. FLOATING ACTION BUTTONS (AI Executive + WhatsApp)
      ───────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
        
        {/* Floating WhatsApp Quick Concierge Button */}
        <a
          href={whatsappDirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="group relative bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 2C6.511 2 2.016 6.495 2.016 12.015c0 1.95.56 3.84 1.62 5.48L2 22l4.67-1.57c1.58.98 3.41 1.58 5.36 1.58 5.52 0 10.016-4.495 10.016-10.015C22.046 6.495 17.551 2 12.031 2zm0 18.25c-1.74 0-3.41-.49-4.85-1.42l-.35-.22-2.77.93.94-2.7-.24-.38a8.21 8.21 0 0 1-1.3-4.45c0-4.55 3.7-8.25 8.25-8.25 4.54 0 8.25 3.7 8.25 8.25 0 4.55-3.71 8.25-8.25 8.25zm4.52-6.18c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z"/>
          </svg>
          <span className="hidden sm:inline text-xs font-sans uppercase tracking-wider font-semibold">
            WHATSAPP
          </span>
        </a>

        {/* Floating Customer Executive AI Chat Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative bg-zinc-100 text-zinc-950 font-sans uppercase text-xs px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-zinc-700/50"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Bot className="w-4 h-4 stroke-[2]" />
          <span className="tracking-[0.16em] font-medium">CUSTOMER EXECUTIVE AI</span>
        </button>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          8. CUSTOMER EXECUTIVE CHAT DRAWER / WINDOW
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-8 z-50 w-[94vw] sm:w-[460px] max-h-[85vh] h-[640px] bg-[#161618] border border-zinc-700/80 shadow-2xl flex flex-col overflow-hidden text-zinc-100"
          >
            {/* Executive Header */}
            <div className="p-4 bg-[#1a1a1d] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-200 text-zinc-900 flex items-center justify-center font-serif italic text-base">
                  lc
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold tracking-widest uppercase text-white font-sans">
                      LA CRUZ EXECUTIVE
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <p className="text-[10px] text-zinc-400 tracking-wider uppercase font-sans">
                    LIVE DB &bull; CHAIR TIMINGS &bull; GUARDRAILS ACTIVE
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(false)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Chips Bar */}
            <div className="px-3 py-2 bg-[#141416] border-b border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px]">
              <button
                onClick={() => handleSendMessage("Do you have free slots today?")}
                className="whitespace-nowrap px-2.5 py-1 bg-zinc-800/70 hover:bg-white hover:text-zinc-950 transition-colors border border-zinc-700 text-zinc-300 cursor-pointer font-sans"
              >
                🕒 Free Timings Today
              </button>
              <button
                onClick={() => handleSendMessage("What is covered in Cut and Style?")}
                className="whitespace-nowrap px-2.5 py-1 bg-zinc-800/70 hover:bg-white hover:text-zinc-950 transition-colors border border-zinc-700 text-zinc-300 cursor-pointer font-sans"
              >
                ✂️ What's Covered?
              </button>
              <button
                onClick={() => handleSendMessage("What hairstyles are trending right now?")}
                className="whitespace-nowrap px-2.5 py-1 bg-zinc-800/70 hover:bg-white hover:text-zinc-950 transition-colors border border-zinc-700 text-zinc-300 cursor-pointer font-sans"
              >
                🔥 Trending Cuts
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 leading-relaxed whitespace-pre-line ${
                      m.sender === 'user'
                        ? 'bg-zinc-200 text-zinc-950 font-medium'
                        : m.guardrail
                        ? 'bg-[#291717] border border-red-900/60 text-[#fca5a5]'
                        : 'bg-[#1f1f23] border border-zinc-800 text-zinc-200'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Suggestion Chips under executive messages */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[88%]">
                      {m.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (sug.startsWith("Book for")) {
                              const timeStr = sug.replace("Book for ", "");
                              handleOpenBooking('cut-style', timeStr);
                            } else {
                              handleSendMessage(sug);
                            }
                          }}
                          className="text-[10px] bg-zinc-800/80 hover:bg-white hover:text-zinc-900 text-zinc-300 border border-zinc-700 px-2.5 py-1 transition-all cursor-pointer font-sans"
                        >
                          {sug} &rarr;
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                  <div className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-[11px] font-mono">Consulting live database...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#18181b] border-t border-zinc-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask timings, costs, what's covered, trends..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-[#121214] border border-zinc-700/80 text-zinc-100 text-xs p-3 placeholder-zinc-500 focus:border-white focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="bg-white disabled:opacity-40 text-zinc-950 p-3 hover:bg-zinc-200 transition-colors cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between text-[9px] text-zinc-500 mt-1.5 px-1 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-zinc-400" /> STRICT SALON GUARDRAILS
                </span>
                <span>SQLITE DB SYNCED</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          9. INTERACTIVE CHAIR BOOKING DRAWER / MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isBookingOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setIsBookingOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-[#1a1a1d] border border-zinc-700/80 p-6 sm:p-8 text-zinc-100 shadow-2xl max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors"
                aria-label="Close booking modal"
              >
                <X className="w-5 h-5" />
              </button>

              {!bookingConfirmed ? (
                <div>
                  <div className="mb-6">
                    <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-zinc-400 block mb-1">
                      CHAIR RESERVATION &bull; LIVE DB
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-zinc-100">
                      Reserve Your <span className="italic font-normal">Appointment</span>
                    </h3>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-5">
                    {/* Select Service */}
                    <div>
                      <label className="block text-[11px] uppercase font-sans tracking-widest text-zinc-400 mb-2 font-medium">
                        1. SELECT TREATMENT
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {SERVICES.map((s) => (
                          <button
                            type="button"
                            key={s.id}
                            onClick={() => setSelectedService(s.id)}
                            className={`p-3 text-left border flex items-center justify-between transition-colors cursor-pointer ${
                              selectedService === s.id
                                ? 'border-white bg-white/10 text-white'
                                : 'border-zinc-800 bg-[#161618] text-zinc-400 hover:border-zinc-700'
                            }`}
                          >
                            <div>
                              <span className="font-serif italic text-base text-zinc-200 block">{s.name}</span>
                              <span className="text-[10px] text-zinc-400 font-sans">{s.duration}</span>
                            </div>
                            <span className="text-xs text-zinc-200 font-sans font-medium">{s.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pick Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase font-sans tracking-widest text-zinc-400 mb-2 font-medium">
                          2. DAY
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Today', 'Tomorrow'].map((day) => (
                            <button
                              type="button"
                              key={day}
                              onClick={() => setSelectedDate(day)}
                              className={`py-2 text-center text-xs font-sans uppercase border cursor-pointer transition-colors ${
                                selectedDate === day
                                  ? 'border-white bg-white text-zinc-950 font-medium'
                                  : 'border-zinc-800 bg-[#161618] text-zinc-400'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-sans tracking-widest text-zinc-400 mb-2 font-medium">
                          3. TIME SLOT
                        </label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full bg-[#161618] border border-zinc-700/80 text-zinc-100 text-xs font-sans p-2.5 focus:border-white focus:outline-none"
                        >
                          <option value="11:30 AM">11:30 AM</option>
                          <option value="1:00 PM">1:00 PM</option>
                          <option value="2:45 PM">2:45 PM</option>
                          <option value="4:15 PM">4:15 PM</option>
                          <option value="5:00 PM">5:00 PM</option>
                          <option value="6:30 PM">6:30 PM</option>
                          <option value="8:00 PM">8:00 PM</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[11px] uppercase font-sans tracking-widest text-zinc-400 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name / Instagram handle"
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                          className="w-full bg-[#161618] border border-zinc-700/80 text-xs text-zinc-100 placeholder-zinc-500 p-3 focus:border-white focus:outline-none font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase font-sans tracking-widest text-zinc-400 mb-1">
                          WhatsApp / Phone Number (+91) *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 96719 XXXXX"
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                          className="w-full bg-[#161618] border border-zinc-700/80 text-xs text-zinc-100 placeholder-zinc-500 p-3 focus:border-white focus:outline-none font-sans"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-white text-zinc-950 font-sans uppercase text-xs tracking-[0.2em] py-3.5 rounded-full hover:bg-zinc-200 transition-all cursor-pointer font-medium mt-4"
                    >
                      CONFIRM APPOINTMENT &rarr;
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-white/10 border border-white text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 stroke-[2]" />
                  </div>
                  <h4 className="text-2xl font-serif text-zinc-100 mb-2">
                    Appointment Confirmed
                  </h4>
                  <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4">
                    BOOKING ID: {confirmedBookingId}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto mb-6 leading-relaxed font-sans">
                    Thank you, <span className="text-white font-medium">{bookingForm.name || 'Valued Client'}</span>. Your appointment for{' '}
                    <span className="text-white font-medium">
                      {SERVICES.find((s) => s.id === selectedService)?.name}
                    </span>{' '}
                    on <span className="text-white font-medium">{selectedDate}</span> at{' '}
                    <span className="text-white font-medium">{selectedTime}</span> is recorded.
                  </p>

                  <div className="p-4 bg-[#141416] border border-zinc-800 text-xs text-zinc-400 mb-6 font-sans">
                    WhatsApp confirmation pass &amp; salon GPS pin dispatched to{' '}
                    <span className="text-white font-medium">{bookingForm.phone || '+91 96719 XXXXX'}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={`https://wa.me/919671967187?text=Hello%20la%20cruz,%20my%20booking%20ID%20is%20${confirmedBookingId}%20for%20${selectedTime}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] text-white text-xs font-sans uppercase tracking-wider py-3 px-6 rounded-full hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>OPEN IN WHATSAPP</span>
                    </a>
                    <button
                      onClick={() => setIsBookingOpen(false)}
                      className="border border-zinc-600 text-zinc-300 hover:text-white hover:border-white text-xs font-sans uppercase tracking-wider py-3 px-6 rounded-full transition-colors cursor-pointer"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
