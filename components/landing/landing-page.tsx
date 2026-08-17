"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  Menu, X, ShieldCheck, Zap, Globe, TrendingUp, ChevronRight, Lock,
  CreditCard, Building2, PhoneCall, Mail, MapPin, CheckCircle,
  ArrowRight, Star, Banknote, Landmark, Users, Wifi, Smartphone,
  BadgeCheck, Award, HeartHandshake, Layers, BarChart2
} from "lucide-react"
import Logo from "@/components/logo"

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function RevealSection({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}


const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Bank-Grade Security",
    desc: "256-bit SSL encryption, two-factor authentication, and real-time fraud monitoring keep your money safe 24/7.",
    color: "bg-blue-50 text-[#1a6fad]",
    border: "group-hover:border-blue-200",
  },
  {
    icon: Zap,
    title: "Instant Transfers",
    desc: "Send and receive money instantly across accounts. No waiting, no delays, just seamless transactions.",
    color: "bg-sky-50 text-sky-600",
    border: "group-hover:border-sky-200",
  },
  {
    icon: Globe,
    title: "Global Reach",
    desc: "Access your account from anywhere in the world. Supported in 150+ countries with competitive exchange rates.",
    color: "bg-teal-50 text-teal-600",
    border: "group-hover:border-teal-200",
  },
  {
    icon: TrendingUp,
    title: "Investment Tools",
    desc: "Grow your wealth with FDR and DPS plans. Earn competitive interest rates on your deposits.",
    color: "bg-green-50 text-green-600",
    border: "group-hover:border-green-200",
  },
  {
    icon: CreditCard,
    title: "Smart Cards",
    desc: "Virtual and physical cards with real-time spending controls, instant freeze, and transaction limits.",
    color: "bg-purple-50 text-purple-600",
    border: "group-hover:border-purple-200",
  },
  {
    icon: BadgeCheck,
    title: "KYC Compliance",
    desc: "Full regulatory compliance with KYC and AML standards. Your identity is protected and verified.",
    color: "bg-orange-50 text-orange-600",
    border: "group-hover:border-orange-200",
  },
]

const STATS = [
  { value: "$12B+", label: "Assets Under Management", icon: Banknote },
  { value: "500K+", label: "Active Customers", icon: Users },
  { value: "99.9%", label: "Uptime Guarantee", icon: Zap },
  { value: "150+",  label: "Countries Supported", icon: Globe },
]

const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "Small Business Owner",
    text: "BlueStone completely transformed how I manage my business finances. The transfers are lightning-fast and the interface is beautifully simple.",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "James Okafor",
    role: "Software Engineer",
    text: "I've tried many digital banks, but BlueStone stands out. The security features give me peace of mind, and the FDR returns are genuinely competitive.",
    rating: 5,
    avatar: "JO",
  },
  {
    name: "Priya Sharma",
    role: "Entrepreneur",
    text: "Setting up took less than 5 minutes. Everything from KYC to deposits just works. Highly recommend to anyone looking for a modern bank.",
    rating: 5,
    avatar: "PS",
  },
]


