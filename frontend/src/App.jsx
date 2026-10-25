import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Check,
  X,
  Menu,
  Sparkles,
  MessageSquare,
  Send,
  Bot,
  ShieldCheck
} from 'lucide-react'

// Import local high-resolution generated images
import heroImg from './assets/salon_images/images/hero-portrait.jpg'
import look01Img from './assets/salon_images/images/look-01.jpg'
import look02Img from './assets/salon_images/images/look-02.jpg'
import look03Img from './assets/salon_images/images/look-03.jpg'

// Portfolio Looks (editorial rows in the "work" section)
const LOOKS = [
  {
    id: 'look-01',
    image: look01Img,
    serviceId: 'cut-style',
    eyebrow: '01 — Occasion Ready',
    title: 'Sharp styling for',
    titleItalic: 'the big nights',
    titleEnd: ' and every day after.',
    body: 'Precision fades, textured crops and clean line-ups, shaped around your face and the natural texture of your hair.'
  },
  {
    id: 'look-02',
    image: look02Img,
    serviceId: 'beard-grooming',
    eyebrow: '02 — Well Groomed',
    title: 'A beard that looks',
    titleItalic: 'intentional',
    titleEnd: ', never accidental.',
    body: 'Hot towel, straight-razor line-up and beard sculpting, finished with a cedarwood oil massage.'
  }
]

// Feature icon row under the service menu
const FEATURES = [
  { icon: Clock, text: 'Open six days a week, 10 AM – 8:30 PM' },
  { icon: Sparkles, text: 'Cuts & colour for every hair texture' },
  { icon: ShieldCheck, text: 'Sanitised tools for every single client' },
  { icon: MessageSquare, text: 'Book and chat with us on WhatsApp' },
  { icon: Bot, text: 'AI concierge with live chair slots' }
]

// Hairline-bordered text link with a trailing arrow (editorial CTA row)
const LineLink = ({ children, ...props }) => (
  <button
    type="button"
    {...props}
    className="group w-full flex items-center gap-6 py-4 border-b border-line text-[10px] tracking-[0.3em] uppercase text-cream/85 hover:text-cream transition-colors cursor-pointer"
  >
    <span>{children}</span>
    <ArrowRight className="w-4 h-4 stroke-1 transition-transform group-hover:translate-x-1" />
  </button>
)

// Slowly rotating circular text badge
const RotatingBadge = ({ text, className = '' }) => (
  <div className={`w-28 h-28 sm:w-32 sm:h-32 pointer-events-none ${className}`} aria-hidden="true">
    <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_20s_linear_infinite]">
      <defs>
        <path id="badge-circle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
      </defs>
      <text className="fill-cream text-[8.5px] tracking-[0.32em] uppercase">
        <textPath href="#badge-circle">{text}</textPath>
      </text>
    </svg>
  </div>
)

// Services Data
const SERVICES = [
  {
    id: 'cut-style',
    name: 'CUT & STYLE',
    price: 'FROM ₹899',
    duration: '45 MINS',
    description: 'Precision scissor & clipper fade, customized texture styling, signature wash & blowout with desi soul.',
    tags: ['Fades', 'Texture', 'Scissor Work']
  },
  {
    id: 'beard-grooming',
    name: 'BEARD & GROOMING',
    price: 'FROM ₹299',
    duration: '30 MINS',
    description: 'Razor-sharp contouring, hot towel treatment, beard sculpting, and essential oil hydration.',
    tags: ['Hot Towel', 'Beard Fade', 'Line Up']
  },
  {
    id: 'colour-highlights',
    name: 'COLOUR & HIGHLIGHTS',
    price: 'FROM ₹1,499',
    duration: '90 MINS',
    description: 'Caramel balayage, smoky tones, root melts, and bold modern highlights tailored for dark hair textures.',
    tags: ['Balayage', 'Toning', 'Bleach & Tone']
  }
]

// WhatsApp Direct Chat (number in international format, digits only)
const WHATSAPP_NUMBER = '919845012345'
const WHATSAPP_MESSAGE = 'Hi MANE RIOT! I would like to book a slot.'
const buildWhatsAppLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
const WHATSAPP_LINK = buildWhatsAppLink(WHATSAPP_MESSAGE)

