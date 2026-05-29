import Nav from '@/components/Nav'
import Link from 'next/link'

const SAMPLE_TIPS = [
  { track: 'Randwick', race: 5, dist: '1200m', horse: 'Coastal Storm', jockey: 'J. McDonald', trainer: 'C. Waller', barrier: 3, weight: '57kg', odds: '$4.20', score: 87, result: 'win', analysis: 'Strong recent form, dropping back in class after unlucky run. McDonald booking significant — trainer has 38% strike rate at this track over 1200m. Barrier 3 ideal for on-pace style.' },
  { track: 'Flemington', race: 7, dist: '1600m', horse: 'Iron Decree', jockey: 'D. Oliver', trainer: 'D. Hayes', barrier: 7, weight: '56.5kg', odds: '$6.50', score: 79, result: 'place', analysis: 'Consistent mile performer, fresh up from a spell. Soft track suits perfectly — model rates this horse 22% above market implied probability on wet ground. Value play.' },
  { track: 'Rosehill', race: 3, dist: '1400m', horse: 'Northern Light', jockey: 'T. Berry', trainer: 'G. Waterhouse', barrier: 1, weight: '55kg', odds: '$3.80', score: 92, result: 'pending', analysis: 'Top IQ score this week. Three consecutive top-3 finishes at this track and distance. Berry rides with purpose from barrier 1. Hard to beat.' },
]

const TRACK_RECORD = [
  { date: '24 May', track: 'Randwick', race: 'R5', horse: 'Coastal Storm', odds: '$4.20', result: 'WIN', pl: '+$32.00', total: '+$478.00', pos: true },
  { date: '24 May', track: 'Flemington', race: 'R7', horse: 'Iron Decree', odds: '$6.50', result: 'PLACE', pl: '+$11.50', total: '+$446.00', pos: true },
  { date: '24 May', track: 'Rosehill', race: 'R4', horse: 'Cape Fury', odds: '$9.00', result: 'UNPLACED', pl: '-$10.00', total: '+$434.50', pos: true },
  { date: '17 May', track: 'Randwick', race: 'R6', horse: 'Silk Road', odds: '$3.40', result: 'WIN', pl: '+$24.00', total: '+$444.50', pos: true },
  { date: '17 May', track: 'Flemington', race: 'R3', horse: 'Waverly Star', odds: '$5.50', result: 'UNPLACED', pl: '-$10.00', total: '+$420.50', pos: true },
]

