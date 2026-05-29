import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single()
  const { data: recentTips } = await supabase.from('tips').select('*').order('race_date', { ascending: false }).limit(5)
  const { data: allTips } = await supabase.from('tips').select('*').neq('result', 'pending')

  const stats = allTips ? {
    total: allTips.length,
    wins: allTips.filter(t => t.result === 'win').length,
    places: allTips.filter(t => t.result === 'place').length,
    profit: allTips.reduce((sum, t) => sum + (t.profit_loss || 0), 0),
  } : { total: 0, wins: 0, places: 0, profit: 0 }

  const tier = profile?.tier || 'free'

  return (
    <div>
      <div className="mb-10">
        <div className="font-mono-dm text-[11px] text-[#00FF87] tracking-[3px] uppercase mb-2">Welcome back</div>
        <h1 className="font-bebas text-5xl tracking-wide">{profile?.full_name || user?.email?.split('@')[0]}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1e1e1e] border border-[#1e1e1e] mb-8">
        {[
          ['Total tips', stats.total, ''],
          ['Winners', `${stats.wins} (${stats.total ? Math.round(stats.wins/stats.total*100) : 0}%)`, 'text-[#00FF87]'],
          ['Places', stats.places, 'text-[#ffc800]'],
          ['Running P/L', `${stats.profit >= 0 ? '+' : ''}$${stats.profit.toFixed(2)}`, stats.profit >= 0 ? 'text-[#00FF87]' : 'text-[#ff4444]'],
        ].map(([label, val, color]) => (
          <div key={String(label)} className="bg-[#111] p-6">
            <div className="text-[10px] text-[#666660] tracking-widest uppercase font-mono-dm mb-3">{label}</div>
            <div className={`font-bebas text-4xl leading-none ${color || 'text-[#e8e8e2]'}`}>{val}</div>
          </div>
        ))}
      </div>

      {/* Upgrade banner for free users */}
      {tier === 'free' && (
        <div className="border border-[#00FF87]/20 bg-[#00FF87]/5 p-6 rounded-sm mb-8 flex items-center justify-between">
          <div>
            <div className="font-medium mb-1">You're on the free plan</div>
            <div className="text-sm text-[#666660]">Upgrade to Pro for all selections, Telegram access, and full model scores.</div>
          </div>
          <Link href="/dashboard/account" className="bg-[#00FF87] text-[#0a0a0a] px-6 py-3 text-sm font-medium tracking-widest uppercase rounded-sm hover:opacity-85 transition-opacity whitespace-nowrap ml-6">
            Upgrade now
          </Link>
        </div>
      )}

      {/* Recent tips */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bebas text-3xl tracking-wide">Recent Tips</h2>
          <Link href="/dashboard/tips" className="text-[11px] text-[#00FF87] tracking-widest uppercase font-mono-dm hover:opacity-75">View all →</Link>
        </div>
        {recentTips && recentTips.length > 0 ? (
          <div className="flex flex-col gap-px bg-[#1e1e1e] border border-[#1e1e1e]">
            {recentTips.map(tip => (
              <div key={tip.id} className="bg-[#111] px-6 py-4 flex items-center justify-between hover:bg-[#131313] transition-colors">
                <div className="flex items-center gap-6">
                  <div className="font-mono-dm text-[11px] text-[#666660] w-20">{new Date(tip.race_date).toLocaleDateString('en-AU',{day:'numeric',month:'short'})}</div>
                  <div>
                    <div className="font-medium text-sm">{tip.horse_name}</div>
                    <div className="text-[11px] text-[#666660]">{tip.track} R{tip.race_number} · {tip.model_odds}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-bebas text-2xl text-[#e8e8e2]">{tip.iq_score}<span className="text-sm text-[#666660]">/100</span></div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-sm font-medium tracking-widest uppercase ${
                    tip.result === 'win' ? 'bg-[rgba(0,255,135,0.12)] text-[#00FF87]' :
                    tip.result === 'place' ? 'bg-[rgba(255,200,0,0.12)] text-[#ffc800]' :
                    tip.result === 'unplaced' ? 'bg-[rgba(255,68,68,0.12)] text-[#ff4444]' :
                    'bg-[rgba(255,255,255,0.06)] text-[#666660]'
                  }`}>{tip.result}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-[#1e1e1e] bg-[#111] p-12 text-center">
            <div className="font-bebas text-3xl text-[#333330] mb-3">No tips yet</div>
            <p className="text-sm text-[#666660]">Tips will appear here on race day — every Saturday morning.</p>
          </div>
        )}
      </div>
    </div>
  )
}
