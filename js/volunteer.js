document.addEventListener('DOMContentLoaded', () => {
  const volunteerForm = document.getElementById('volunteer-form-element');
  const cardContainer = document.getElementById('volunteer-card-container');

  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect data
      const formData = new FormData(volunteerForm);
      const submission = {
        id: 'vol_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        role: formData.get('role'),
        message: formData.get('message'),
        date: new Date().toISOString(),
        status: 'Pending'
      };

      // Save to localStorage
      const existingApps = JSON.parse(localStorage.getItem('kswf_volunteer_applications') || '[]');
      existingApps.push(submission);
      localStorage.setItem('kswf_volunteer_applications', JSON.stringify(existingApps));

      // Display premium success state
      if (cardContainer) {
        cardContainer.style.transition = 'opacity 0.4s ease';
        cardContainer.style.opacity = '0';

        setTimeout(() => {
          cardContainer.innerHTML = `
            <div class="text-center p-3 fade-in-up" style="padding: 2.5rem 1.5rem;">
              <div style="font-size: 4rem; color: #4caf50; margin-bottom: 1.5rem; display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; background: rgba(76, 175, 80, 0.1); border: 2px solid rgba(76, 175, 80, 0.2);">
                <i class="fas fa-check-circle"></i>
              </div>
              <h3 style="font-size: 1.8rem; color: var(--primary-color); margin-bottom: 1rem; font-family: var(--font-heading);">Application Logged!</h3>
              <p class="font-sans text-muted" style="font-size: 0.95rem; line-height: 1.7; margin-bottom: 2rem;">
                Thank you, <strong>${submission.name}</strong>. Your volunteering application for the <strong>${submission.role.toUpperCase()}</strong> pathway has been successfully registered. We will review your profile and contact you soon.
              </p>
              <div class="flex flex-column gap-1">
                <a href="index.html" class="btn" style="padding: 0.7rem 1.5rem; font-size: 0.95rem;">Return Home</a>
                <button onclick="window.location.reload();" class="btn btn-accent" style="padding: 0.7rem 1.5rem; font-size: 0.95rem;">Apply for another role</button>
              </div>
            </div>
          `;
          cardContainer.style.opacity = '1';
        }, 400);
      }
    });
  }
});
