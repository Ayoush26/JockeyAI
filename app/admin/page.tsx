'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tip } from '@/lib/types'

const EMPTY_TIP = {
  race_date: new Date().toISOString().split('T')[0],
  track: '', race_number: 1, distance: '', horse_name: '', jockey: '',
  trainer: '', barrier: 1, weight: '', model_odds: '', iq_score: 75,
  analysis: '', tier_required: 'free' as const, result: 'pending' as const,
  sp_odds: '', profit_loss: 0,
}

export default function AdminPage() {
  const [tips, setTips] = useState<Tip[]>([])
  const [form, setForm] = useState(EMPTY_TIP)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const supabase = createClient()

  const fetchTips = async () => {
    const { data } = await supabase.from('tips').select('*').order('race_date', { ascending: false }).limit(20)
    setTips(data || [])
  }

  useEffect(() => { fetchTips() }, [])

  const saveTip = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('tips').insert([form])
    if (error) { setMsg('Error: ' + error.message) }
    else { setMsg('Tip saved!'); setForm(EMPTY_TIP); fetchTips() }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  const updateResult = async (id: string, result: Tip['result'], profit_loss: number) => {
    await supabase.from('tips').update({ result, profit_loss }).eq('id', id)
    fetchTips()
  }

  const f = (key: keyof typeof EMPTY_TIP, val: string | number) => setForm(p => ({ ...p, [key]: val }))

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="font-bebas text-3xl text-[#00FF87] tracking-widest">FormIQ</div>
          <div className="font-mono-dm text-[11px] text-[#666660] tracking-widest uppercase">Admin Panel</div>
        </div>

        {msg && <div className="bg-[rgba(0,255,135,0.1)] border border-[rgba(0,255,135,0.3)] text-[#00FF87] text-sm px-4 py-3 rounded-sm mb-6">{msg}</div>}

        {/* Add tip form */}
        <div className="border border-[#1e1e1e] bg-[#111] p-8 mb-8">
          <h2 className="font-bebas text-2xl tracking-wide mb-6">Publish New Tip</h2>
          <form onSubmit={saveTip}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {([
                ['race_date','Race date','date'],['track','Track','text'],['race_number','Race #','number'],['distance','Distance','text'],
                ['horse_name','Horse','text'],['jockey','Jockey','text'],['trainer','Trainer','text'],['barrier','Barrier','number'],
                ['weight','Weight','text'],['model_odds','Model odds','text'],['iq_score','IQ Score (0-100)','number'],
              ] as [keyof typeof EMPTY_TIP, string, string][]).map(([key, label, type]) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-[10px] text-[#666660] tracking-widest uppercase font-mono-dm">{label}</label>
                  <input type={type} value={form[key] as string} onChange={e => f(key, type === 'number' ? Number(e.target.value) : e.target.value)} required
                    className="bg-[#0a0a0a] border border-[#1e1e1e] text-[#e8e8e2] px-3 py-2 text-sm outline-none focus:border-[#00FF87] transition-colors rounded-sm" />
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#666660] tracking-widest uppercase font-mono-dm">Tier required</label>
                <select value={form.tier_required} onChange={e => f('tier_required', e.target.value)}
                  className="bg-[#0a0a0a] border border-[#1e1e1e] text-[#e8e8e2] px-3 py-2 text-sm outline-none focus:border-[#00FF87] transition-colors rounded-sm">
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-[10px] text-[#666660] tracking-widest uppercase font-mono-dm">Analysis</label>
              <textarea value={form.analysis} onChange={e => f('analysis', e.target.value)} required rows={3}
                className="bg-[#0a0a0a] border border-[#1e1e1e] text-[#e8e8e2] px-3 py-2 text-sm outline-none focus:border-[#00FF87] transition-colors rounded-sm resize-none" />
            </div>
            <button type="submit" disabled={saving}
              className="bg-[#00FF87] text-[#0a0a0a] px-8 py-3 text-sm font-medium tracking-[1.5px] uppercase rounded-sm hover:opacity-85 transition-opacity disabled:opacity-50">
              {saving ? 'Saving...' : 'Publish Tip'}
            </button>
          </form>
        </div>

        {/* Tips list with result updater */}
        <div className="border border-[#1e1e1e] bg-[#111] p-8">
          <h2 className="font-bebas text-2xl tracking-wide mb-6">Recent Tips — Update Results</h2>
          <div className="flex flex-col gap-px bg-[#1e1e1e]">
            {tips.map(tip => (
              <div key={tip.id} className="bg-[#0a0a0a] px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="font-mono-dm text-[11px] text-[#666660] whitespace-nowrap">{tip.race_date}</div>
                  <div>
                    <div className="font-medium text-sm">{tip.horse_name}</div>
                    <div className="text-[11px] text-[#666660]">{tip.track} R{tip.race_number} · IQ: {tip.iq_score}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <select defaultValue={tip.result}
                    onChange={e => updateResult(tip.id, e.target.value as Tip['result'], tip.profit_loss || 0)}
                    className="bg-[#111] border border-[#1e1e1e] text-[#e8e8e2] px-3 py-1.5 text-xs rounded-sm outline-none">
                    <option value="pending">Pending</option>
                    <option value="win">Win</option>
                    <option value="place">Place</option>
                    <option value="unplaced">Unplaced</option>
                  </select>
                  <span className={`text-[11px] px-2 py-1 rounded-sm font-medium ${tip.tier_required === 'free' ? 'text-[#666660] bg-[#1e1e1e]' : tip.tier_required === 'pro' ? 'text-[#00FF87] bg-[rgba(0,255,135,0.1)]' : 'text-[#ffc800] bg-[rgba(255,200,0,0.1)]'}`}>
                    {tip.tier_required}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
