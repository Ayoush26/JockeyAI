'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    })
  }, [])

  const handleUpgrade = async (plan: 'pro' | 'vip') => {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  const handleManageBilling = async () => {
    setPortalLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  if (!profile) return <div className="text-[#666660] text-sm">Loading...</div>

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <div className="font-mono-dm text-[11px] text-[#00FF87] tracking-[3px] uppercase mb-2">Settings</div>
        <h1 className="font-bebas text-5xl tracking-wide">Account & Billing</h1>
      </div>

      {/* Profile */}
      <div className="border border-[#1e1e1e] bg-[#111] p-8 mb-6">
        <h2 className="font-bebas text-2xl tracking-wide mb-6">Profile</h2>
        <div className="flex flex-col gap-4">
          {[['Name', profile.full_name || '—'], ['Email', profile.email], ['Member since', new Date(profile.created_at).toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'})]].map(([l,v]) => (
            <div key={String(l)} className="flex justify-between items-center py-3 border-b border-[#1e1e1e] last:border-0">
              <span className="text-[11px] text-[#666660] tracking-widest uppercase font-mono-dm">{l}</span>
              <span className="text-sm text-[#e8e8e2]">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription */}
      <div className="border border-[#1e1e1e] bg-[#111] p-8 mb-6">
        <h2 className="font-bebas text-2xl tracking-wide mb-6">Subscription</h2>
        <div className="flex items-center justify-between mb-6 py-3 border-b border-[#1e1e1e]">
          <div>
            <div className="text-[10px] text-[#666660] tracking-widest uppercase font-mono-dm mb-1">Current plan</div>
            <div className={`font-medium text-lg ${profile.tier === 'vip' ? 'text-[#ffc800]' : profile.tier === 'pro' ? 'text-[#00FF87]' : 'text-[#666660]'}`}>
              {profile.tier === 'free' ? 'Free' : profile.tier === 'pro' ? 'FormIQ Pro · $29/mo' : 'FormIQ VIP · $149/mo'}
            </div>
          </div>
          {profile.tier !== 'free' && (
            <button onClick={handleManageBilling} disabled={portalLoading}
              className="text-xs text-[#666660] border border-[#1e1e1e] px-4 py-2 rounded-sm hover:border-[#666660] transition-colors disabled:opacity-50">
              {portalLoading ? 'Loading...' : 'Manage billing'}
            </button>
          )}
        </div>

        {profile.tier === 'free' && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-[#666660] mb-4">Upgrade to access all selections, Telegram, and full model scores.</p>
            <button onClick={() => handleUpgrade('pro')} disabled={loading}
              className="bg-[#00FF87] text-[#0a0a0a] py-4 text-sm font-medium tracking-[1.5px] uppercase rounded-sm hover:opacity-85 transition-opacity disabled:opacity-50">
              {loading ? 'Redirecting...' : 'Upgrade to Pro — $29/mo'}
            </button>
            <button onClick={() => handleUpgrade('vip')} disabled={loading}
              className="border border-[#1e1e1e] text-[#e8e8e2] py-4 text-sm tracking-[1.5px] uppercase rounded-sm hover:border-[#666660] transition-colors disabled:opacity-50">
              Upgrade to VIP — $149/mo
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-[#666660] leading-relaxed">
        FormIQ provides racing information for informational purposes only. Past results are not indicative of future performance. Please gamble responsibly. Gambling Help Online: 1800 858 858.
      </p>
    </div>
  )
}
