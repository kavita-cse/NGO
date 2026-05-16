document.addEventListener('DOMContentLoaded', async () => {
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.includes('admin-login.html');
  const isDashboardPage = currentPath.includes('admin-dashboard.html');
  
  try {
    // 1. Check existing session
    let { data: { session }, error } = await supabase.auth.getSession();
    
    // 2. Silently authenticate the admin in the background so database operations work
    if (!session) {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@kswf.org',
        password: 'jayshreekrishna',
      });
      if (!signInError) {
        session = data.session;
      } else {
        console.error('Background login failed:', signInError);
      }
    }

    // 3. Always redirect away from login page to dashboard
    if (isLoginPage) {
      window.location.href = 'admin-dashboard.html';
      return;
    }

    // 4. If on dashboard, just update the UI
    if (isDashboardPage) {
      const userEmailEl = document.getElementById('user-email');
      if (userEmailEl) {
        userEmailEl.textContent = `Welcome, Admin`;
      }
    }

  } catch (err) {
    console.error('Auth session error:', err);
  }
});
