import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yxrkpxehqzbaunznvqii.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_vAdBlbwNSwQ5VijB03zLbA_EcQ8KlbH'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
