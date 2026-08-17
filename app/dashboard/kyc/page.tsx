"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Upload, CheckCircle, AlertTriangle, User, Phone, MapPin, FileText, ShieldCheck, Clock } from "lucide-react"
import { useApp } from "@/lib/store"
import Link from "next/link"

const STEPS = ["Personal Info", "Address", "Documents", "Review"]

export default function KYCPage() {
  const { currentUser, submitKYC } = useApp()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const frontIdRef = useRef<HTMLInputElement>(null)
  const backIdRef  = useRef<HTMLInputElement>(null)
  const [frontIdName, setFrontIdName] = useState("")
  const [backIdName,  setBackIdName]  = useState("")
  const [frontPreview, setFrontPreview] = useState("")
  const [backPreview,  setBackPreview]  = useState("")

  const [form, setForm] = useState({
    firstName: currentUser?.firstName || "", lastName: currentUser?.lastName || "",
    email: currentUser?.email || "", phone: currentUser?.phone || "",
    country: currentUser?.country || "", city: "", zip: "", address: "",
    profession: "", dateOfBirth: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })) }

  const handleFile = (side: "front" | "back", file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      if (side === "front") { setFrontPreview(url); setFrontIdName(file.name) }
      else { setBackPreview(url); setBackIdName(file.name) }
    }
    reader.readAsDataURL(file)
  }

  const validateStep = () => {
    const e: Record<string, string> = {}
    if (step === 0) {
      if (!form.firstName.trim()) e.firstName = "Required"
      if (!form.lastName.trim())  e.lastName  = "Required"
      if (!form.profession.trim()) e.profession = "Required"
      if (!form.phone.trim())     e.phone     = "Required"
      if (!form.dateOfBirth)      e.dateOfBirth = "Required"
    } else if (step === 1) {
      if (!form.city.trim())    e.city    = "Required"
      if (!form.zip.trim())     e.zip     = "Required"
      if (!form.address.trim()) e.address = "Required"
    } else if (step === 2) {
      if (!frontIdName) e.frontId = "Please upload your front ID"
      if (!backIdName)  e.backId  = "Please upload your back ID"
    }
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleNext = () => { if (validateStep()) setStep(s => Math.min(s + 1, 3)) }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    submitKYC(currentUser!.id, { firstName: form.firstName, lastName: form.lastName, phone: form.phone, city: form.city, zip: form.zip, address: form.address, profession: form.profession })
    setSubmitted(true); setLoading(false)
  }

  const inputClass = (k: string) => `w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-[#c4d4e0] ${errors[k] ? "border-red-400 bg-red-50" : "border-[#e2e8f0] focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20"}`

  if (currentUser?.kycSubmitted || submitted) {
    const isPending = currentUser?.verificationStatus === "pending" || submitted
    return (
      <div className="max-w-lg mx-auto animate-scale-in">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center shadow-sm">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isPending ? "bg-amber-50" : "bg-red-50"}`}>
            {isPending ? <Clock size={28} className="text-amber-500" /> : <AlertTriangle size={28} className="text-red-500" />}
          </div>
          <h2 className="text-xl font-bold text-[#0c2d4e] mb-2 tracking-tight">{isPending ? "Under Review" : "Verification Failed"}</h2>
          <p className="text-[#64748b] text-sm mb-6 leading-relaxed">
            {isPending ? "Your KYC documents have been submitted and are under review. We'll notify you within 24–48 hours." : "We were unable to verify your identity automatically. Please contact support for assistance."}
          </p>
          <div className={`${isPending ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"} border rounded-xl p-4 text-left mb-6`}>
            <p className={`text-sm font-bold mb-1 ${isPending ? "text-amber-700" : "text-red-700"}`}>{isPending ? "Review in Progress" : "Action Required"}</p>
            <p className={`text-xs leading-relaxed ${isPending ? "text-amber-600" : "text-red-600"}`}>{isPending ? "Our compliance team is reviewing your submission. No further action needed at this time." : "Contact our support team directly to complete verification manually."}</p>
          </div>
          <div className="space-y-2.5">
            <a href="https://wa.me/13344468194" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all text-sm btn-press">
              Contact WhatsApp Support
            </a>
            <a href="mailto:info@bluestonetrustbank.com"
              className="flex items-center justify-center gap-2 w-full border border-[#e2e8f0] text-[#0c2d4e] hover:bg-[#f8fafc] font-semibold py-3 rounded-xl transition-all text-sm">
              Email Support
            </a>
            <Link href="/dashboard" className="block text-center text-sm text-[#1a6fad] hover:underline pt-1">Return to Dashboard</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto pb-4 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Identity Verification (KYC)</h1>
          <p className="text-xs text-[#64748b]">Complete all steps to unlock full banking features</p>
        </div>
      </div>

      {/* Step progress */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 mb-5 shadow-sm">
        <div className="flex items-center relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#e2e8f0] z-0" />
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-1.5 z-10 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i < step ? "bg-[#0e9483] border-[#0e9483] text-white" : i === step ? "bg-[#1a6fad] border-[#1a6fad] text-white shadow-md" : "bg-white border-[#e2e8f0] text-[#c4d4e0]"}`}>
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-semibold hidden sm:block ${i === step ? "text-[#1a6fad]" : i < step ? "text-[#0e9483]" : "text-[#c4d4e0]"}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
        {step === 0 && (
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-[#e8f4fd] rounded-lg flex items-center justify-center"><User size={16} className="text-[#1a6fad]" /></div>
              <h2 className="font-bold text-[#0c2d4e] tracking-tight">Personal Information</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[["First Name","firstName","First name"],["Last Name","lastName","Last name"]].map(([l,k,ph]) => (
                  <div key={k}>
                    <label className="block text-sm font-semibold text-[#334155] mb-1.5">{l} <span className="text-red-500">*</span></label>
                    <input value={form[k as keyof typeof form]} onChange={e => set(k, e.target.value)} className={inputClass(k)} placeholder={ph} />
                    {errors[k] && <p className="text-xs text-red-500 mt-1">{errors[k]}</p>}
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#334155] mb-1.5">Email</label>
                <input value={form.email} readOnly className="w-full border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-[#94a3b8] bg-[#f8fafc]" />
              </div>
              {[["Date of Birth","dateOfBirth","date","Date of birth"],["Profession","profession","text","e.g. Software Engineer"],["Phone Number","phone","tel","Phone number"]].map(([l,k,t,ph]) => (
                <div key={k}>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">{l} <span className="text-red-500">*</span></label>
                  <input type={t} value={form[k as keyof typeof form]} onChange={e => set(k, e.target.value)} className={inputClass(k)} placeholder={ph} />
                  {errors[k] && <p className="text-xs text-red-500 mt-1">{errors[k]}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-[#e8f4fd] rounded-lg flex items-center justify-center"><MapPin size={16} className="text-[#1a6fad]" /></div>
              <h2 className="font-bold text-[#0c2d4e] tracking-tight">Address Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#334155] mb-1.5">Country</label>
                <input value={form.country} readOnly className="w-full border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-[#94a3b8] bg-[#f8fafc]" />
              </div>
              {[["City","city","Your city"],["ZIP / Postal Code","zip","ZIP code"]].map(([l,k,ph]) => (
                <div key={k}>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">{l} <span className="text-red-500">*</span></label>
                  <input value={form[k as keyof typeof form]} onChange={e => set(k, e.target.value)} className={inputClass(k)} placeholder={ph} />
                  {errors[k] && <p className="text-xs text-red-500 mt-1">{errors[k]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-[#334155] mb-1.5">Full Address <span className="text-red-500">*</span></label>
                <textarea value={form.address} onChange={e => set("address", e.target.value)} rows={3}
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none placeholder:text-[#c4d4e0] ${errors.address ? "border-red-400 bg-red-50" : "border-[#e2e8f0] focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20"}`}
                  placeholder="Street address, apartment, suite..." />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-[#e8f4fd] rounded-lg flex items-center justify-center"><FileText size={16} className="text-[#1a6fad]" /></div>
              <h2 className="font-bold text-[#0c2d4e] tracking-tight">Identity Documents</h2>
            </div>
            <p className="text-sm text-[#64748b] mb-5">Upload clear photos of both sides of your national ID or passport.</p>
            <div className="space-y-4">
              {([["front","Front ID Card","frontId",frontIdRef,frontPreview,frontIdName],["back","Back ID Card","backId",backIdRef,backPreview,backIdName]] as const).map(([side, label, errKey, ref, preview, name]) => (
                <div key={side}>
                  <label className="block text-sm font-semibold text-[#334155] mb-2">{label} <span className="text-red-500">*</span></label>
                  <input ref={ref} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && handleFile(side as "front"|"back", e.target.files[0])} />
                  <button onClick={() => (ref as React.RefObject<HTMLInputElement>).current?.click()}
                    className={`w-full border-2 border-dashed rounded-xl py-8 flex flex-col items-center gap-2.5 transition-all hover:bg-[#f8fafc] ${errors[errKey] ? "border-red-300 bg-red-50" : preview ? "border-[#0e9483] bg-green-50" : "border-[#c4d4e0]"}`}>
                    {preview ? (
                      <img src={preview} alt={label} className="w-36 h-24 object-cover rounded-xl shadow-sm" />
                    ) : (
                      <><Upload size={28} className="text-[#94a3b8]" /><span className="text-sm text-[#1a6fad] font-semibold">{label}</span><span className="text-xs text-[#94a3b8]">Click to upload · JPG, PNG, PDF</span></>
                    )}
                    {name && <p className="text-xs text-[#0e9483] font-semibold flex items-center gap-1"><CheckCircle size={11} /> {name}</p>}
                  </button>
                  {errors[errKey] && <p className="text-xs text-red-500 mt-1">{errors[errKey]}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-[#e8f4fd] rounded-lg flex items-center justify-center"><CheckCircle size={16} className="text-[#1a6fad]" /></div>
              <h2 className="font-bold text-[#0c2d4e] tracking-tight">Review & Submit</h2>
            </div>
            <div className="space-y-0 mb-4">
              {[["Full Name", `${form.firstName} ${form.lastName}`],["Email",form.email],["Phone",form.phone],["Profession",form.profession],["Date of Birth",form.dateOfBirth],["Country",form.country],["City",form.city],["ZIP",form.zip],["Address",form.address],["Front ID",frontIdName||"—"],["Back ID",backIdName||"—"]].map(([l,v]) => (
                <div key={l} className="flex items-start justify-between py-2.5 border-b border-[#f8fafc] last:border-0">
                  <span className="text-sm text-[#94a3b8]">{l}</span>
                  <span className="text-sm font-semibold text-[#0c2d4e] text-right max-w-[60%]">{v || "—"}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-700 flex gap-2">
              <AlertTriangle size={13} className="shrink-0 mt-0.5" />
              By submitting, you confirm all information is accurate. Submitting false information is a criminal offense.
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-7 pt-5 border-t border-[#f1f5f9]">
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 border border-[#e2e8f0] text-[#64748b] hover:text-[#0c2d4e] hover:bg-[#f8fafc] rounded-xl text-sm font-semibold disabled:opacity-30 transition-all">
            <ChevronLeft size={15} /> Previous
          </button>
          {step < 3 ? (
            <button onClick={handleNext} className="flex items-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-lg btn-press">
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-[#0e9483] to-[#0a7a6d] hover:opacity-90 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-lg btn-press">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ShieldCheck size={15} />}
              {loading ? "Submitting..." : "Submit KYC"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