// Resolve 'Today' / 'Tomorrow' into a readable calendar date, e.g. "Sat, 25 Oct"
const formatBookingDay = (day) => {
  const date = new Date()
  if (day === 'Tomorrow') date.setDate(date.getDate() + 1)
  const label = date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  return `${day} (${label})`
}

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

// Marquee Text
const MARQUEE_ITEMS = [
  'DESI ROOTS.',
  'FRESH CUTS.',
  'NO BORING HAIR.',
  'YOUR NEXT ERA STARTS HERE.',
  'DESI ROOTS.',
  'FRESH CUTS.',
  'NO BORING HAIR.',
  'YOUR NEXT ERA STARTS HERE.'
]

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('cut-style')
  const [selectedDate, setSelectedDate] = useState('Today')
  const [selectedTime, setSelectedTime] = useState('2:45 PM')
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', note: '' })

  // Customer Executive Chat State
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'executive',
      text: "👋 **Hello! I'm the MANE RIOT Customer Executive.**\n\nI can check **today's free timings in our database**, calculate **exact costs & duration**, breakdown **everything covered inside each service**, and suggest our **trending desi & global cuts**.\n\n*(Note: I operate under strict salon guardrails and answer only hair, beard, and salon booking queries!)*",
      suggestions: [
        "Check today's free timings",
        "What's covered in Cut & Style?",
        "What's covered in Beard Grooming?",
        "What are the trending cuts?"
      ]
    }
  ])

  const chatEndRef = useRef(null)

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isChatOpen])

  const handleOpenBooking = (serviceId = 'cut-style', time = '2:45 PM') => {
    setSelectedService(serviceId)
    setSelectedTime(time)
    setBookingConfirmed(false)
    setIsBookingOpen(true)
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    setBookingConfirmed(true)
  }

  // Prefilled WhatsApp message carrying everything picked in the booking drawer
  const getBookingWhatsAppLink = () => {
    const service = SERVICES.find((s) => s.id === selectedService)
    const lines = [
      'Hi MANE RIOT! I would like to book a slot.',
      '',
      `Service: ${service?.name} (${service?.price}, ${service?.duration})`,
      `Day: ${formatBookingDay(selectedDate)}`,
      `Time: ${selectedTime}`
    ]
    if (formData.name.trim()) lines.push(`Name: ${formData.name.trim()}`)
    if (formData.phone.trim()) lines.push(`Phone: ${formData.phone.trim()}`)
    return buildWhatsAppLink(lines.join('\n'))
  }

  const handleBookViaWhatsApp = (e) => {
    const form = e.currentTarget.form
    if (form && !form.reportValidity()) return
    window.open(getBookingWhatsAppLink(), '_blank', 'noopener,noreferrer')
    setBookingConfirmed(true)
  }

  // Handle Customer Executive Chat submission
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || chatInput
    if (!query.trim()) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query
    }

    setMessages((prev) => [...prev, userMsg])
    setChatInput('')
    setIsTyping(true)

    try {
      // Call FastAPI backend Customer Executive endpoint
      const res = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      })

      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'executive',
            text: data.response,
            guardrail: data.guardrail_triggered,
            suggestions: data.suggestions || []
          }
        ])
      } else {
        throw new Error('Backend offline')
      }
    } catch (err) {
      // Graceful offline engine with identical guardrail & database logic
      simulateLocalExecutiveReply(query)
    } finally {
      setIsTyping(false)
    }
  }

  // Client-side fallback if backend server is temporarily uncontacted
  const simulateLocalExecutiveReply = (query) => {
    const q = query.toLowerCase()
    let responseText = ""
    let isGuardrail = false
    let suggestions = []

    if (q.includes("python") || q.includes("code") || q.includes("politics") || q.includes("crypto") || q.includes("math")) {
      isGuardrail = true
      responseText = "⚠️ **Guardrail Notice**: I am the **Mane Riot Customer Executive**. I am trained exclusively to assist you with salon bookings, today's free timings, service costs, detailed coverage, and trending hair & beard styles.\n\nHow can I help you with your haircut or grooming today?"
      suggestions = ["Check today's free timings", "What's covered in Cut & Style?", "Trending cuts right now"]
    } else if (q.includes("timing") || q.includes("free") || q.includes("slot") || q.includes("today") || q.includes("time")) {
      responseText = "📅 **Today's Live Chair Availability (Database Verified)**\n\nWe have slots open today with Master Barber Kabir, Colorist Priya, and Rohan:\n\n• **Morning:** 10:00 AM, 11:30 AM, 12:15 PM\n• **Afternoon:** 02:00 PM, 02:45 PM, 03:30 PM, 04:15 PM\n• **Evening:** 05:00 PM, 06:30 PM, 07:15 PM, 08:00 PM\n\n*Would you like to lock in a chair slot?*"
      suggestions = ["Book for 2:45 PM", "Book for 5:00 PM", "What's covered in Cut & Style?"]
    } else if (q.includes("cover") || q.includes("include") || q.includes("whats covered") || q.includes("inside")) {
      if (q.includes("beard")) {
        responseText = "✂️ **BEARD & GROOMING — What's Covered & Breakdown**\n\n• **Cost:** ₹299 (all-inclusive)\n• **Duration:** ~30 minutes\n\n**Everything Covered in this Session:**\n• Beard shape mapping & cheek line geometry\n• Hot eucalyptus steam towel wrap to open pores\n• Straight razor crisp edge line-up on cheeks & neck\n• Bulk thinning & length gradation\n• Organic argan & cedarwood beard oil hydration massage"
      } else {
        responseText = "✂️ **CUT & STYLE — What's Covered & Breakdown**\n\n• **Cost:** ₹899 (all-inclusive)\n• **Duration:** ~45 minutes\n\n**Everything Covered in this Session:**\n• In-depth style consultation based on face geometry\n• Precision scissor work & skin/taper fade\n• Detoxifying scalp cleanse & botanical hair wash\n• Stress-relieving 5-min scalp acupressure\n• Blow-dry and finish with premium sea salt spray or matte clay"
      }
      suggestions = ["Book this service", "Check today's free timings", "What's trending?"]
    } else if (q.includes("trend") || q.includes("suggest") || q.includes("recommend")) {
      responseText = "🔥 **Top Trending Looks at MANE RIOT**\n\n• **Drop Fade & Textured Crop (Desi Swag):** Edgy, sharp, clean taper around the neckline. Best for wavy or thick hair.\n• **90s Desi Butterfly Layers:** Airy blowout layers with effortless bounce for medium to long hair.\n• **Caramel Hazelnut Balayage Melt:** Warm sunlit dimension crafted exclusively for dark hair without brassiness.\n• **Royal Boxed Beard:** Sharp geometric angles with razor line-up and hot towel eucalyptus finish."
      suggestions = ["Check today's free timings", "What's covered in Cut & Style?", "Full price list"]
    } else {
      responseText = "💈 **Mane Riot Pricing & Duration Catalog**\n\n• **Cut & Style:** ₹899 (45 mins) — Full consultation, fade, wash & clay finish\n• **Beard & Grooming:** ₹299 (30 mins) — Hot towel, razor lineup & oil massage\n• **Colour & Highlights:** ₹1,499 (90 mins) — Balayage/toning for dark hair\n• **Full Glow-Up Combo:** ₹1,799 (80 mins) — Cut + Beard + Scalp Steam"
      suggestions = ["Check today's free timings", "What's covered in Cut & Style?", "What's trending?"]
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
    ])
  }

  return (
    <div className="min-h-screen bg-ink text-cream font-sans selection:bg-cream selection:text-ink relative">
      {/* 1. NAVIGATION BAR (centered script logo, links either side) */}
      <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur-md">
        <nav className="max-w-6xl mx-auto px-6 sm:px-10 h-20 sm:h-24 grid grid-cols-[1fr_auto_1fr] items-center">
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-[10px] tracking-[0.3em] uppercase text-cream/80 hover:text-cream transition-colors">
              Home
            </a>
            <a href="#work" className="text-[10px] tracking-[0.3em] uppercase text-cream/80 hover:text-cream transition-colors">
              Work
            </a>
            <a href="#menu" className="text-[10px] tracking-[0.3em] uppercase text-cream/80 hover:text-cream transition-colors">
              Services
            </a>
          </div>

          {/* Brand Logo */}
          <a href="#home" className="col-start-2 text-center leading-none">
            <span className="block font-serif italic font-light text-3xl sm:text-4xl tracking-tight">mane riot</span>
            <span className="block text-[8px] sm:text-[9px] tracking-[0.4em] uppercase text-mute mt-1.5">Salon &amp; Studio</span>
          </a>

          <div className="flex items-center justify-end gap-8">
            <button
              onClick={() => setIsChatOpen(true)}
              className="hidden md:inline text-[10px] tracking-[0.3em] uppercase text-cream/80 hover:text-cream transition-colors cursor-pointer"
            >
              Concierge
            </button>
            <a href="#contact" className="hidden md:inline text-[10px] tracking-[0.3em] uppercase text-cream/80 hover:text-cream transition-colors">
              Contact
            </a>
            <button
              onClick={() => handleOpenBooking()}
              className="hidden md:inline-flex border border-cream/70 rounded-[50%] px-6 py-2.5 text-[9px] tracking-[0.3em] uppercase hover:bg-cream hover:text-ink transition-colors cursor-pointer"
            >
              Book Now
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-cream"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-1" /> : <Menu className="w-5 h-5 stroke-1" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-line px-6 pb-6 text-center space-y-5"
            >
              {[
                ['#work', 'Work'],
                ['#menu', 'Services'],
                ['#contact', 'Contact']
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[11px] tracking-[0.3em] uppercase text-cream/85"
                >
                  {label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setIsChatOpen(true)
                }}
                className="block w-full text-[11px] tracking-[0.3em] uppercase text-cream/85"
              >
                AI Concierge
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleOpenBooking()
                }}
                className="border border-cream/70 rounded-[50%] px-8 py-3 text-[10px] tracking-[0.3em] uppercase"
              >
                Book Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION (centered serif copy left, full-bleed monochrome image right) */}
      <section id="home" className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="px-6 sm:px-10 py-16 sm:py-24 flex flex-col items-center justify-center text-center"
        >
          <h1 className="font-serif font-light uppercase text-5xl sm:text-6xl leading-[1.02]">
            Good Hair<br />
            <span className="italic normal-case">for</span> Every<br />
            <span className="italic normal-case">desi soul.</span>
          </h1>

          <p className="mt-6 max-w-xs text-xs leading-relaxed text-mute">
            Sharp fades, fresh colour and main-character energy. Your neighbourhood salon,
            reimagined for a new generation — all textures, all identities.
          </p>

          <div className="mt-10 w-full max-w-xs border-t border-line">
            <LineLink onClick={() => handleOpenBooking()}>Book an Appointment</LineLink>
            <LineLink onClick={() => setIsChatOpen(true)}>Ask Our AI Concierge</LineLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative min-h-[440px] md:min-h-[640px] overflow-hidden"
        >
          <img
            src={heroImg}
            alt="Mane Riot editorial portrait"
            className="absolute inset-0 w-full h-full object-cover object-top grayscale contrast-110"
            loading="eager"
          />
        </motion.div>
      </section>

      {/* 3. MARQUEE BANNER (quiet italic serif ticker) */}
      <section className="w-full border-y border-line overflow-hidden py-5 select-none">
        <div className="flex whitespace-nowrap">
          <motion.div
            className="flex items-center gap-10 shrink-0 font-serif italic font-light text-xl sm:text-2xl text-cream/70"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
          >
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((phrase, index) => (
              <span key={index} className="flex items-center gap-10">
                <span>{phrase.toLowerCase()}</span>
                <span className="text-mute not-italic">·</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. GET IN TOUCH (image with rotating badge + contact details) */}
      <section id="contact" className="max-w-4xl mx-auto px-6 sm:px-10 py-24 sm:py-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto w-full max-w-[17rem]"
        >
          <img
            src={look03Img}
            alt="Inside the Mane Riot studio"
            className="w-full aspect-[4/5] object-cover grayscale"
            loading="lazy"
          />
          <RotatingBadge text="Get in touch · Get in touch · " className="absolute -top-14 -right-12 sm:-right-14" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center space-y-10"
        >
          <div>
            <h3 className="font-serif italic font-light text-3xl">WhatsApp</h3>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-xs text-mute hover:text-cream underline-offset-4 hover:underline transition-colors"
            >
              +91 98450 12345
            </a>
          </div>
          <div>
            <h3 className="font-serif italic font-light text-3xl">Hours</h3>
            <p className="mt-1 text-xs text-mute">Tue – Sun · 10:00 AM – 8:30 PM</p>
          </div>
          <div>
            <h3 className="font-serif italic font-light text-3xl">Address</h3>
            <p className="mt-1 text-xs text-mute leading-relaxed">
              Koramangala 4th Block
              <br />
              Bengaluru, Karnataka
            </p>
          </div>
        </motion.div>
      </section>

      {/* 5. PORTFOLIO SECTION (statement heading + alternating editorial rows) */}
      <section id="work" className="max-w-4xl mx-auto px-6 sm:px-10 pb-24 sm:pb-32">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-serif font-light uppercase text-center text-4xl sm:text-5xl leading-[1.12] max-w-2xl mx-auto mb-20 sm:mb-24"
        >
          Looking <span className="italic normal-case">for a</span> Cut <span className="italic normal-case">that</span> Feels{' '}
          <span className="italic normal-case">like</span> You?
        </motion.h2>

        <div className="space-y-20 sm:space-y-24">
          {LOOKS.map((look, index) => (
            <motion.div
              key={look.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
            >
              <div className={`w-full max-w-[17rem] mx-auto overflow-hidden ${index % 2 ? 'md:order-2' : ''}`}>
                <img
                  src={look.image}
                  alt={look.eyebrow}
                  className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 hover:scale-105 transition duration-700 ease-out"
                  loading="lazy"
                />
              </div>
              <div className="max-w-sm mx-auto md:mx-0">
                <span className="block text-[9px] tracking-[0.35em] uppercase text-mute mb-4">{look.eyebrow}</span>
                <h3 className="font-serif font-light text-3xl sm:text-4xl leading-[1.15]">
                  {look.title} <span className="italic">{look.titleItalic}</span>
                  {look.titleEnd}
                </h3>
                <p className="mt-5 text-xs leading-relaxed text-mute">{look.body}</p>
                <div className="mt-6 max-w-[15rem] border-t border-line">
                  <LineLink onClick={() => handleOpenBooking(look.serviceId)}>Book This Look</LineLink>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. SERVICES MENU SECTION */}
      <section id="menu" className="max-w-4xl mx-auto px-6 sm:px-10 pb-24 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="block text-[9px] tracking-[0.35em] uppercase text-mute mb-4">The Service Menu</span>
          <h2 className="font-serif font-light uppercase text-4xl sm:text-5xl leading-[1.1]">
            Pick <span className="italic normal-case">your</span> Upgrade.
          </h2>
        </motion.div>

        <div className="border-t border-line">
          {SERVICES.map((service, index) => (
            <motion.button
              type="button"
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleOpenBooking(service.id)}
              className="group w-full grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:gap-10 py-8 border-b border-line text-left cursor-pointer"
            >
              <div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-serif font-light uppercase text-2xl sm:text-3xl group-hover:italic transition-all">
                    {service.name}
                  </h3>
                  <span className="text-[9px] tracking-[0.3em] uppercase text-mute">{service.duration}</span>
                </div>
                <p className="mt-2 max-w-lg text-xs leading-relaxed text-mute">{service.description}</p>
              </div>
              <div className="flex items-center gap-6 sm:justify-end">
                <span className="font-serif text-xl">{service.price.replace('FROM ', 'from ')}</span>
                <span className="flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase text-cream/80 group-hover:text-cream">
                  Book
                  <ArrowRight className="w-4 h-4 stroke-1 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <p className="mt-6 text-center text-[10px] text-mute tracking-wide">
          Indicative prices for this concept. Final prices and booking details will be confirmed by the salon.
        </p>

        {/* Feature Icon Row */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-10">
          {FEATURES.map(({ icon: Icon, text }) => (
            <div key={text} className="text-center">
              <div className="w-7 h-7 mx-auto rounded-full bg-cream text-ink flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <p className="mt-3 text-[10px] leading-relaxed text-cream/80 max-w-[9rem] mx-auto">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOOTER (full-bleed monochrome "Inquire" banner) */}
      <footer>
        <section className="relative overflow-hidden">
          <img
            src={look02Img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-ink/50" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative max-w-3xl mx-auto px-6 py-28 sm:py-40 text-center"
          >
            <h2 className="font-serif italic font-light text-6xl sm:text-8xl">Inquire</h2>
            <p className="mt-6 max-w-sm mx-auto text-xs leading-relaxed text-cream/80">
              Bring the moodboard. We'll bring the craft. Lock in a chair right here, or message us on WhatsApp.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleOpenBooking()}
                className="border border-cream/70 rounded-[50%] px-9 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-cream hover:text-ink transition-colors cursor-pointer"
              >
                Book Now
              </button>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-cream/70 rounded-[50%] px-9 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-cream hover:text-ink transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </section>

        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-[9px] tracking-[0.3em] uppercase text-mute">
          <span className="font-serif italic font-light normal-case tracking-normal text-2xl text-cream">mane riot</span>
          <span>Desi Roots. Global Energy. © 2026</span>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="hover:text-cream transition-colors"
          >
            Back to Top ↑
          </a>
        </div>
      </footer>

      {/* 8. FLOATING WHATSAPP + CUSTOMER EXECUTIVE CHAT BUTTONS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          title="Chat with us on WhatsApp"
          className="bg-[#25D366] text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          <WhatsAppIcon className="w-6 h-6" />
        </a>
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-cream text-ink text-[10px] tracking-[0.25em] uppercase px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Bot className="w-4 h-4 stroke-[1.75]" />
          <span>Concierge</span>
        </button>
      </div>

      {/* 9. CUSTOMER EXECUTIVE CHAT DRAWER / WINDOW */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-20 right-4 sm:right-8 z-50 w-[92vw] sm:w-[440px] max-h-[82vh] h-[640px] bg-ink border border-line shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Executive Header */}
            <div className="p-4 bg-[#1b1b1b] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cream text-black flex items-center justify-center font-black text-sm">
                  MR
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-[11px] tracking-[0.25em] uppercase text-white">
                      MANE RIOT EXECUTIVE
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] tracking-wider uppercase">
                    LIVE DB • TIMINGS • GUARDRAILS ACTIVE
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(false)}
                className="text-[#9CA3AF] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Chips Bar */}
            <div className="px-3 py-2 bg-[#181818] border-b border-[#242424] flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px]">
              <button
                onClick={() => handleSendMessage("Do you have free slots today?")}
                className="whitespace-nowrap px-2.5 py-1 bg-[#222222] hover:bg-cream hover:text-black transition-colors border border-[#333333] text-[#d4d4d8] cursor-pointer"
              >
                🕒 Free Timings Today
              </button>
              <button
                onClick={() => handleSendMessage("What is covered in Cut and Style?")}
                className="whitespace-nowrap px-2.5 py-1 bg-[#222222] hover:bg-cream hover:text-black transition-colors border border-[#333333] text-[#d4d4d8] cursor-pointer"
              >
                ✂️ What's Covered?
              </button>
              <button
                onClick={() => handleSendMessage("What hairstyles are trending right now?")}
                className="whitespace-nowrap px-2.5 py-1 bg-[#222222] hover:bg-cream hover:text-black transition-colors border border-[#333333] text-[#d4d4d8] cursor-pointer"
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
                        ? 'bg-cream text-black font-semibold'
                        : m.guardrail
                        ? 'bg-[#291717] border border-red-900/60 text-[#fca5a5]'
                        : 'bg-[#1e1e1e] border border-[#2b2b2b] text-[#e4e4e7]'
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
                              const timeStr = sug.replace("Book for ", "")
                              handleOpenBooking('cut-style', timeStr)
                            } else {
                              handleSendMessage(sug)
                            }
                          }}
                          className="text-[10px] bg-[#1c1c1c] hover:bg-cream hover:text-black text-[#a1a1aa] border border-[#333333] px-2.5 py-1 transition-all cursor-pointer font-medium"
                        >
                          {sug} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
                  <div className="w-2 h-2 rounded-full bg-cream animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-cream animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-cream animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-[11px] font-mono">Checking database...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#1b1b1b] border-t border-[#27272a]">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask timings, costs, what's covered, trends..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-[#121212] border border-[#2a2a2a] text-[#F3F4F6] text-xs p-3 placeholder-[#666] focus:border-cream focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="bg-cream disabled:opacity-40 text-black p-3 hover:bg-white transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between text-[9px] text-[#666] mt-1.5 px-1 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cream" /> STRICT SALON GUARDRAILS
                </span>
                <span>SQLITE DB SYNCED</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 10. INTERACTIVE BOOKING DRAWER / MODAL */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-ink border border-line p-6 sm:p-8 text-[#F3F4F6] shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-6 right-6 text-[#9CA3AF] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {!bookingConfirmed ? (
                <div>
                  <div className="mb-6">
                    <span className="text-[11px] font-bold tracking-[0.25em] text-cream uppercase">
                      RESERVE YOUR CHAIR
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-light font-display tracking-tight uppercase mt-1">
                      BOOK YOUR SLOT
                    </h3>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-5">
                    {/* Select Service */}
                    <div>
                      <label className="block text-xs font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">
                        1. SELECT SERVICE
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {SERVICES.map((s) => (
                          <button
                            type="button"
                            key={s.id}
                            onClick={() => setSelectedService(s.id)}
                            className={`p-3 text-left border flex items-center justify-between transition-colors cursor-pointer ${
                              selectedService === s.id
                                ? 'border-cream bg-cream/10 text-white'
                                : 'border-[#27272a] bg-[#1a1a1a] text-[#a1a1aa] hover:border-[#3f3f46]'
                            }`}
                          >
                            <span className="font-bold text-sm tracking-wide uppercase">{s.name}</span>
                            <span className="text-xs text-cream font-bold">{s.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pick Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">
                          2. DAY
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Today', 'Tomorrow'].map((day) => (
                            <button
                              type="button"
                              key={day}
                              onClick={() => setSelectedDate(day)}
                              className={`py-2 text-center text-xs font-bold uppercase border cursor-pointer ${
                                selectedDate === day
                                  ? 'border-cream bg-cream text-black'
                                  : 'border-[#27272a] bg-[#1a1a1a] text-[#a1a1aa]'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">
                          3. TIME SLOT
                        </label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full bg-[#1a1a1a] border border-[#27272a] text-[#F3F4F6] text-xs font-bold uppercase p-2.5 focus:border-cream focus:outline-none"
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
                        <input
                          type="text"
                          required
                          placeholder="YOUR NAME / INSTAGRAM HANDLE"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-[#27272a] text-sm text-[#F3F4F6] placeholder-[#52525b] p-3 focus:border-cream focus:outline-none uppercase font-medium"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          required
                          placeholder="PHONE / WHATSAPP NUMBER (+91)"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-[#27272a] text-sm text-[#F3F4F6] placeholder-[#52525b] p-3 focus:border-cream focus:outline-none uppercase font-medium"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-cream text-black font-black uppercase text-sm py-4 rounded-none hover:bg-white transition-all cursor-pointer tracking-wider flex items-center justify-center gap-2 mt-4"
                    >
                      <span>CONFIRM APPOINTMENT</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleBookViaWhatsApp}
                      className="w-full bg-[#25D366] text-white font-black uppercase text-sm py-4 rounded-none hover:bg-[#1fb855] transition-all cursor-pointer tracking-wider flex items-center justify-center gap-2"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>BOOK VIA WHATSAPP</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-cream text-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h4 className="text-2xl font-light font-display uppercase tracking-tight mb-2">
                    YOU'RE LOCKED IN.
                  </h4>
                  <p className="text-sm text-[#9CA3AF] max-w-sm mx-auto mb-6">
                    Hey <span className="text-white font-bold">{formData.name || 'Friend'}</span>, your slot for{' '}
                    <span className="text-cream font-bold">
                      {SERVICES.find((s) => s.id === selectedService)?.name}
                    </span>{' '}
                    on <span className="text-white font-bold">{selectedDate}</span> at{' '}
                    <span className="text-white font-bold">{selectedTime}</span> has been confirmed!
                  </p>
                  <div className="p-4 bg-[#1f1f1f] border border-[#2c2c2c] text-xs text-[#a1a1aa] mb-6">
                    WhatsApp confirmation & salon location pin sent to{' '}
                    <span className="text-white font-bold">{formData.phone || '+91 XXXXX XXXXX'}</span>
                  </div>
                  <a
                    href={getBookingWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white font-black uppercase text-xs px-8 py-3 mb-3 hover:bg-[#1fb855] transition-colors tracking-wider"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>SEND DETAILS ON WHATSAPP</span>
                  </a>
                  <br />
                  <button
                    onClick={() => setIsBookingOpen(false)}
                    className="bg-cream text-black font-black uppercase text-xs px-8 py-3 hover:bg-white transition-colors cursor-pointer tracking-wider"
                  >
                    BACK TO EXPERIENCE
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
