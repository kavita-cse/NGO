document.addEventListener('DOMContentLoaded', () => {
  const tabCollabsBtn = document.getElementById('tab-collabs');
  const tabVolunteersBtn = document.getElementById('tab-volunteers');
  const inquiriesContainer = document.getElementById('inquiries-table-container');

  // --- SEED MOCK DATA IF EMPTY ---
  const seedMockData = () => {
    if (!localStorage.getItem('kswf_collab_inquiries')) {
      const mockCollabs = [
        {
          id: 'collab_seed_1',
          name: 'Aarav Sharma',
          email: 'aarav@greenearthngo.org',
          phone: '8178227027',
          collabType: 'ngo',
          message: 'We want to co-host a major plantation drive next month in New Delhi and share regional volunteers.',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Pending',
          details: {
            orgName: 'Green Earth Foundation',
            orgFocus: 'Environment',
            orgReg: 'NGO-2024-9981',
            collabObjective: 'Planting 1000 native trees in urban sectors.'
          }
        },
        {
          id: 'collab_seed_2',
          name: 'Priya Verma',
          email: 'priya.v@creators.com',
          phone: '9988776655',
          collabType: 'creator',
          message: 'I would love to make a short video feature about your sanitation campaigns and share it with my 50k Instagram audience.',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Pending',
          details: {
            creatorPlatform: 'Instagram',
            creatorLink: '@priya_eco_stories',
            creatorReach: '10k - 100k followers'
          }
        },
        {
          id: 'collab_seed_3',
          name: 'Rohan Gupta',
          email: 'r.gupta@techcorp.in',
          phone: '7766554433',
          collabType: 'corporate',
          message: 'Interested in sponsoring your next 3 civic sense workshops under our CSR initiative.',
          date: new Date().toISOString(),
          status: 'Pending',
          details: {
            corpName: 'TechCorp Solutions',
            corpCsrInterest: 'Civic Sense & Community',
            corpBudget: '> ₹2,00,000'
          }
        }
      ];
      localStorage.setItem('kswf_collab_inquiries', JSON.stringify(mockCollabs));
    }

    if (!localStorage.getItem('kswf_volunteer_applications')) {
      const mockVolunteers = [
        {
          id: 'vol_seed_1',
          name: 'Karan Malhotra',
          email: 'karan.m@gmail.com',
          phone: '9876543210',
          role: 'intern',
          message: 'Seeking a 3-month summer social work internship for my college credits. Available full time.',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Pending'
        },
        {
          id: 'vol_seed_2',
          name: 'Ananya Sen',
          email: 'ananya.sen@outlook.com',
          phone: '8811223344',
          role: 'skills',
          message: 'I am a graphic designer and UI creator and would love to help you build brochures or posters pro-bono.',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Pending'
        }
      ];
      localStorage.setItem('kswf_volunteer_applications', JSON.stringify(mockVolunteers));
    }
  };

  seedMockData();

  let activeTab = 'collabs'; // 'collabs' or 'volunteers'

  // Format Helper for Date
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render Table content
  const renderInquiries = () => {
    if (!inquiriesContainer) return;

    if (activeTab === 'collabs') {
      const collabs = JSON.parse(localStorage.getItem('kswf_collab_inquiries') || '[]');
      
      if (collabs.length === 0) {
        inquiriesContainer.innerHTML = '<p class="text-muted font-sans" style="padding: 2rem 0; text-align: center;">No partnership requests found.</p>';
        return;
      }

      let html = `
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-family: var(--font-sans);">
          <thead>
            <tr style="border-bottom: 2px solid #eee; font-size: 0.95rem; color: var(--text-primary);">
              <th style="padding: 12px 10px;">Date</th>
              <th style="padding: 12px 10px;">Contact Details</th>
              <th style="padding: 12px 10px;">Partner Type</th>
              <th style="padding: 12px 10px;">Status</th>
              <th style="padding: 12px 10px; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
      `;

      collabs.forEach((c) => {
        const typeLabels = {
          ngo: 'NGO & Grassroots',
          creator: 'Creator & Influencer',
          corporate: 'Corporate CSR',
          academic: 'Academic Inst.'
        };
        const typeColors = {
          ngo: '#e53935',
          creator: '#ff9800',
          corporate: '#4caf50',
          academic: '#1b5e20'
        };

        const typeLabel = typeLabels[c.collabType] || c.collabType;
        const typeColor = typeColors[c.collabType] || '#1b5e20';

        html += `
          <tr style="border-bottom: 1px solid #eee; font-size: 0.9rem;" class="inquiry-row">
            <td style="padding: 15px 10px; vertical-align: top; color: var(--text-muted);">${formatDate(c.date)}</td>
            <td style="padding: 15px 10px; vertical-align: top;">
              <strong>${c.name}</strong><br>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${c.email} | ${c.phone}</span>
            </td>
            <td style="padding: 15px 10px; vertical-align: top;">
              <span class="badge" style="background: rgba(${parseInt(typeColor.substring(1,3),16)}, ${parseInt(typeColor.substring(3,5),16)}, ${parseInt(typeColor.substring(5,7),16)}, 0.1); color: ${typeColor}; padding: 0.3rem 0.8rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700;">
                ${typeLabel.toUpperCase()}
              </span>
            </td>
            <td style="padding: 15px 10px; vertical-align: top;">
              <span class="badge" style="background: #e8f5e9; color: #2e7d32; padding: 0.3rem 0.8rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700;">
                ${c.status}
              </span>
            </td>
            <td style="padding: 15px 10px; text-align: right; vertical-align: top;">
              <button class="btn btn-detail-toggle" data-id="${c.id}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; margin-right: 5px; background: #faf9f6; border: 1px solid #ddd; color: var(--text-primary); box-shadow: none;">Details</button>
              <button class="btn btn-delete-collab" data-id="${c.id}" style="background: #e53935; padding: 0.3rem 0.6rem; font-size: 0.8rem; box-shadow: none;">Delete</button>
            </td>
          </tr>
          <tr id="details-${c.id}" style="display: none; background: #faf9f6; border-bottom: 1px solid #ddd;">
            <td colspan="5" style="padding: 20px; font-size: 0.9rem;">
              <div style="background: white; border: 1px solid rgba(0,0,0,0.05); padding: 1.5rem; border-radius: var(--radius-sm); border-left: 4px solid ${typeColor};">
                <h4 style="margin-bottom: 0.8rem; color: var(--primary-color);">Dynamic Profile Properties:</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.2rem; font-family: var(--font-sans);">
                  ${Object.entries(c.details || {}).map(([key, val]) => {
                    const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return `<div><strong>${formattedKey}:</strong> <span class="text-muted">${val || 'N/A'}</span></div>`;
                  }).join('')}
                </div>
                <h4 style="margin-bottom: 0.5rem; color: var(--primary-color);">Proposal / Cover Message:</h4>
                <p class="text-muted font-sans" style="line-height: 1.6; margin: 0; white-space: pre-line;">${c.message || 'No additional details provided.'}</p>
              </div>
            </td>
          </tr>
        `;
      });

      html += '</tbody></table>';
      inquiriesContainer.innerHTML = html;

      // Bind Listeners
      document.querySelectorAll('.btn-detail-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          const detailsRow = document.getElementById(`details-${id}`);
          if (detailsRow) {
            const isVisible = detailsRow.style.display === 'table-row';
            detailsRow.style.display = isVisible ? 'none' : 'table-row';
            e.target.textContent = isVisible ? 'Details' : 'Collapse';
            e.target.style.background = isVisible ? '#faf9f6' : '#eee';
          }
        });
      });

      document.querySelectorAll('.btn-delete-collab').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          if (confirm('Are you sure you want to remove this partnership inquiry?')) {
            let existing = JSON.parse(localStorage.getItem('kswf_collab_inquiries') || '[]');
            existing = existing.filter(item => item.id !== id);
            localStorage.setItem('kswf_collab_inquiries', JSON.stringify(existing));
            renderInquiries();
          }
        });
      });

    } else {
      // Volunteer Applications
      const volunteers = JSON.parse(localStorage.getItem('kswf_volunteer_applications') || '[]');
      
      if (volunteers.length === 0) {
        inquiriesContainer.innerHTML = '<p class="text-muted font-sans" style="padding: 2rem 0; text-align: center;">No volunteer applications found.</p>';
        return;
      }

      let html = `
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-family: var(--font-sans);">
          <thead>
            <tr style="border-bottom: 2px solid #eee; font-size: 0.95rem; color: var(--text-primary);">
              <th style="padding: 12px 10px;">Date</th>
              <th style="padding: 12px 10px;">Contact Details</th>
              <th style="padding: 12px 10px;">Applying For</th>
              <th style="padding: 12px 10px;">Status</th>
              <th style="padding: 12px 10px; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
      `;

      volunteers.forEach((v) => {
        const roleLabels = {
          volunteer: 'General Volunteer',
          intern: 'Internship',
          community: 'Community Ambassador',
          skills: 'Pro-bono Skills'
        };
        const roleColors = {
          volunteer: '#e53935',
          intern: '#4caf50',
          community: '#ff9800',
          skills: '#1b5e20'
        };

        const roleLabel = roleLabels[v.role] || v.role;
        const roleColor = roleColors[v.role] || '#1b5e20';

        html += `
          <tr style="border-bottom: 1px solid #eee; font-size: 0.9rem;" class="inquiry-row">
            <td style="padding: 15px 10px; vertical-align: top; color: var(--text-muted);">${formatDate(v.date)}</td>
            <td style="padding: 15px 10px; vertical-align: top;">
              <strong>${v.name}</strong><br>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${v.email} | ${v.phone}</span>
            </td>
            <td style="padding: 15px 10px; vertical-align: top;">
              <span class="badge" style="background: rgba(${parseInt(roleColor.substring(1,3),16)}, ${parseInt(roleColor.substring(3,5),16)}, ${parseInt(roleColor.substring(5,7),16)}, 0.1); color: ${roleColor}; padding: 0.3rem 0.8rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700;">
                ${roleLabel.toUpperCase()}
              </span>
            </td>
            <td style="padding: 15px 10px; vertical-align: top;">
              <span class="badge" style="background: #e8f5e9; color: #2e7d32; padding: 0.3rem 0.8rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700;">
                ${v.status}
              </span>
            </td>
            <td style="padding: 15px 10px; text-align: right; vertical-align: top;">
              <button class="btn btn-detail-toggle" data-id="${v.id}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; margin-right: 5px; background: #faf9f6; border: 1px solid #ddd; color: var(--text-primary); box-shadow: none;">Details</button>
              <button class="btn btn-delete-vol" data-id="${v.id}" style="background: #e53935; padding: 0.3rem 0.6rem; font-size: 0.8rem; box-shadow: none;">Delete</button>
            </td>
          </tr>
          <tr id="details-${v.id}" style="display: none; background: #faf9f6; border-bottom: 1px solid #ddd;">
            <td colspan="5" style="padding: 20px; font-size: 0.9rem;">
              <div style="background: white; border: 1px solid rgba(0,0,0,0.05); padding: 1.5rem; border-radius: var(--radius-sm); border-left: 4px solid ${roleColor}; font-family: var(--font-sans);">
                <h4 style="margin-bottom: 0.5rem; color: var(--primary-color);">Cover / Statement of Purpose:</h4>
                <p class="text-muted" style="line-height: 1.6; margin: 0; white-space: pre-line;">${v.message || 'No statements provided.'}</p>
              </div>
            </td>
          </tr>
        `;
      });

      html += '</tbody></table>';
      inquiriesContainer.innerHTML = html;

      // Bind Listeners
      document.querySelectorAll('.btn-detail-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          const detailsRow = document.getElementById(`details-${id}`);
          if (detailsRow) {
            const isVisible = detailsRow.style.display === 'table-row';
            detailsRow.style.display = isVisible ? 'none' : 'table-row';
            e.target.textContent = isVisible ? 'Details' : 'Collapse';
            e.target.style.background = isVisible ? '#faf9f6' : '#eee';
          }
        });
      });

      document.querySelectorAll('.btn-delete-vol').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this volunteer application?')) {
            let existing = JSON.parse(localStorage.getItem('kswf_volunteer_applications') || '[]');
            existing = existing.filter(item => item.id !== id);
            localStorage.setItem('kswf_volunteer_applications', JSON.stringify(existing));
            renderInquiries();
          }
        });
      });
    }
  };

  // Switch Sub-tabs
  if (tabCollabsBtn && tabVolunteersBtn) {
    tabCollabsBtn.addEventListener('click', () => {
      activeTab = 'collabs';
      tabCollabsBtn.classList.add('active');
      tabVolunteersBtn.classList.remove('active');
      renderInquiries();
    });

    tabVolunteersBtn.addEventListener('click', () => {
      activeTab = 'volunteers';
      tabVolunteersBtn.classList.add('active');
      tabCollabsBtn.classList.remove('active');
      renderInquiries();
    });
  }

  // Initial Rendering
  renderInquiries();

  // Watch for page transitions to re-render in case they navigated away and back
  const inquiriesNav = document.getElementById('nav-inquiries');
  if (inquiriesNav) {
    inquiriesNav.addEventListener('click', () => {
      renderInquiries();
    });
  }
});
