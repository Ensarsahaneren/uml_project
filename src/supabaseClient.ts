import { createClient } from '@supabase/supabase-js';

// Bu bilgileri Supabase panelinden alıp buraya yapıştırın
const supabaseUrl = 'https://xssukamqutkctminbpeq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhzc3VrYW1xdXRrY3RtaW5icGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODgzNjksImV4cCI6MjA4MDI2NDM2OX0.NFhyo-6wby-AzRMDdCpktM5s7szXK2AW--tEJH7iNnA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);