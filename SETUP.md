# FormIQ — Setup Guide

## What you've built

A full Next.js web app with:
- Public landing page (marketing site)
- User auth (signup, login, email confirmation)
- Members dashboard with free/pro/vip tier gating
- Tips page (locked content for free users)
- Account & billing page
- Stripe subscription payments (checkout + billing portal)
- Stripe webhook (auto-upgrades user tier on payment)
- Admin panel to publish tips and update results
- Supabase database with row-level security

---

## Step 1 — Set up Supabase (free)

1. Go to **supabase.com** → create a new project
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → run it
3. Go to **Settings > API** → copy:
   - Project URL
   - anon/public key
   - service_role key (keep this secret)

---

## Step 2 — Set up Stripe (free account)

1. Go to **dashboard.stripe.com** → create account
2. Go to **Products** → create two products:
   - "FormIQ Pro" — $29/month recurring → copy the Price ID
   - "FormIQ VIP" — $149/month recurring → copy the Price ID
3. Go to **Developers > API keys** → copy publishable key and secret key
4. Go to **Developers > Webhooks** → add endpoint:
   - URL: `https://your-domain.com/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the webhook signing secret

---

## Step 3 — Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_VIP_PRICE_ID=price_...

NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Step 4 — Deploy to Vercel (free)

1. Push this project to a GitHub repo
2. Go to **vercel.com** → Import project → select your repo
3. Add all environment variables in Vercel's settings
4. Deploy — Vercel gives you a free `.vercel.app` URL instantly
5. Connect your custom domain (formiq.com.au) in Vercel settings

---

## Step 5 — Make yourself admin

After your first signup, go to Supabase > Table Editor > profiles > find your row > set `tier` to `vip` manually. This gives you full access.

The admin panel is at `/admin` — bookmark it.

---

## Step 6 — Publish your first tip

Go to `/admin` → fill in the form → click "Publish Tip". That's it. The tip immediately appears in the members dashboard for subscribers at the right tier.

---

## Monthly running cost

| Service | Cost |
|---|---|
| Supabase | Free (up to 500MB) |
| Vercel | Free (up to 100GB bandwidth) |
| Stripe | 1.7% + 30c per transaction (AU) |
| Domain | ~$20/year |
| Punting Form API (data) | ~$50/month |
| **Total fixed cost** | **~$50/month** |

---

## Next steps to build

1. **Python AI scoring model** — pulls racing data, scores horses, auto-publishes tips to Supabase
2. **Telegram bot** — auto-posts tips to your channel when model runs
3. **Beehiiv email integration** — triggers email to subscribers on race day
4. **Track record page** — auto-calculated from tips table, shows running P/L

---

## Local development

```bash
npm install
cp .env.local.example .env.local
# fill in .env.local with your keys
npm run dev
# → http://localhost:3000
```
