import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseAdmin = createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function getTierFromPriceId(priceId: string): 'free' | 'pro' | 'vip' {
  if (priceId === process.env.STRIPE_VIP_PRICE_ID) return 'vip'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
  return 'free'
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const getUserId = async (customerId: string) => {
    const { data } = await supabaseAdmin.from('profiles').select('id').eq('stripe_customer_id', customerId).single()
    return data?.id
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      if (!userId || !session.subscription) break
      const sub = await stripe.subscriptions.retrieve(session.subscription as string)
      const priceId = sub.items.data[0].price.id
      await supabaseAdmin.from('profiles').update({
        stripe_subscription_id: sub.id,
        subscription_status: sub.status,
        tier: getTierFromPriceId(priceId),
      }).eq('id', userId)
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = await getUserId(sub.customer as string)
      if (!userId) break
      const priceId = sub.items.data[0].price.id
      await supabaseAdmin.from('profiles').update({
        subscription_status: sub.status,
        tier: sub.status === 'active' ? getTierFromPriceId(priceId) : 'free',
      }).eq('id', userId)
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = await getUserId(sub.customer as string)
      if (!userId) break
      await supabaseAdmin.from('profiles').update({ tier: 'free', subscription_status: 'canceled', stripe_subscription_id: null }).eq('id', userId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
