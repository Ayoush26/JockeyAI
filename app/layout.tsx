import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FormIQ — AI-Powered Australian Racing Tips',
  description: 'Data-driven thoroughbred racing tips for NSW and VIC metropolitan meetings.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0a0a0a] text-[#e8e8e2] antialiased" style={{fontFamily:"'DM Sans', sans-serif"}}>
        {children}
      </body>
    </html>
  )
}
