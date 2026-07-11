import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yxrkpxehqzbaunznwqii.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cmtweGVocXpiYXVuem52cWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5Mzc4MjEsImV4cCI6MjA5ODUxMzgyMX0.sWTVPDAwz1NG9IzRrWTLcD7a8eT3q5emg_oqkAiez48'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
