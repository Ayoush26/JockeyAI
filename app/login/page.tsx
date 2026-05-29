'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/dashboard'); router.refresh() }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="font-bebas text-3xl tracking-widest text-[#00FF87] block mb-12 text-center">
          Form<span className="text-[#e8e8e2]">IQ</span>
        </Link>
        <div className="border border-[#1e1e1e] bg-[#111] p-10">
          <h1 className="font-bebas text-4xl tracking-wide mb-2">Welcome back</h1>
          <p className="text-sm text-[#666660] mb-8">Sign in to access your tips</p>
          {error && <div className="bg-[rgba(255,68,68,0.1)] border border-[rgba(255,68,68,0.3)] text-[#ff4444] text-sm px-4 py-3 rounded-sm mb-6">{error}</div>}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#666660] tracking-widest uppercase font-mono-dm">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="bg-[#0a0a0a] border border-[#1e1e1e] text-[#e8e8e2] px-4 py-3 text-sm outline-none focus:border-[#00FF87] transition-colors rounded-sm"
                placeholder="your@email.com" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#666660] tracking-widest uppercase font-mono-dm">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="bg-[#0a0a0a] border border-[#1e1e1e] text-[#e8e8e2] px-4 py-3 text-sm outline-none focus:border-[#00FF87] transition-colors rounded-sm"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="bg-[#00FF87] text-[#0a0a0a] py-4 text-sm font-medium tracking-[1.5px] uppercase rounded-sm hover:opacity-85 transition-opacity disabled:opacity-50 mt-2">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="text-sm text-[#666660] text-center mt-6">
            No account? <Link href="/signup" className="text-[#00FF87] hover:opacity-75 transition-opacity">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
