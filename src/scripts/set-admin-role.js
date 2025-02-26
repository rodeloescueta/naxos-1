const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setUserAsAdmin(userEmail) {
  try {
    // Get the user by email
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      throw error;
    }
    
    const user = data.users.find(u => u.email === userEmail);
    
    if (!user) {
      throw new Error(`User with email ${userEmail} not found`);
    }
    
    console.log('Found user:', user.id, user.email);
    
    // Update the user's metadata to include the admin role
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: { role: 'admin' } }
    );
    
    if (updateError) {
      throw updateError;
    }
    
    console.log(`Successfully set user ${userEmail} as admin`);
    console.log('Updated user metadata:', updateData.user.user_metadata);
  } catch (error) {
    console.error('Error setting user as admin:', error);
  }
}

// Get the email from command line arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Please provide a user email as an argument');
  console.log('Usage: node src/scripts/set-admin-role.js user@example.com');
  process.exit(1);
}

setUserAsAdmin(userEmail); 