document.addEventListener('DOMContentLoaded', () => {
  let _cachedSlides = [];
  let _isFallback = false;

  const showStatus = (msg, type = 'success') => {
    let el = document.getElementById('slider-status-msg');
    if (!el) {
      el = document.createElement('div');
      el.id = 'slider-status-msg';
      el.style.cssText = 'padding:0.9rem 1.2rem; border-radius:8px; margin-bottom:1.5rem; font-family:var(--font-sans); font-size:0.95rem; font-weight:600;';
      const container = document.getElementById('section-hero-slider');
      if (container) container.insertBefore(el, container.children[1]);
    }
    el.textContent = msg;
    el.style.background  = type === 'success' ? '#e8f5e9' : '#ffebee';
    el.style.color       = type === 'success' ? '#2e7d32' : '#c62828';
    el.style.display     = 'block';
    clearTimeout(el._timer);
    el._timer = setTimeout(() => { el.style.display = 'none'; }, 5000);
  };

  const handleImageInput = (fileInput, urlInput) => {
    return new Promise((resolve) => {
      const url = urlInput.value.trim();
      if (url) {
        resolve(url);
      } else if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(fileInput.files[0]);
      } else {
        resolve('');
      }
    });
  };

  const showForm = () => { document.getElementById('form-slide').style.display = 'block'; };
  const hideForm = () => { document.getElementById('form-slide').style.display = 'none'; };

  const clearForm = () => {
    document.getElementById('slide-id').value        = '';
    document.getElementById('slide-title').value     = '';
    document.getElementById('slide-order').value     = '0';
    document.getElementById('slide-desc').value      = '';
    document.getElementById('slide-featured').value  = 'true';
    document.getElementById('slide-image-file').value = '';
    document.getElementById('slide-image-url').value = '';
    document.getElementById('slide-form-title').textContent = 'Add New Slide';
  };

  const fetchSlidesFromDB = async () => {
    try {
      const { data, error } = await window.supabaseClient
        .from('ngo_hero_slides')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('[HeroSlider] DB fetch error:', err);
      return null;
    }
  };

  window.editSlide = (id) => {
    const s = _cachedSlides.find(x => x.id === id);
    if (!s) {
      showStatus('Could not find slide data. Please refresh.', 'error');
      return;
    }

    clearForm();
    document.getElementById('slide-id').value       = s.id;
    document.getElementById('slide-title').value    = s.title || '';
    document.getElementById('slide-order').value    = s.order !== null && s.order !== undefined ? s.order : 0;
    document.getElementById('slide-desc').value     = s.description || '';
    document.getElementById('slide-featured').value = (s.isFeatured === true || s.isFeatured === 'true') ? 'true' : 'false';

    if (s.image && s.image.startsWith('http')) {
      document.getElementById('slide-image-url').value = s.image;
    } else {
      document.getElementById('slide-image-url').value = '';
    }

    document.getElementById('slide-form-title').textContent = 'Edit Slide';
    showForm();
    document.getElementById('form-slide').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.deleteSlide = async (id) => {
    const s = _cachedSlides.find(x => x.id === id);
    const name = s && s.title ? `"${s.title}"` : 'this slide';

    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    document.querySelectorAll('.btn-del-slide').forEach(b => { b.disabled = true; b.textContent = 'Deleting…'; });

    const result = await window.ImpactData.deleteHeroSlide(id);

    if (result && result.success) {
      showStatus(`Slide deleted successfully.`, 'success');
      await renderSlidesTable();
    } else {
      showStatus('Delete failed.', 'error');
      document.querySelectorAll('.btn-del-slide').forEach(b => { b.disabled = false; b.textContent = 'Delete'; });
    }
  };

  window.changeOrder = async (id, delta) => {
    const slide = _cachedSlides.find(x => x.id === id);
    if (!slide) return;
    const updated = {
      ...slide,
      order: (slide.order !== null && slide.order !== undefined ? slide.order : 0) + delta,
      updatedAt: new Date().toISOString()
    };
    const result = await window.ImpactData.saveHeroSlides([updated]);
    if (result && result.success) await renderSlidesTable();
  };

  const renderSlidesTable = async () => {
    const container = document.getElementById('slides-table-container');
    if (!container) return;
    container.innerHTML = '<p class="text-muted" style="padding:1rem 0;">Loading slides…</p>';

    const dbSlides = await fetchSlidesFromDB();
    if (dbSlides === null) {
      container.innerHTML = `<div style="padding:1rem; background:#fff3e0; color:#e65100;"><strong>Could not connect to database.</strong></div>`;
      _cachedSlides = [];
      return;
    }
    _cachedSlides = dbSlides;

    if (dbSlides.length === 0) {
      container.innerHTML = `<div style="padding:1rem; background:#f5f5f5; color:#666;">No slides found in database. <em>Click "Add Slide" to upload your first image.</em></div>`;
      return;
    }

    let html = `
      <table style="width:100%; border-collapse:collapse; text-align:left; margin-bottom:2rem;">
        <thead>
          <tr style="border-bottom:2px solid #eee;">
            <th style="padding:8px 4px;">Image</th>
            <th style="padding:8px 4px;">Caption</th>
            <th style="padding:8px 4px;">Visibility</th>
            <th style="padding:8px 4px;">Order</th>
            <th style="padding:8px 4px;">Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    dbSlides.forEach((s) => {
      const featured = s.isFeatured === true || s.isFeatured === 'true';
      html += `
        <tr style="border-bottom:1px solid #eee;" data-slide-id="${s.id}">
          <td style="padding:10px 4px;">
            <img src="${s.image || ''}" alt="slide" style="width:80px; height:50px; border-radius:4px; object-fit:cover; border:1px solid #ddd; background:#f0f0f0;">
          </td>
          <td style="padding:10px 4px; max-width:240px; word-break:break-word;">
            <strong>${s.title || '<span style="color:#999;">(No Title)</span>'}</strong><br>
            <small style="color:#666;">${s.description ? s.description.substring(0, 80) + '…' : '<em style="color:#bbb;">No description</em>'}</small>
          </td>
          <td style="padding:10px 4px;">
            <span class="badge" style="background:${featured ? '#e8f5e9' : '#f5f5f5'}; color:${featured ? '#2e7d32' : '#666'}; padding:3px 10px; border-radius:20px; font-size:0.82rem; font-weight:600;">
              ${featured ? '✓ Featured' : 'Regular'}
            </span>
          </td>
          <td style="padding:10px 4px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:700; min-width:20px; text-align:center;">${s.order !== null && s.order !== undefined ? s.order : 0}</span>
              <div style="display:flex; flex-direction:column; gap:2px;">
                <button onclick="changeOrder('${s.id}', -1)" style="padding:2px 7px; font-size:0.7rem; cursor:pointer;">▲</button>
                <button onclick="changeOrder('${s.id}', 1)" style="padding:2px 7px; font-size:0.7rem; cursor:pointer;">▼</button>
              </div>
            </div>
          </td>
          <td style="padding:10px 4px; white-space:nowrap;">
            <button class="btn btn-edit-slide" onclick="editSlide('${s.id}')" style="padding:0.3rem 0.75rem; font-size:0.82rem; margin-right:6px;">Edit</button>
            <button class="btn btn-del-slide" onclick="deleteSlide('${s.id}')" style="background:#e53935; color:white; padding:0.3rem 0.75rem; font-size:0.82rem;">Delete</button>
          </td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
  };

  const formSlide = document.getElementById('form-slide');
  if (formSlide) {
    formSlide.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = formSlide.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Saving…';
      submitBtn.disabled = true;

      const existingId = document.getElementById('slide-id').value.trim();
      const isEditing = existingId !== '';

      const imgStr = await handleImageInput(
        document.getElementById('slide-image-file'),
        document.getElementById('slide-image-url')
      );

      let finalImage = imgStr;
      if (!finalImage && isEditing) {
        const existing = _cachedSlides.find(x => x.id === existingId);
        if (existing && existing.image) finalImage = existing.image;
      }

      if (!finalImage) {
        showStatus('Please select an image file or enter an image URL.', 'error');
        submitBtn.textContent = 'Save Slide';
        submitBtn.disabled = false;
        return;
      }

      const slide = {
        id: isEditing ? existingId : window.ImpactData.generateId(),
        title: document.getElementById('slide-title').value.trim(),
        description: document.getElementById('slide-desc').value.trim(),
        order: parseInt(document.getElementById('slide-order').value, 10) || 0,
        isFeatured: document.getElementById('slide-featured').value === 'true',
        image: finalImage,
        updatedAt: new Date().toISOString()
      };

      if (!isEditing) slide.createdAt = new Date().toISOString();

      const result = await window.ImpactData.saveHeroSlides([slide]);
      submitBtn.textContent = 'Save Slide';
      submitBtn.disabled = false;

      if (result && result.success) {
        showStatus(isEditing ? 'Slide updated successfully!' : 'New slide added successfully!', 'success');
        hideForm();
        clearForm();
        await renderSlidesTable();
      } else {
        showStatus('Save failed. Check connection.', 'error');
      }
    });
  }

  document.getElementById('btn-add-slide')?.addEventListener('click', () => {
    clearForm();
    showForm();
  });
  document.getElementById('btn-cancel-slide')?.addEventListener('click', () => {
    hideForm();
    clearForm();
  });

  renderSlidesTable();
});
