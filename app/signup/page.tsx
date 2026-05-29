'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const plan = params.get('plan') || 'free'
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/dashboard` }
    })
    if (error) { setError(error.message); setLoading(false) }
    else {
      if (plan !== 'free') {
        // Redirect to Stripe checkout after email confirmation
        router.push(`/dashboard?plan=${plan}`)
      } else {
        setDone(true)
      }
    }
  }

  if (done) return (
    <div className="text-center">
      <div className="text-5xl mb-6">✓</div>
      <h2 className="font-bebas text-3xl tracking-wide mb-3 text-[#00FF87]">Check your email</h2>
      <p className="text-sm text-[#666660] leading-relaxed">We sent a confirmation link to <strong className="text-[#e8e8e2]">{email}</strong>. Click it to activate your free account.</p>
    </div>
  )

  return (
    <>
      <h1 className="font-bebas text-4xl tracking-wide mb-2">
        {plan === 'free' ? 'Get free tips' : `Start FormIQ ${plan.toUpperCase()}`}
      </h1>
      <p className="text-sm text-[#666660] mb-8">
        {plan === 'free' ? 'One selection every Saturday, no card needed.' : '7-day free trial, cancel any time.'}
      </p>
      {error && <div className="bg-[rgba(255,68,68,0.1)] border border-[rgba(255,68,68,0.3)] text-[#ff4444] text-sm px-4 py-3 rounded-sm mb-6">{error}</div>}
      <form onSubmit={handleSignup} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-[#666660] tracking-widest uppercase font-mono-dm">Full name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required
            className="bg-[#0a0a0a] border border-[#1e1e1e] text-[#e8e8e2] px-4 py-3 text-sm outline-none focus:border-[#00FF87] transition-colors rounded-sm"
            placeholder="Your name" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-[#666660] tracking-widest uppercase font-mono-dm">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="bg-[#0a0a0a] border border-[#1e1e1e] text-[#e8e8e2] px-4 py-3 text-sm outline-none focus:border-[#00FF87] transition-colors rounded-sm"
            placeholder="your@email.com" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-[#666660] tracking-widest uppercase font-mono-dm">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
            className="bg-[#0a0a0a] border border-[#1e1e1e] text-[#e8e8e2] px-4 py-3 text-sm outline-none focus:border-[#00FF87] transition-colors rounded-sm"
            placeholder="Min 8 characters" />
        </div>
        <button type="submit" disabled={loading}
          className="bg-[#00FF87] text-[#0a0a0a] py-4 text-sm font-medium tracking-[1.5px] uppercase rounded-sm hover:opacity-85 transition-opacity disabled:opacity-50 mt-2">
          {loading ? 'Creating account...' : plan === 'free' ? 'Create free account' : `Continue to payment →`}
        </button>
      </form>
      <p className="text-sm text-[#666660] text-center mt-6">
        Already a member? <Link href="/login" className="text-[#00FF87] hover:opacity-75">Sign in</Link>
      </p>
    </>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="font-bebas text-3xl tracking-widest text-[#00FF87] block mb-12 text-center">
          Form<span className="text-[#e8e8e2]">IQ</span>
        </Link>
        <div className="border border-[#1e1e1e] bg-[#111] p-10">
          <Suspense fallback={<div className="text-[#666660] text-sm">Loading...</div>}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
