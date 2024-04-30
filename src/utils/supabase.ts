import { createClient } from "@supabase/supabase-js"

const supabaseURL = "https://suirpvmcirtckcaeboom.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aXJwdm1jaXJ0Y2tjYWVib29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzOTM0MDUsImV4cCI6MjAyOTk2OTQwNX0.x6ARBtsFnL-AJkMNrGzp_g-YKoj4Z0R5YSoPu3tdgAM"

console.log(supabaseURL)
const supabase = createClient(supabaseURL, supabaseAnonKey)

export default supabase
