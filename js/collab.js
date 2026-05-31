document.addEventListener('DOMContentLoaded', () => {
  const collabTypeSelect = document.getElementById('collab-type');
  const dynamicFieldsContainer = document.getElementById('dynamic-fields');
  const collabForm = document.getElementById('collab-form-element');
  const formCard = document.getElementById('form-card-container');

  // Dynamic field templates based on collaboration type
  const fieldTemplates = {
    ngo: `
      <div class="form-group fade-in-up" style="animation-duration: 0.3s;">
        <label class="form-label">Organization Name *</label>
        <input type="text" name="orgName" class="form-control" required placeholder="e.g. Green Earth Society" />
      </div>
      <div class="form-grid fade-in-up" style="animation-duration: 0.4s;">
        <div class="form-group">
          <label class="form-label">Primary Focus *</label>
          <select name="orgFocus" class="form-control font-sans" required>
            <option value="" disabled selected>Select focus area</option>
            <option value="environment">Environmental Conservation</option>
            <option value="education">Underprivileged Education</option>
            <option value="health">Healthcare & Hygiene</option>
            <option value="disaster">Disaster Relief</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Registration No. (Optional)</label>
          <input type="text" name="orgReg" class="form-control" placeholder="NGO Registration Number" />
        </div>
      </div>
      <div class="form-group fade-in-up" style="animation-duration: 0.5s;">
        <label class="form-label">Collaboration Objective *</label>
        <input type="text" name="collabObjective" class="form-control" required placeholder="e.g. Co-hosting a community clean-up drive" />
      </div>
    `,
    creator: `
      <div class="form-grid fade-in-up" style="animation-duration: 0.3s;">
        <div class="form-group">
          <label class="form-label">Primary Platform *</label>
          <select name="creatorPlatform" class="form-control font-sans" required>
            <option value="" disabled selected>Select platform</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="linkedin">LinkedIn</option>
            <option value="blog">Personal Blog/Website</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Social Handle / Website Link *</label>
          <input type="text" name="creatorLink" class="form-control" required placeholder="e.g. @yourhandle or website.com" />
        </div>
      </div>
      <div class="form-group fade-in-up" style="animation-duration: 0.4s;">
        <label class="form-label">Audience Size / Reach *</label>
        <select name="creatorReach" class="form-control font-sans" required>
          <option value="" disabled selected>Select audience size</option>
          <option value="micro">< 10k followers</option>
          <option value="mid">10k - 100k followers</option>
          <option value="macro">> 100k followers</option>
        </select>
      </div>
    `,
    corporate: `
      <div class="form-group fade-in-up" style="animation-duration: 0.3s;">
        <label class="form-label">Company / Brand Name *</label>
        <input type="text" name="corpName" class="form-control" required placeholder="e.g. Acme Corporation" />
      </div>
      <div class="form-grid fade-in-up" style="animation-duration: 0.4s;">
        <div class="form-group">
          <label class="form-label">CSR Interest *</label>
          <select name="corpCsrInterest" class="form-control font-sans" required>
            <option value="" disabled selected>Select alignment</option>
            <option value="green">Environmental & Green Projects</option>
            <option value="community">Community Development & Health</option>
            <option value="employee">Employee Volunteering Drives</option>
            <option value="sponsorship">Event/Program Sponsorship</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Corporate CSR Budget Range (Optional)</label>
          <select name="corpBudget" class="form-control font-sans">
            <option value="" disabled selected>Select range</option>
            <option value="small">< ₹50,000</option>
            <option value="medium">₹50,000 - ₹2,00,000</option>
            <option value="large">> ₹2,00,000</option>
          </select>
        </div>
      </div>
    `,
    academic: `
      <div class="form-group fade-in-up" style="animation-duration: 0.3s;">
        <label class="form-label">Educational Institution Name *</label>
        <input type="text" name="eduName" class="form-control" required placeholder="e.g. Delhi Public School" />
      </div>
      <div class="form-grid fade-in-up" style="animation-duration: 0.4s;">
        <div class="form-group">
          <label class="form-label">Institution Type *</label>
          <select name="eduType" class="form-control font-sans" required>
            <option value="" disabled selected>Select type</option>
            <option value="school">School</option>
            <option value="college">College/Undergraduate</option>
            <option value="university">University/Postgraduate</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Proposed Activity *</label>
          <select name="eduActivity" class="form-control font-sans" required>
            <option value="" disabled selected>Select activity</option>
            <option value="workshop">Awareness Workshop/Seminar</option>
            <option value="drive">Campus Recycling/Cleanliness Drive</option>
            <option value="internships">Student Volunteering/Internships</option>
            <option value="other">Other Co-hosted Event</option>
          </select>
        </div>
      </div>
    `
  };

  // Listen to collaboration type changes
  if (collabTypeSelect) {
    collabTypeSelect.addEventListener('change', (e) => {
      const selectedType = e.target.value;
      if (fieldTemplates[selectedType]) {
        dynamicFieldsContainer.innerHTML = fieldTemplates[selectedType];
        dynamicFieldsContainer.style.display = 'block';
      } else {
        dynamicFieldsContainer.innerHTML = '';
        dynamicFieldsContainer.style.display = 'none';
      }
    });
  }

  // Handle Form Submission
  if (collabForm) {
    collabForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect data
      const formData = new FormData(collabForm);
      const submission = {
        id: 'collab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        collabType: formData.get('collabType'),
        message: formData.get('message'),
        date: new Date().toISOString(),
        status: 'Pending',
        details: {}
      };

      // Collect dynamic fields specific to selected partnership type
      const selectedType = submission.collabType;
      if (selectedType === 'ngo') {
        submission.details = {
          orgName: formData.get('orgName'),
          orgFocus: formData.get('orgFocus'),
          orgReg: formData.get('orgReg'),
          collabObjective: formData.get('collabObjective')
        };
      } else if (selectedType === 'creator') {
        submission.details = {
          creatorPlatform: formData.get('creatorPlatform'),
          creatorLink: formData.get('creatorLink'),
          creatorReach: formData.get('creatorReach')
        };
      } else if (selectedType === 'corporate') {
        submission.details = {
          corpName: formData.get('corpName'),
          corpCsrInterest: formData.get('corpCsrInterest'),
          corpBudget: formData.get('corpBudget')
        };
      } else if (selectedType === 'academic') {
        submission.details = {
          eduName: formData.get('eduName'),
          eduType: formData.get('eduType'),
          eduActivity: formData.get('eduActivity')
        };
      }

      // Save to localStorage
      const existingInquiries = JSON.parse(localStorage.getItem('kswf_collab_inquiries') || '[]');
      existingInquiries.push(submission);
      localStorage.setItem('kswf_collab_inquiries', JSON.stringify(existingInquiries));

      // Display premium visual success state
      if (formCard) {
        formCard.style.transition = 'opacity 0.4s ease';
        formCard.style.opacity = '0';
        
        setTimeout(() => {
          formCard.innerHTML = `
            <div class="text-center p-4 fade-in-up" style="padding: 3rem 2rem;">
              <div style="font-size: 5rem; color: #4caf50; margin-bottom: 2rem; display: inline-flex; align-items: center; justify-content: center; width: 100px; height: 100px; border-radius: 50%; background: rgba(76, 175, 80, 0.1); border: 2px solid rgba(76, 175, 80, 0.2);">
                <i class="fas fa-check-circle"></i>
              </div>
              <h2 style="font-size: 2.2rem; color: var(--primary-color); margin-bottom: 1rem; font-family: var(--font-heading);">Inquiry Submitted!</h2>
              <p class="font-sans text-muted" style="font-size: 1.1rem; line-height: 1.8; max-width: 500px; margin: 0 auto 2.5rem;">
                Thank you, <strong>${submission.name}</strong>, for reaching out. We have logged your partnership inquiry under <strong>${submission.collabType.toUpperCase()}</strong> collaboration. Our core committee will review your proposal and get in touch within 2-3 business days.
              </p>
              <div class="flex justify-center gap-1">
                <a href="index.html" class="btn" style="padding: 0.8rem 2rem;">Return Home</a>
                <button onclick="window.location.reload();" class="btn btn-accent" style="padding: 0.8rem 2rem;">New Inquiry</button>
              </div>
            </div>
          `;
          formCard.style.opacity = '1';
        }, 400);
      }
    });
  }
});
