const SUPABASE_URL = 'https://cbqbqncbjxfwrhhgxmjk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_XEBmcn5vcJGWBDO3GH9GRw_f55J9d9_';

async function testLogin() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'admin@kswf.org',
      password: 'jayshreekrishna'
    })
  });
  
  const data = await res.json();
  console.log(data);
}

testLogin();