export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white text-[#0c1929] overflow-x-hidden">

      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-[#0c2d4e] via-[#1a4a72] to-[#0c2d4e] text-white text-xs sm:text-sm py-2.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span>
          <strong>Secure &amp; FDIC-Insured.</strong>{" "}Your deposits are protected up to $250,000.{" "}
          <Link href="/auth/signup" className="ml-1.5 underline text-sky-300 hover:text-sky-100 transition-colors font-semibold">
            Open an account →
          </Link>
        </span>
      </div>

      {/* Sticky Nav */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/98 shadow-sm backdrop-blur-md border-b border-[#e2e8f0]" : "bg-white/95 backdrop-blur border-b border-[#e2e8f0]/60"}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Logo size="md" />

          <ul className="hidden md:flex items-center gap-7 text-sm font-medium text-[#475569]">
            {[["#home","Home"],["#features","Features"],["#services","Services"],["#about","About Us"],["#contact","Contact"]].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="hover:text-[#0c2d4e] transition-colors relative group">
                  {label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#1a6fad] rounded-full transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-semibold text-[#0c2d4e] hover:text-[#1a6fad] transition-colors px-3 py-2">
              Login
            </Link>
            <Link href="/auth/signup" className="bg-[#0c2d4e] hover:bg-[#1a4a72] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#0c2d4e]/20 btn-press">
              Get Started
            </Link>
          </div>

          <button className="md:hidden p-2 text-[#0c2d4e] hover:bg-[#f1f5f9] rounded-lg transition-colors" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#f1f5f9] px-4 pb-5 pt-3 animate-fade-in-down shadow-lg">
            <ul className="flex flex-col gap-1 text-sm font-medium text-[#334155] mb-4">
              {[["#home","Home"],["#features","Features"],["#services","Services"],["#about","About Us"],["#contact","Contact"]].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="block py-2.5 px-3 rounded-xl hover:bg-[#f8fafc] hover:text-[#1a6fad] transition-colors" onClick={() => setMenuOpen(false)}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 pt-2 border-t border-[#f1f5f9]">
              <Link href="/auth/login" className="w-full text-center border border-[#0c2d4e] text-[#0c2d4e] py-2.5 rounded-full text-sm font-semibold hover:bg-[#f8fafc] transition-colors">Login</Link>
              <Link href="/auth/signup" className="w-full text-center bg-[#0c2d4e] text-white py-2.5 rounded-full text-sm font-semibold hover:bg-[#1a4a72] transition-colors">Get Started Free</Link>
            </div>
          </div>
        )}
      </header>


      {/* ===================== HERO ===================== */}
      <section id="home" className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-sky-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-[5%] w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: Copy */}
          <div className="flex-1 max-w-xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/80 border border-[#1a6fad]/20 text-[#1a6fad] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 shadow-sm">
              <ShieldCheck size={13} />
              Trusted by 500,000+ customers worldwide
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0c2d4e] leading-[1.1] tracking-tight mb-6">
              Banking that{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#1a6fad]">works for you</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-sky-200/50 -z-0 rounded-sm" />
              </span>
              <br className="hidden sm:block" /> everywhere you go.
            
            </h1>

            <p className="text-[#64748b] leading-relaxed text-base sm:text-lg mb-8 max-w-lg">
              Banking reimagined: simple, smart, and built around <em className="text-[#0c2d4e] not-italic font-semibold">you</em>. Grow your savings, send money globally, and invest, all from one place.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
              <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-xl hover:shadow-[#0c2d4e]/25 text-sm btn-press group">
                Open Free Account
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/auth/login" className="inline-flex items-center gap-2 text-[#0c2d4e] font-semibold text-sm hover:text-[#1a6fad] transition-colors group">
                Sign in to your account <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-5 flex-wrap">
              {[
                { label: "FDIC Insured", icon: ShieldCheck },
                { label: "256-bit SSL", icon: Lock },
                { label: "24/7 Support", icon: PhoneCall },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-[#64748b] bg-white/70 border border-[#e2e8f0] px-3 py-1.5 rounded-full shadow-sm">
                  <Icon size={13} className="text-[#1a6fad]" />
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Card stack visual — FIXED for mobile */}
          <div className="flex-1 flex justify-center items-center w-full">
            <div className="hero-card-stack relative w-full max-w-[320px] sm:max-w-[380px]">
              <div className="relative" style={{ height: "280px" }}>

                {/* Card 3 — bottom */}
                <div className="card-3 absolute bottom-0 left-8 right-8 h-[160px] rounded-2xl opacity-40"
                  style={{ background: "linear-gradient(135deg, #93c5fd, #60a5fa)", transform: "rotate(6deg)" }} />

                {/* Card 2 — middle */}
                <div className="card-2 absolute bottom-4 left-4 right-4 h-[160px] rounded-2xl opacity-65"
                  style={{ background: "linear-gradient(135deg, #1a6fad, #0e9483)", transform: "rotate(3deg)" }} />

                {/* Card 1 — front (main card) */}
                <div className="card-1 absolute bottom-8 left-0 right-0 h-[160px] rounded-2xl balance-card shadow-2xl p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-white/30" />
                      <div className="w-3 h-3 rounded-full bg-white/15" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wifi size={13} className="text-white/50" />
                      <span className="text-white/60 text-xs font-bold tracking-widest">VISA</span>
                    </div>
                  </div>

                  <div>
                    {/* Chip */}
                    <div className="w-9 h-6 bg-yellow-400/80 rounded-md mb-2.5 flex items-center justify-center overflow-hidden">
                      <div className="grid grid-cols-2 gap-0.5 p-0.5">
                        {[...Array(6)].map((_, i) => <div key={i} className="w-1 h-1 bg-yellow-700/40 rounded-sm" />)}
                      </div>
                    </div>
                    <p className="text-white/70 text-[11px] font-mono tracking-[0.18em] mb-2">•••• •••• •••• 4291</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Account Holder</p>
                        <p className="text-white text-sm font-semibold tracking-wide">Cameron J. Williams</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Expires</p>
                        <p className="text-white text-sm font-semibold">07/29</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stats below card */}
              <div className="flex gap-3 mt-4 justify-center">
                <div className="bg-white/90 backdrop-blur-sm border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-center shadow-sm">
                  <p className="text-xs font-bold text-[#0e9483]">+$4,250.00</p>
                  <p className="text-[10px] text-[#94a3b8]">Balance</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-center shadow-sm">
                  <p className="text-xs font-bold text-[#1a6fad]">Verified ✓</p>
                  <p className="text-[10px] text-[#94a3b8]">Account</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ===================== STATS BANNER ===================== */}
      <section className="bg-[#0c2d4e] py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-sky-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-teal-400 rounded-full blur-3xl" />
        </div>
        <RevealSection>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="group">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 transition-colors">
                  <Icon size={22} className="text-sky-300" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-sky-300 mb-1 tracking-tight">{value}</p>
                <p className="text-sm text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <RevealSection className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 text-[#1a6fad] text-xs font-bold uppercase tracking-widest bg-[#e8f4fd] px-3 py-1.5 rounded-full mb-4">
            <Award size={12} /> Why BlueStone
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0c2d4e] mt-3 tracking-tight">Built for trust. Designed for speed.</h2>
          <p className="text-[#64748b] mt-3 max-w-xl mx-auto text-base sm:text-lg">
            Everything you need to manage your finances securely — in one elegant place.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color, border }, i) => (
            <RevealSection key={title} delay={i * 80}>
              <div className={`group bg-white border border-[#e2e8f0] ${border} rounded-2xl p-6 feature-card h-full`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} transition-transform group-hover:scale-110 duration-300`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-[#0c2d4e] mb-2 text-lg tracking-tight">{title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>


      {/* ===================== SERVICES ===================== */}
      <section id="services" className="bg-[#f4f7fb] py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-[#1a6fad] text-xs font-bold uppercase tracking-widest bg-[#e8f4fd] px-3 py-1.5 rounded-full mb-4">
              <Layers size={12} /> Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0c2d4e] mt-3 tracking-tight">Complete banking solutions</h2>
            <p className="text-[#64748b] mt-3 max-w-xl mx-auto">One platform for all your financial needs: personal, business, and investment.</p>
          </RevealSection>

          {/* Service 1: Payments */}
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
            <RevealSection className="flex-1 w-full">
              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 max-w-sm mx-auto lg:mx-0">
                <div className="bg-[#f8fafc] rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-3">
                    <div className="space-y-1">
                      <p className="text-xs text-[#94a3b8]">Shipping Fee</p>
                      <p className="text-xs text-[#94a3b8]">Platform Discount</p>
                      <p className="font-bold text-sm text-[#0c2d4e] mt-1">Total Due</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs text-[#94a3b8]">$45.00</p>
                      <p className="text-xs text-green-600">−$12.00</p>
                      <p className="font-bold text-sm text-[#0c2d4e] mt-1">$344.00</p>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-[#0c2d4e] to-[#1a6fad] text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                    Checkout Securely
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                  <Lock size={12} className="text-[#1a6fad]" />
                  End-to-end encrypted checkout
                </div>
              </div>
            </RevealSection>
            <RevealSection className="flex-1" delay={100}>
              <span className="inline-flex items-center gap-1.5 text-[#1a6fad] text-xs font-bold uppercase tracking-widest bg-[#e8f4fd] px-3 py-1.5 rounded-full mb-4">
                <CreditCard size={12} /> Payment Options
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0c2d4e] mt-3 mb-4 tracking-tight">
                Accept payments with ease using our secure gateway.
              </h3>
              <p className="text-[#64748b] leading-relaxed mb-4">
                We offer a wide range of <span className="text-[#1a6fad] font-semibold">payment options</span> including credit and debit cards, online banking, and e-wallets, so customers always have a convenient way to pay.
              </p>
              <ul className="space-y-2">
                {["Zero transaction fees for internal transfers","Multi-currency support in 150+ countries","Instant notifications on every payment"].map(t => (
                  <li key={t} className="flex items-center gap-2 text-sm text-[#475569]">
                    <CheckCircle size={15} className="text-[#0e9483] shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </RevealSection>
          </div>

          {/* Service 2: Invoices */}
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            <RevealSection className="flex-1" delay={100}>
              <span className="inline-flex items-center gap-1.5 text-orange-600 text-xs font-bold uppercase tracking-widest bg-orange-50 px-3 py-1.5 rounded-full mb-4">
                <BarChart2 size={12} /> Invoices &amp; Billing
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0c2d4e] mt-3 mb-4 tracking-tight">
                Send invoices and accept payments with our intelligent billing software.
              </h3>
              <p className="text-[#64748b] leading-relaxed mb-4 text-sm">
                Our payment solutions include advanced fraud prevention that detects and blocks fraudulent transactions, keeping your business and <span className="text-[#1a6fad] font-medium">customers safe</span>.
              </p>
              <ul className="space-y-2">
                {["Automated invoice generation","Real-time payment tracking","Smart fraud detection & prevention"].map(t => (
                  <li key={t} className="flex items-center gap-2 text-sm text-[#475569]">
                    <CheckCircle size={15} className="text-[#0e9483] shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </RevealSection>
            <RevealSection className="flex-1 w-full">
              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 max-w-sm mx-auto lg:mx-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-[#0c2d4e]">Invoice #INV-0042</p>
                    <p className="text-xs text-[#94a3b8]">Due: Dec 15, 2026</p>
                  </div>
                  <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                    <Building2 size={16} className="text-orange-500" />
                  </div>
                </div>
                <div className="border-t border-[#e2e8f0] pt-3">
                  <div className="grid grid-cols-4 text-xs text-[#94a3b8] mb-2 font-semibold uppercase tracking-wider">
                    <span>Item</span><span className="text-center">Qty</span><span className="text-center">Tax</span><span className="text-right">Total</span>
                  </div>
                  {[["Services","10","10%","$1,200"],["Delivery","4","10%","$450"],["Tax","1","10%","$52"]].map(([item, qty, vat, total]) => (
                    <div key={item} className="grid grid-cols-4 text-xs text-[#0c2d4e] py-1.5 border-b border-[#f8fafc] last:border-0">
                      <span className="font-medium">{item}</span>
                      <span className="text-center text-[#64748b]">{qty}</span>
                      <span className="text-center text-[#64748b]">{vat}</span>
                      <span className="text-right font-semibold">{total}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
                  <span className="text-sm font-bold text-[#0c2d4e]">Grand Total</span>
                  <span className="text-sm font-bold text-[#0e9483]">$1,702.00</span>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>


      {/* ===================== TESTIMONIALS ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <RevealSection className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-[#1a6fad] text-xs font-bold uppercase tracking-widest bg-[#e8f4fd] px-3 py-1.5 rounded-full mb-4">
            <HeartHandshake size={12} /> Customer Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0c2d4e] mt-3 tracking-tight">Loved by thousands worldwide</h2>
        </RevealSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, text, rating, avatar }, i) => (
            <RevealSection key={name} delay={i * 100}>
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 feature-card h-full flex flex-col">
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[#475569] leading-relaxed flex-1 italic mb-5">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#f1f5f9]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a6fad] to-[#0e9483] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0c2d4e] text-sm">{name}</p>
                    <p className="text-xs text-[#94a3b8]">{role}</p>
                  </div>
                  <BadgeCheck size={16} className="ml-auto text-[#1a6fad] shrink-0" />
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ===================== ABOUT ===================== */}
      <section id="about" className="bg-[#f4f7fb] py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <RevealSection>
              <span className="inline-flex items-center gap-1.5 text-[#1a6fad] text-xs font-bold uppercase tracking-widest bg-[#e8f4fd] px-3 py-1.5 rounded-full mb-4">
                <Landmark size={12} /> About Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0c2d4e] mt-3 mb-6 tracking-tight">
                Built on a foundation of trust and integrity
              </h2>
              <p className="text-[#475569] leading-relaxed mb-4">
                BlueStone Trust Bank was founded with one goal: make premium banking accessible to everyone. Over the past decade we have grown into a globally recognized institution trusted by hundreds of thousands of customers.
              </p>
              <p className="text-[#475569] leading-relaxed mb-8 text-sm">
                Our team of financial experts work tirelessly developing innovative products that empower clients to achieve their financial goals, wherever they are in the world.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: "2012", label: "Founded" },
                  { val: "AA+", label: "Credit Rating" },
                  { val: "$12B", label: "Total Assets" },
                  { val: "150+", label: "Countries" },
                ].map(({ val, label }) => (
                  <div key={label} className="bg-white rounded-xl p-4 border border-[#e2e8f0] stat-card">
                    <p className="text-2xl font-bold text-[#0c2d4e] tracking-tight">{val}</p>
                    <p className="text-sm text-[#64748b] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </RevealSection>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, title: "FDIC Insured",      desc: "Deposits protected up to $250,000 per depositor." },
                { icon: CheckCircle, title: "Fully Regulated",   desc: "Licensed by federal and state banking authorities." },
                { icon: Lock,        title: "Zero-Fraud Policy", desc: "Advanced monitoring prevents unauthorized access." },
                { icon: Globe,       title: "Global Reach",      desc: "Send & receive funds in 150+ countries." },
              ].map(({ icon: Icon, title, desc }, i) => (
                <RevealSection key={title} delay={i * 80}>
                  <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 feature-card h-full">
                    <div className="w-10 h-10 bg-[#e8f4fd] rounded-xl flex items-center justify-center mb-3">
                      <Icon size={18} className="text-[#1a6fad]" />
                    </div>
                    <h4 className="font-bold text-[#0c2d4e] text-sm mb-1 tracking-tight">{title}</h4>
                    <p className="text-xs text-[#64748b] leading-relaxed">{desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ===================== CTA ===================== */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c2d4e] via-[#1a4a72] to-[#0c3d5c]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-teal-400/10 rounded-full blur-3xl" />
        </div>
        <RevealSection className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-1.5 text-sky-300 text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full mb-6">
            <Zap size={12} /> Get started today
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to experience better banking?
          </h2>
          <p className="text-white/70 mb-10 max-w-xl mx-auto text-base sm:text-lg">
            Join hundreds of thousands of customers who trust BlueStone. Open your free account in minutes — no paperwork required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 bg-sky-400 hover:bg-sky-300 text-[#0c2d4e] font-bold px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-xl text-sm btn-press group">
              Open Free Account
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#contact" className="inline-flex items-center justify-center border border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 text-sm">
              Talk to Us
            </a>
          </div>
        </RevealSection>
      </section>

      {/* ===================== CONTACT ===================== */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <RevealSection className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-[#1a6fad] text-xs font-bold uppercase tracking-widest bg-[#e8f4fd] px-3 py-1.5 rounded-full mb-4">
            <PhoneCall size={12} /> Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0c2d4e] mt-3 tracking-tight">We&apos;re here to help</h2>
          <p className="text-[#64748b] mt-2 max-w-md mx-auto">Our support team is available 24/7. Reach out anytime.</p>
        </RevealSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: PhoneCall, label: "WhatsApp Support",  value: "+1 (334) 446-8194",                href: "https://wa.me/13344468194",                     color: "bg-green-50 text-green-600 group-hover:bg-green-600" },
            { icon: Mail,      label: "Email Support",     value: "info@bluestonetrustbank.com",   href: "mailto:info@bluestonetrustbank.com",          color: "bg-[#e8f4fd] text-[#1a6fad] group-hover:bg-[#1a6fad]" },
            { icon: MapPin,    label: "Headquarters",      value: "New York, NY 10001, USA",           href: "#",                                             color: "bg-orange-50 text-orange-600 group-hover:bg-orange-600" },
          ].map(({ icon: Icon, label, value, href, color }) => (
            <RevealSection key={label} delay={[0,100,200][[label].indexOf(label)]}>
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="group bg-white border border-[#e2e8f0] rounded-2xl p-6 text-center feature-card flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${color}`}>
                  <Icon size={20} className="group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs text-[#94a3b8] mb-1 font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-[#0c2d4e] break-all">{value}</p>
              </a>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-[#e2e8f0] py-12 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <Logo size="sm" />
            <div className="flex flex-wrap gap-6 text-xs text-[#64748b] justify-center">
              {[["#home","Home"],["#features","Features"],["#services","Services"],["#about","About"],["#contact","Contact"]].map(([href, label]) => (
                <a key={href} href={href} className="hover:text-[#1a6fad] transition-colors">{label}</a>
              ))}
            </div>
            <div className="flex gap-4 text-xs text-[#94a3b8]">
              <a href="#" className="hover:text-[#1a6fad] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#1a6fad] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#1a6fad] transition-colors">Cookies</a>
            </div>
          </div>
          <div className="border-t border-[#e2e8f0] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#94a3b8] text-center">
              © {new Date().getFullYear()} BlueStone Trust Bank. All rights reserved. FDIC Insured. Member FDIC.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
              <ShieldCheck size={13} className="text-[#0e9483]" />
              <span>256-bit SSL Secured</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
