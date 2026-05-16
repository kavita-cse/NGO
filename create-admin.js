const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cbqbqncbjxfwrhhgxmjk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_XEBmcn5vcJGWBDO3GH9GRw_f55J9d9_';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@kswf.org',
    password: 'jayshreekrishna',
  });

  if (error) {
    console.error('Error creating user:', error.message);
  } else {
    console.log('User created:', data.user?.email);
  }
}

createAdmin();
