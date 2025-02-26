const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create a Supabase client with the anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSession() {
  try {
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw sessionError;
    }
    
    if (!session) {
      console.log('No active session found');
      return;
    }
    
    console.log('Active session found:');
    console.log('User ID:', session.user.id);
    console.log('User Email:', session.user.email);
    console.log('User Metadata:', session.user.user_metadata);
    
    // Get the user details
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw userError;
    }
    
    if (user) {
      console.log('\nUser details:');
      console.log('User ID:', user.id);
      console.log('User Email:', user.email);
      console.log('User Metadata:', user.user_metadata);
      console.log('Role:', user.user_metadata?.role || 'No role assigned');
    }
  } catch (error) {
    console.error('Error checking session:', error);
  }
}

checkSession(); 