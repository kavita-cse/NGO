document.addEventListener('DOMContentLoaded', async () => {
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.includes('admin-login.html');
  const isDashboardPage = currentPath.includes('admin-dashboard.html');
  
  // Always redirect away from login page to dashboard
  if (isLoginPage) {
    window.location.href = 'admin-dashboard.html';
    return;
  }

  // If on dashboard, just update the UI
  if (isDashboardPage) {
    const userEmailEl = document.getElementById('user-email');
    if (userEmailEl) {
      userEmailEl.textContent = `Welcome, Admin`;
    }
  }
});
