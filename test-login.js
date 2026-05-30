const SUPABASE_URL = 'https://qkvwsepwnsqpcvlfziao.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdndzZXB3bnNxcGN2bGZ6aWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNDIyNzQsImV4cCI6MjA5MzgxODI3NH0.GrGE-XiPDANFXf-_mAMkI3PpdFyiVXzbXJKDXyyIAFU';

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
