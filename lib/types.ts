export type SubscriptionTier = 'free' | 'pro' | 'vip'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  tier: SubscriptionTier
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: string | null
  created_at: string
}

export interface Tip {
  id: string
  race_date: string
  track: string
  race_number: number
  distance: string
  horse_name: string
  jockey: string
  trainer: string
  barrier: number
  weight: string
  model_odds: string
  iq_score: number
  analysis: string
  tier_required: SubscriptionTier
  result: 'pending' | 'win' | 'place' | 'unplaced'
  sp_odds: string | null
  profit_loss: number | null
  created_at: string
}

export interface TrackRecord {
  total_selections: number
  winners: number
  places: number
  unplaced: number
  strike_rate: number
  roi: number
  total_profit: number
}
