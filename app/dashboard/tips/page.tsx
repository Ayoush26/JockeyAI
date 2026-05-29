import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function TipsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user!.id).single()
  const tier = profile?.tier || 'free'

  const today = new Date().toISOString().split('T')[0]
  const { data: tips } = await supabase
    .from('tips')
    .select('*')
    .eq('race_date', today)
    .order('iq_score', { ascending: false })

  const groupedByTrack = tips?.reduce((acc: Record<string, typeof tips>, tip) => {
    acc[tip.track] = acc[tip.track] || []
    acc[tip.track].push(tip)
    return acc
  }, {}) || {}

  return (
    <div>
      <div className="mb-10">
        <div className="font-mono-dm text-[11px] text-[#00FF87] tracking-[3px] uppercase mb-2">
          {new Date().toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long' })}
        </div>
        <h1 className="font-bebas text-5xl tracking-wide">Today's Tips</h1>
      </div>

      {tips && tips.length > 0 ? (
        Object.entries(groupedByTrack).map(([track, trackTips]) => (
          <div key={track} className="mb-10">
            <h2 className="font-bebas text-3xl tracking-wide mb-4 text-[#00FF87]">{track}</h2>
            <div className="flex flex-col gap-px bg-[#1e1e1e] border border-[#1e1e1e]">
              {trackTips.map(tip => {
                const locked = tip.tier_required !== 'free' && tier === 'free'
                return (
                  <div key={tip.id} className={`bg-[#111] p-6 ${locked ? 'opacity-60 relative' : ''}`}>
                    {locked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/80 z-10 rounded-sm">
                        <div className="text-center">
                          <div className="text-[#00FF87] text-sm font-medium mb-2">Pro subscribers only</div>
                          <Link href="/dashboard/account" className="text-[10px] text-[#666660] tracking-widest uppercase border border-[#1e1e1e] px-4 py-2 rounded-sm hover:border-[#666660] transition-colors">
                            Upgrade to unlock
                          </Link>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-mono-dm text-[11px] text-[#666660] tracking-widest uppercase mb-1">
                          Race {tip.race_number} · {tip.distance}
                        </div>
                        <div className="text-xl font-medium">{tip.horse_name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-[#666660] tracking-widest uppercase mb-1 font-mono-dm">IQ Score</div>
                        <div className="font-bebas text-3xl text-[#e8e8e2]">{tip.iq_score}<span className="text-sm text-[#666660]">/100</span></div>
                      </div>
                    </div>
                    <div className="flex gap-6 font-mono-dm text-[11px] mb-4">
                      {[['Jockey',tip.jockey],['Trainer',tip.trainer],['Barrier',tip.barrier],['Weight',tip.weight],['Model odds',tip.model_odds]].map(([l,v]) => (
                        <span key={String(l)} className="flex flex-col gap-1">
                          <span className="text-[10px] text-[#666660] tracking-widest uppercase">{l}</span>
                          <strong className="text-[#e8e8e2]">{v}</strong>
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-[#666660] leading-relaxed border-t border-[#1e1e1e] pt-4">{tip.analysis}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`text-[11px] px-2.5 py-1 rounded-sm font-medium tracking-widest uppercase ${
                        tip.result === 'win' ? 'bg-[rgba(0,255,135,0.12)] text-[#00FF87]' :
                        tip.result === 'place' ? 'bg-[rgba(255,200,0,0.12)] text-[#ffc800]' :
                        tip.result === 'unplaced' ? 'bg-[rgba(255,68,68,0.12)] text-[#ff4444]' :
                        'bg-[rgba(255,255,255,0.06)] text-[#666660]'
                      }`}>{tip.result}</span>
                      {tip.profit_loss !== null && (
                        <span className={`font-mono-dm text-sm font-medium ${tip.profit_loss >= 0 ? 'text-[#00FF87]' : 'text-[#ff4444]'}`}>
                          {tip.profit_loss >= 0 ? '+' : ''}${tip.profit_loss.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="border border-[#1e1e1e] bg-[#111] p-16 text-center">
          <div className="font-bebas text-4xl text-[#333330] mb-3">No tips today</div>
          <p className="text-sm text-[#666660]">Tips are published every Saturday morning by 8am AEST for all metropolitan meetings.</p>
        </div>
      )}
    </div>
  )
}
