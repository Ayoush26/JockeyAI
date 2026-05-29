'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Nav() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-5 border-b border-[#1e1e1e] bg-[rgba(10,10,10,0.92)] backdrop-blur-md">
      <Link href="/" className="font-bebas text-3xl tracking-widest text-[#00FF87]">
        Form<span className="text-[#e8e8e2]">IQ</span>
      </Link>
      <ul className="hidden md:flex gap-9 list-none">
        {[['#how','How it works'],['#tips','Today\'s Tips'],['#record','Track Record'],['#pricing','Pricing']].map(([href,label]) => (
          <li key={href}>
            <a href={href} className="text-[#666660] text-xs tracking-widest uppercase hover:text-[#e8e8e2] transition-colors">{label}</a>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link href="/dashboard" className="text-xs tracking-widest uppercase text-[#e8e8e2] hover:text-[#00FF87] transition-colors">Dashboard</Link>
            <button onClick={signOut} className="text-xs tracking-widest uppercase text-[#666660] hover:text-[#e8e8e2] transition-colors">Sign out</button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-xs tracking-widest uppercase text-[#666660] hover:text-[#e8e8e2] transition-colors">Login</Link>
            <Link href="/signup" className="bg-[#00FF87] text-[#0a0a0a] px-6 py-2.5 text-xs font-medium tracking-widest uppercase rounded-sm hover:opacity-85 transition-opacity">
              Get Free Tips
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
