document.addEventListener('DOMContentLoaded', () => {
  const navEvents = document.getElementById('nav-events');
  const navPosts = document.getElementById('nav-posts');
  
  const sectionEvents = document.getElementById('section-events');
  const sectionPosts = document.getElementById('section-posts');

  if (!navEvents || !navPosts) return;

  navEvents.addEventListener('click', (e) => {
    e.preventDefault();
    navEvents.classList.add('active');
    navPosts.classList.remove('active');
    sectionEvents.style.display = 'block';
    sectionPosts.style.display = 'none';
  });

  navPosts.addEventListener('click', (e) => {
    e.preventDefault();
    navPosts.classList.add('active');
    navEvents.classList.remove('active');
    sectionPosts.style.display = 'block';
    sectionEvents.style.display = 'none';
  });
});
