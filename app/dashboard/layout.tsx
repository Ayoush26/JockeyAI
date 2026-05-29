import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const tier = profile?.tier || 'free'

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen border-r border-[#1e1e1e] bg-[#0a0a0a] flex flex-col fixed top-0 bottom-0">
        <div className="p-6 border-b border-[#1e1e1e]">
          <Link href="/" className="font-bebas text-2xl tracking-widest text-[#00FF87]">
            Form<span className="text-[#e8e8e2]">IQ</span>
          </Link>
        </div>
        <nav className="p-4 flex flex-col gap-1 flex-1">
          {[
            ['/dashboard', 'Dashboard', '◈'],
            ['/dashboard/tips', "Today's Tips", '◎'],
            ['/dashboard/account', 'Account & Billing', '◇'],
          ].map(([href, label, icon]) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#666660] hover:text-[#e8e8e2] hover:bg-[#111] rounded-sm transition-colors">
              <span className="text-[#00FF87]">{icon}</span>{label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#1e1e1e]">
          <div className="px-4 py-3">
            <div className="text-[10px] text-[#666660] tracking-widest uppercase font-mono-dm mb-1">Current plan</div>
            <div className={`text-sm font-medium tracking-wide ${tier === 'vip' ? 'text-[#ffc800]' : tier === 'pro' ? 'text-[#00FF87]' : 'text-[#666660]'}`}>
              {tier === 'free' ? 'Free' : tier === 'pro' ? 'FormIQ Pro' : 'FormIQ VIP'}
            </div>
            {tier === 'free' && (
              <Link href="/dashboard/account" className="text-[10px] text-[#00FF87] tracking-widest uppercase mt-1 block hover:opacity-75">Upgrade →</Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-10">
        {children}
      </main>
    </div>
  )
}
