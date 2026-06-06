document.addEventListener('DOMContentLoaded', () => {
  // --- UTILS ---
  const handleImageInput = (fileInput, urlInput) => {
    return new Promise((resolve) => {
      if (urlInput.value.trim()) {
        resolve(urlInput.value.trim());
      } else if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(fileInput.files[0]);
      } else {
        resolve(''); // No image
      }
    });
  };

  const clearForm = (formId) => {
    document.getElementById(formId).reset();
    let idInput;
    if (formId === 'form-highlight') idInput = document.getElementById('hl-id');
    else if (formId === 'form-post') idInput = document.getElementById('pt-id');
    else if (formId === 'form-spotlight') idInput = document.getElementById('sl-id');
    if (idInput) idInput.value = '';
  };

  // ==========================================
  // HIGHLIGHTS MANAGEMENT
  // ==========================================
  const renderHighlightsTable = async () => {
    const highlights = await ImpactData.getHighlights();
    const container = document.getElementById('highlights-table-container');
    
    if (highlights.length === 0) {
      container.innerHTML = '<p class="text-muted">No highlights found.</p>';
      return;
    }

    let html = '<table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 2rem;">';
    html += '<thead><tr style="border-bottom: 2px solid #eee;"><th>Image</th><th>Title</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    
    highlights.forEach(h => {
      html += `<tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0;"><img src="${h.coverImage || 'images/placeholder.jpg'}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;"></td>
        <td style="padding: 10px 0;"><strong>${h.title}</strong><br><small class="text-muted">${h.category || ''}</small></td>
        <td style="padding: 10px 0;"><span class="badge" style="background: ${h.status === 'Published' ? '#e8f5e9' : '#ffebee'}; color: ${h.status === 'Published' ? '#2e7d32' : '#c62828'};">${h.status}</span></td>
        <td style="padding: 10px 0;">
          <button class="btn btn-edit-hl" data-id="${h.id}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; margin-right: 5px;">Edit</button>
          <button class="btn btn-del-hl" data-id="${h.id}" style="background: #e53935; padding: 0.3rem 0.6rem; font-size: 0.8rem;">Delete</button>
        </td>
      </tr>`;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;

    // Bind Edit/Delete
    document.querySelectorAll('.btn-edit-hl').forEach(btn => btn.addEventListener('click', (e) => editHighlight(e.target.getAttribute('data-id'))));
    document.querySelectorAll('.btn-del-hl').forEach(btn => btn.addEventListener('click', (e) => deleteHighlight(e.target.getAttribute('data-id'))));
  };

  const editHighlight = async (id) => {
    const highlights = await ImpactData.getHighlights();
    const h = highlights.find(x => x.id === id);
    if (!h) return;

    document.getElementById('hl-id').value = h.id;
    document.getElementById('hl-title').value = h.title || '';
    document.getElementById('hl-category').value = h.category || '';
    document.getElementById('hl-date').value = h.date || '';
    document.getElementById('hl-location').value = h.location || '';
    document.getElementById('hl-impact').value = h.impactText || '';
    document.getElementById('hl-desc').value = h.fullDescription || '';
    document.getElementById('hl-status').value = h.status || 'Published';
    document.getElementById('hl-image-url').value = h.coverImage && h.coverImage.startsWith('http') ? h.coverImage : '';
    
    document.getElementById('highlight-form-title').textContent = 'Edit Highlight';
    document.getElementById('form-highlight').style.display = 'block';
  };

  const deleteHighlight = async (id) => {
    if (confirm('Are you sure you want to delete this highlight?')) {
      await ImpactData.deleteHighlight(id);
      renderHighlightsTable();
    }
  };

  document.getElementById('btn-add-highlight').addEventListener('click', () => {
    clearForm('form-highlight');
    document.getElementById('highlight-form-title').textContent = 'Add New Highlight';
    document.getElementById('form-highlight').style.display = 'block';
  });

  document.getElementById('btn-cancel-highlight').addEventListener('click', () => {
    document.getElementById('form-highlight').style.display = 'none';
  });

  document.getElementById('form-highlight').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Saving...';
    btn.disabled = true;

    const id = document.getElementById('hl-id').value;
    const imgStr = await handleImageInput(document.getElementById('hl-image-file'), document.getElementById('hl-image-url'));
    
    const highlight = {
      id: id || ImpactData.generateId(),
      title: document.getElementById('hl-title').value,
      category: document.getElementById('hl-category').value,
      date: document.getElementById('hl-date').value,
      location: document.getElementById('hl-location').value,
      impactText: document.getElementById('hl-impact').value,
      fullDescription: document.getElementById('hl-desc').value,
      status: document.getElementById('hl-status').value,
      updatedAt: new Date().toISOString()
    };

    if (imgStr) {
      highlight.coverImage = imgStr;
    } else if (id) {
      const highlights = await ImpactData.getHighlights();
      const existing = highlights.find(x => x.id === id);
      if (existing) {
        if (existing.coverImage) highlight.coverImage = existing.coverImage;
        if (existing.order !== undefined) highlight.order = existing.order;
      }
    }
    if (!id) highlight.createdAt = new Date().toISOString();


    await ImpactData.saveHighlights([highlight]);
    
    btn.textContent = 'Save Highlight';
    btn.disabled = false;
    document.getElementById('form-highlight').style.display = 'none';
    renderHighlightsTable();
    alert('Highlight saved successfully!');
  });


  // ==========================================
  // POSTS MANAGEMENT
  // ==========================================
  const renderPostsTable = async () => {
    const posts = await ImpactData.getPosts();
    const container = document.getElementById('posts-table-container');
    
    if (posts.length === 0) {
      container.innerHTML = '<p class="text-muted">No posts found.</p>';
      return;
    }

    let html = '<table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 2rem;">';
    html += '<thead><tr style="border-bottom: 2px solid #eee;"><th>Image</th><th>Title</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead><tbody>';
    
    posts.forEach(p => {
      html += `<tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0;"><img src="${p.image || 'images/placeholder.jpg'}" style="width: 80px; height: 50px; border-radius: 4px; object-fit: cover;"></td>
        <td style="padding: 10px 0;"><strong>${p.title}</strong><br><small class="text-muted">${p.category || ''}</small></td>
        <td style="padding: 10px 0;"><span class="badge" style="background: ${p.status === 'Published' ? '#e8f5e9' : '#ffebee'}; color: ${p.status === 'Published' ? '#2e7d32' : '#c62828'};">${p.status}</span></td>
        <td style="padding: 10px 0;">${p.isSpotlight ? '<span class="badge badge-featured">Active</span>' : `<button class="btn btn-make-spotlight" data-id="${p.id}" style="background:#fff; color:var(--button-bg); border: 1px solid var(--button-bg); padding: 0.2rem 0.5rem; font-size: 0.75rem;">Make Featured</button>`}</td>
        <td style="padding: 10px 0;">
          <button class="btn btn-edit-pt" data-id="${p.id}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; margin-right: 5px;">Edit</button>
          <button class="btn btn-del-pt" data-id="${p.id}" style="background: #e53935; padding: 0.3rem 0.6rem; font-size: 0.8rem;">Delete</button>
        </td>
      </tr>`;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;

    // Bind Actions
    document.querySelectorAll('.btn-edit-pt').forEach(btn => btn.addEventListener('click', (e) => editPost(e.target.getAttribute('data-id'))));
    document.querySelectorAll('.btn-del-pt').forEach(btn => btn.addEventListener('click', (e) => deletePost(e.target.getAttribute('data-id'))));
    document.querySelectorAll('.btn-make-spotlight').forEach(btn => btn.addEventListener('click', (e) => makeSpotlight(e.target.getAttribute('data-id'))));
  };

  const editPost = async (id) => {
    const posts = await ImpactData.getPosts();
    const p = posts.find(x => x.id === id);
    if (!p) return;

    document.getElementById('pt-id').value = p.id;
    document.getElementById('pt-title').value = p.title || '';
    document.getElementById('pt-category').value = p.category || '';
    document.getElementById('pt-date').value = p.date || '';
    document.getElementById('pt-location').value = p.location || '';
    document.getElementById('pt-impact').value = p.impactText || '';
    document.getElementById('pt-short-desc').value = p.shortDescription || '';
    document.getElementById('pt-full-desc').value = p.fullDescription || '';
    document.getElementById('pt-status').value = p.status || 'Published';
    document.getElementById('pt-image-url').value = p.image && p.image.startsWith('http') ? p.image : '';
    
    document.getElementById('post-form-title').textContent = 'Edit Post';
    document.getElementById('form-post').style.display = 'block';
  };

  const deletePost = async (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await ImpactData.deletePost(id);
      renderPostsTable();
    }
  };

  const makeSpotlight = async (id) => {
    if (confirm('Make this post the new Featured Program?')) {
      const posts = await ImpactData.getPosts();
      const p = posts.find(x => x.id === id);
      if (!p) return;

      // Update spotlight flags in posts
      const updatedPosts = posts.map(post => ({ ...post, isSpotlight: (post.id === id) }));
      await ImpactData.savePosts(updatedPosts);

      // Create new spotlight entry
      const spotlight = {
        id: 'spotlight-' + Date.now(),
        title: p.title,
        category: p.category,
        image: p.image,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription,
        date: p.date,
        location: p.location,
        impactStat1: p.impactText || '',
        impactStat2: '',
        impactStat3: '',
        buttonText: 'View Program',
        buttonLink: '#',
        status: 'Active',
        isSpotlight: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await ImpactData.saveSpotlight(spotlight);
      
      renderPostsTable();
      renderSpotlightsTable();
      alert('Featured program updated successfully!');
    }
  };

  document.getElementById('btn-add-post').addEventListener('click', () => {
    clearForm('form-post');
    document.getElementById('post-form-title').textContent = 'Add New Post';
    document.getElementById('form-post').style.display = 'block';
  });

  document.getElementById('btn-cancel-post').addEventListener('click', () => {
    document.getElementById('form-post').style.display = 'none';
  });

  document.getElementById('form-post').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Saving...';
    btn.disabled = true;

    const id = document.getElementById('pt-id').value;
    const imgStr = await handleImageInput(document.getElementById('pt-image-file'), document.getElementById('pt-image-url'));
    
    const post = {
      id: id || ImpactData.generateId(),
      title: document.getElementById('pt-title').value,
      category: document.getElementById('pt-category').value,
      date: document.getElementById('pt-date').value,
      location: document.getElementById('pt-location').value,
      impactText: document.getElementById('pt-impact').value,
      shortDescription: document.getElementById('pt-short-desc').value,
      fullDescription: document.getElementById('pt-full-desc').value,
      status: document.getElementById('pt-status').value,
      updatedAt: new Date().toISOString()
    };

    if (imgStr) {
      post.image = imgStr;
    } else if (id) {
      const posts = await ImpactData.getPosts();
      const existing = posts.find(x => x.id === id);
      if (existing) {
        if (existing.image) post.image = existing.image;
        if (existing.isSpotlight !== undefined) post.isSpotlight = existing.isSpotlight;
      }
    }
    if (!id) {
      post.createdAt = new Date().toISOString();
      post.isSpotlight = false;
    }


    await ImpactData.savePosts([post]);
    
    btn.textContent = 'Save Post';
    btn.disabled = false;
    document.getElementById('form-post').style.display = 'none';
    renderPostsTable();
    alert('Post saved successfully!');
  });


  // ==========================================
  // FEATURED PROGRAM (SPOTLIGHT) MANAGEMENT
  // ==========================================
  const renderSpotlightsTable = async () => {
    const spotlights = await ImpactData.getSpotlights();
    const container = document.getElementById('spotlight-table-container');
    
    if (spotlights.length === 0) {
      container.innerHTML = '<p class="text-muted">No featured programs found.</p>';
      return;
    }

    let html = '<table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 2rem;">';
    html += '<thead><tr style="border-bottom: 2px solid #eee;"><th>Image</th><th>Title</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    
    spotlights.forEach(s => {
      html += `<tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0;"><img src="${s.image || 'images/placeholder.jpg'}" style="width: 80px; height: 50px; border-radius: 4px; object-fit: cover;"></td>
        <td style="padding: 10px 0;"><strong>${s.title}</strong><br><small class="text-muted">${s.category || ''}</small></td>
        <td style="padding: 10px 0;"><span class="badge" style="background: ${s.status === 'Active' ? '#e8f5e9' : '#ffebee'}; color: ${s.status === 'Active' ? '#2e7d32' : '#c62828'};">${s.status}</span></td>
        <td style="padding: 10px 0;">
          <button class="btn btn-edit-sl" data-id="${s.id}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; margin-right: 5px;">Edit</button>
          <button class="btn btn-del-sl" data-id="${s.id}" style="background: #e53935; padding: 0.3rem 0.6rem; font-size: 0.8rem;">Delete</button>
        </td>
      </tr>`;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;

    // Bind Edit/Delete
    document.querySelectorAll('.btn-edit-sl').forEach(btn => btn.addEventListener('click', (e) => editSpotlight(e.target.getAttribute('data-id'))));
    document.querySelectorAll('.btn-del-sl').forEach(btn => btn.addEventListener('click', (e) => deleteSpotlight(e.target.getAttribute('data-id'))));
  };

  const editSpotlight = async (id) => {
    const spotlights = await ImpactData.getSpotlights();
    const sl = spotlights.find(x => x.id === id);
    if (!sl) return;

    document.getElementById('sl-id').value = sl.id || '';
    document.getElementById('sl-title').value = sl.title || '';
    document.getElementById('sl-category').value = sl.category || '';
    document.getElementById('sl-date').value = sl.date || '';
    document.getElementById('sl-location').value = sl.location || '';
    document.getElementById('sl-short-desc').value = sl.shortDescription || '';
    document.getElementById('sl-full-desc').value = sl.fullDescription || '';
    document.getElementById('sl-stat1').value = sl.impactStat1 || '';
    document.getElementById('sl-stat2').value = sl.impactStat2 || '';
    document.getElementById('sl-stat3').value = sl.impactStat3 || '';
    document.getElementById('sl-btn-text').value = sl.buttonText || 'View Program';
    document.getElementById('sl-btn-link').value = sl.buttonLink || '#';
    document.getElementById('sl-status').value = sl.status || 'Active';
    document.getElementById('sl-image-url').value = sl.image && sl.image.startsWith('http') ? sl.image : '';
    
    document.getElementById('spotlight-form-title').textContent = 'Edit Featured Program';
    document.getElementById('form-spotlight').style.display = 'block';
  };

  const deleteSpotlight = async (id) => {
    if (confirm('Are you sure you want to delete this featured program?')) {
      await ImpactData.deleteSpotlight(id);
      renderSpotlightsTable();
    }
  };

  document.getElementById('btn-add-spotlight').addEventListener('click', () => {
    clearForm('form-spotlight');
    document.getElementById('spotlight-form-title').textContent = 'Add New Featured Program';
    document.getElementById('form-spotlight').style.display = 'block';
  });

  document.getElementById('btn-cancel-spotlight').addEventListener('click', () => {
    document.getElementById('form-spotlight').style.display = 'none';
  });

  document.getElementById('form-spotlight').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Saving...';
    btn.disabled = true;

    const id = document.getElementById('sl-id').value;
    const imgStr = await handleImageInput(document.getElementById('sl-image-file'), document.getElementById('sl-image-url'));
    
    const spotlight = {
      id: id || ImpactData.generateId(),
      title: document.getElementById('sl-title').value,
      category: document.getElementById('sl-category').value,
      date: document.getElementById('sl-date').value,
      location: document.getElementById('sl-location').value,
      shortDescription: document.getElementById('sl-short-desc').value,
      fullDescription: document.getElementById('sl-full-desc').value,
      impactStat1: document.getElementById('sl-stat1').value,
      impactStat2: document.getElementById('sl-stat2').value,
      impactStat3: document.getElementById('sl-stat3').value,
      buttonText: document.getElementById('sl-btn-text').value,
      buttonLink: document.getElementById('sl-btn-link').value,
      status: document.getElementById('sl-status').value,
      isSpotlight: true,
      updatedAt: new Date().toISOString()
    };
    
    if (imgStr) {
      spotlight.image = imgStr;
    } else if (id) {
      const spotlights = await ImpactData.getSpotlights();
      const existing = spotlights.find(x => x.id === id);
      if (existing) {
        if (existing.image) spotlight.image = existing.image;
      }
    }
    if (!id) {
      spotlight.createdAt = new Date().toISOString();
    }

    await ImpactData.saveSpotlight(spotlight);
    
    btn.textContent = 'Save Featured Program';
    btn.disabled = false;
    document.getElementById('form-spotlight').style.display = 'none';
    renderSpotlightsTable();
    alert('Featured program details saved successfully!');
  });

  // --- INIT RENDERING ---
  renderHighlightsTable();
  renderPostsTable();
  renderSpotlightsTable();
});
