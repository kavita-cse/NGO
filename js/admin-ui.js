document.addEventListener('DOMContentLoaded', () => {
  const navItems = {
    'nav-highlights': document.getElementById('section-highlights'),
    'nav-spotlight': document.getElementById('section-spotlight'),
    'nav-work-updates': document.getElementById('section-work-updates'),
    'nav-inquiries': document.getElementById('section-inquiries')
  };

  const navLinks = Object.keys(navItems).map(id => document.getElementById(id)).filter(el => el);

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active from all
      navLinks.forEach(nav => nav.classList.remove('active'));
      Object.values(navItems).forEach(section => {
        if(section) section.style.display = 'none';
      });

      // Add active to clicked
      link.classList.add('active');
      const section = navItems[link.id];
      if (section) section.style.display = 'block';
    });
  });
});