export default function Home() {
  return (
    <main>
      <Nav />

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center px-12 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'linear-gradient(#00FF87 1px,transparent 1px),linear-gradient(90deg,#00FF87 1px,transparent 1px)',backgroundSize:'60px 60px'}} />
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-[#00FF87]" />
          <span className="font-mono-dm text-[11px] text-[#00FF87] tracking-[3px] uppercase">Australian Thoroughbred Racing</span>
        </div>
        <h1 className="font-bebas text-[clamp(64px,10vw,130px)] leading-[0.9] tracking-wide mb-8 max-w-4xl">
          Data-Driven<br /><span className="text-[#00FF87]">Race Intelligence</span>
        </h1>
        <p className="text-lg text-[#666660] max-w-lg leading-relaxed mb-12">
          FormIQ uses an <strong className="text-[#e8e8e2] font-medium">AI scoring model</strong> built on decades of Australian thoroughbred data to find genuine value — every Saturday metropolitan meeting, NSW &amp; VIC.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link href="/signup" className="bg-[#00FF87] text-[#0a0a0a] px-9 py-4 text-sm font-medium tracking-[1.5px] uppercase rounded-sm hover:opacity-85 transition-opacity">Get Free Tips</Link>
          <a href="#how" className="border border-[#1e1e1e] text-[#e8e8e2] px-9 py-4 text-sm tracking-[1.5px] uppercase rounded-sm hover:border-[#666660] transition-colors">See How It Works</a>
        </div>
        <div className="flex gap-12 mt-20 pt-12 border-t border-[#1e1e1e] flex-wrap">
          {[['47.8u','+','Profit since launch'],['31%','','Strike rate'],['+18.2%','','ROI at level stakes'],['100%','','Transparent — every bet published']].map(([val,pre,label]) => (
            <div key={label}>
              <div className="font-bebas text-5xl text-[#00FF87] leading-none">{pre}{val}</div>
              <div className="text-xs text-[#666660] tracking-widest uppercase mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-[#00FF87] text-[#0a0a0a] py-3 overflow-hidden font-mono-dm text-xs tracking-widest">
        <div className="flex gap-16 whitespace-nowrap ticker-animate">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex gap-16">
              <span>RANDWICK R5 — COASTAL STORM — $4.20 ✓ WIN</span>
              <span className="opacity-40">///</span>
              <span>FLEMINGTON R7 — IRON DECREE — $6.50 ✓ PLACE</span>
              <span className="opacity-40">///</span>
              <span>ROSEHILL R4 — NORTHERN LIGHT — $3.80 ✓ WIN</span>
              <span className="opacity-40">///</span>
              <span>RANDWICK R6 — CAPE FURY — $9.00 ✗ UNPLACED</span>
              <span className="opacity-40">///</span>
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how" className="px-12 py-24">
        <div className="font-mono-dm text-[11px] text-[#00FF87] tracking-[3px] uppercase mb-4">The system</div>
        <h2 className="font-bebas text-[clamp(40px,6vw,72px)] tracking-wide leading-none mb-16">How FormIQ Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1e1e1e] border border-[#1e1e1e]">
          {[
            ['01','Data ingestion','Pipeline pulls live fields, form history, sectional times, track conditions, jockey and trainer stats for every runner at NSW and VIC metro meetings.'],
            ['02','AI scoring model','Each runner scored across 8 weighted factors — recent form, class, jockey strike rate, trainer performance, barrier, weight, and track suitability.'],
            ['03','Delivered to you','Selections land in email by 8am race day. Live updates post to Telegram. Full model ratings for every runner in the members area.'],
          ].map(([num,title,desc]) => (
            <div key={num} className="bg-[#111] p-12 group">
              <div className="font-bebas text-8xl text-[#1e1e1e] leading-none mb-6 group-hover:text-[#00FF87] transition-colors duration-300">{num}</div>
              <h3 className="text-lg font-medium mb-3">{title}</h3>
              <p className="text-sm text-[#666660] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIPS SAMPLE */}
      <section id="tips" className="bg-[#111] px-12 py-24">
        <div className="font-mono-dm text-[11px] text-[#00FF87] tracking-[3px] uppercase mb-4">Sample selections</div>
        <h2 className="font-bebas text-[clamp(40px,6vw,72px)] tracking-wide leading-none mb-16">Today's Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1e1e1e]">
          {SAMPLE_TIPS.map((tip) => (
            <div key={tip.horse} className="bg-[#0a0a0a] p-8 flex flex-col gap-4 hover:bg-[#131313] transition-colors">
              <div className="flex justify-between items-start">
                <div className="font-mono-dm text-[11px] text-[#00FF87] tracking-widest uppercase">
                  {tip.track} · Race {tip.race} · {tip.dist}
                </div>
                <span className={`text-[11px] px-2.5 py-1 rounded-sm font-medium tracking-widest uppercase ${
                  tip.result === 'win' ? 'bg-[rgba(0,255,135,0.12)] text-[#00FF87]' :
                  tip.result === 'place' ? 'bg-[rgba(255,200,0,0.12)] text-[#ffc800]' :
                  'bg-[rgba(255,255,255,0.06)] text-[#666660]'
                }`}>{tip.result === 'pending' ? 'Pending' : tip.result === 'win' ? 'Win ✓' : 'Place ✓'}</span>
              </div>
              <div className="text-2xl font-medium tracking-wide">{tip.horse}</div>
              <div className="flex gap-5 font-mono-dm text-[11px]">
                {[['Jockey',tip.jockey],['Trainer',tip.trainer],['Barrier',tip.barrier],['Weight',tip.weight]].map(([l,v]) => (
                  <span key={String(l)} className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#666660] tracking-widest uppercase">{l}</span>
                    <strong className="text-[#e8e8e2] text-sm">{v}</strong>
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-[#666660] tracking-widest uppercase mb-1">Model odds</div>
                  <div className="font-bebas text-4xl text-[#00FF87]">{tip.odds}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#666660] tracking-widest uppercase mb-1">IQ Score</div>
                  <div className="font-bebas text-4xl text-[#e8e8e2]">{tip.score}<span className="text-lg text-[#666660]">/100</span></div>
                </div>
              </div>
              <div className="text-sm text-[#666660] leading-relaxed border-t border-[#1e1e1e] pt-4">{tip.analysis}</div>
            </div>
          ))}
          <div className="bg-[#0a0a0a] p-8 flex flex-col gap-4 items-center justify-center text-center">
            <div className="font-mono-dm text-[11px] text-[#00FF87] tracking-widest">Members only</div>
            <div className="font-bebas text-4xl">+4 more selections</div>
            <div className="text-sm text-[#666660] max-w-xs leading-relaxed">Full card ratings, model scores and analysis for every race.</div>
            <Link href="/signup" className="mt-2 bg-[#00FF87] text-[#0a0a0a] px-8 py-3 text-sm font-medium tracking-widest uppercase rounded-sm hover:opacity-85 transition-opacity">See Plans</Link>
          </div>
        </div>
      </section>

      {/* TRACK RECORD */}
      <section id="record" className="px-12 py-24">
        <div className="font-mono-dm text-[11px] text-[#00FF87] tracking-[3px] uppercase mb-4">Full transparency</div>
        <h2 className="font-bebas text-[clamp(40px,6vw,72px)] tracking-wide leading-none mb-4">Track Record</h2>
        <p className="text-sm text-[#666660] max-w-xl leading-relaxed mb-10">Every selection published — wins and losses. Level stakes $10/unit. No cherry picking, ever.</p>
        <div className="overflow-x-auto">
          <table className="w-full font-mono-dm text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                {['Date','Track','Race','Horse','Odds','Result','P/L','Running Total'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] text-[#666660] tracking-widest uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRACK_RECORD.map((r,i) => (
                <tr key={i} className="border-b border-[#1e1e1e] hover:bg-[#111] transition-colors">
                  <td className="px-4 py-4 text-[#e8e8e2]">{r.date}</td>
                  <td className="px-4 py-4 text-[#666660]">{r.track}</td>
                  <td className="px-4 py-4 text-[#666660]">{r.race}</td>
                  <td className="px-4 py-4 text-[#666660]">{r.horse}</td>
                  <td className="px-4 py-4 text-[#666660]">{r.odds}</td>
                  <td className={`px-4 py-4 font-medium ${r.result==='WIN'?'text-[#00FF87]':r.result==='PLACE'?'text-[#ffc800]':'text-[#ff4444]'}`}>{r.result}</td>
                  <td className={`px-4 py-4 ${r.pl.startsWith('+') ? 'text-[#00FF87]' : 'text-[#ff4444]'}`}>{r.pl}</td>
                  <td className="px-4 py-4 text-[#00FF87]">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-8 font-mono-dm text-[11px] text-[#666660] flex-wrap">
          <span>Total: <strong className="text-[#e8e8e2]">147</strong></span>
          <span>Winners: <strong className="text-[#00FF87]">46 (31%)</strong></span>
          <span>Places: <strong className="text-[#ffc800]">38</strong></span>
          <span>ROI: <strong className="text-[#00FF87]">+18.2%</strong></span>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-12 py-24 bg-[#111]">
        <div className="font-mono-dm text-[11px] text-[#00FF87] tracking-[3px] uppercase mb-4">Plans</div>
        <h2 className="font-bebas text-[clamp(40px,6vw,72px)] tracking-wide leading-none mb-16">Simple Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1e1e1e] border border-[#1e1e1e]">
          {[
            { badge:'Free forever', name:'Form Guide', price:'$0', period:'/mo', desc:'One free tip per Saturday meeting.', featured:false,
              features:['1 selection per meeting','Email delivery 8am race day','Access to track record'], locked:['Full card ratings','Telegram channel access','Model scores for all runners'],
              cta:'Get Started Free', href:'/signup', outline:true },
            { badge:'Most popular', name:'FormIQ Pro', price:'$29', period:'/mo', desc:'Full access to every selection and Telegram community.', featured:true,
              features:['All selections — full card','Email delivery 8am race day','Telegram channel (live updates)','Model IQ scores for all runners','Full track record access'], locked:['B2B data access'],
              cta:'Start 7-Day Free Trial', href:'/signup?plan=pro', outline:false },
            { badge:'Serious punters', name:'FormIQ VIP', price:'$149', period:'/mo', desc:'Everything in Pro plus private channel and weekly calls.', featured:false,
              features:['Everything in Pro','Private VIP Telegram group','Full model data export (CSV)','Weekly strategy breakdown','Priority support','Early access to new features'], locked:[],
              cta:'Join VIP', href:'/signup?plan=vip', outline:true },
          ].map((plan) => (
            <div key={plan.name} className={`p-12 flex flex-col ${plan.featured ? 'bg-[#0f1f15]' : 'bg-[#111]'}`}>
              <span className="font-mono-dm text-[10px] text-[#00FF87] tracking-widest uppercase mb-5">{plan.badge}</span>
              <div className="font-bebas text-3xl tracking-wide mb-2">{plan.name}</div>
              <div className="font-bebas text-6xl leading-none text-[#00FF87] mb-1">{plan.price}<span className="text-xl text-[#666660]">{plan.period}</span></div>
              <p className="text-sm text-[#666660] leading-relaxed mb-9">{plan.desc}</p>
              <ul className="flex flex-col gap-3 mb-9 flex-1">
                {plan.features.map(f => <li key={f} className="text-sm text-[#e8e8e2] flex gap-2.5"><span className="text-[#00FF87] font-mono-dm">→</span>{f}</li>)}
                {plan.locked.map(f => <li key={f} className="text-sm text-[#333330] flex gap-2.5"><span className="font-mono-dm">–</span>{f}</li>)}
              </ul>
              <Link href={plan.href} className={`text-center py-4 text-sm tracking-[1.5px] uppercase rounded-sm transition-opacity hover:opacity-85 ${plan.outline ? 'border border-[#1e1e1e] text-[#e8e8e2] hover:border-[#666660]' : 'bg-[#00FF87] text-[#0a0a0a] font-medium'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* SIGNUP CTA */}
      <section id="signup" className="bg-[#00FF87] text-[#0a0a0a] text-center px-12 py-24">
        <h2 className="font-bebas text-[clamp(40px,6vw,72px)] tracking-wide leading-none mb-4">Get This Saturday's Tips Free</h2>
        <p className="text-base mb-10 opacity-70 max-w-md mx-auto">Join 2,400+ punters getting AI-powered selections every week. No credit card.</p>
        <Link href="/signup" className="inline-block bg-[#0a0a0a] text-[#00FF87] px-10 py-4 text-sm font-medium tracking-[1.5px] uppercase rounded-sm hover:opacity-85 transition-opacity">
          Create Free Account
        </Link>
      </section>

      {/* DISCLAIMER */}
      <div className="px-12 py-8 border-t border-[#1e1e1e] text-[11px] text-[#666660] leading-relaxed text-center max-w-3xl mx-auto">
        <strong>Responsible Gambling:</strong> FormIQ provides racing information for entertainment and informational purposes only. This content does not constitute financial or gambling advice. Past results are not indicative of future performance. Please gamble responsibly. Gambling Help Online: <strong>1800 858 858</strong> · gamblinghelponline.org.au · 18+ only.
      </div>

      {/* FOOTER */}
      <footer className="px-12 py-12 border-t border-[#1e1e1e] flex justify-between items-center flex-wrap gap-6">
        <div className="font-bebas text-2xl tracking-widest text-[#00FF87]">FormIQ</div>
        <div className="flex gap-8">
          {['Privacy Policy','Terms of Service','Contact','Responsible Gambling'].map(l => (
            <a key={l} href="#" className="text-xs text-[#666660] tracking-widest uppercase hover:text-[#e8e8e2] transition-colors">{l}</a>
          ))}
        </div>
        <div className="text-xs text-[#666660]">© 2026 FormIQ. All rights reserved.</div>
      </footer>
    </main>
  )
}
