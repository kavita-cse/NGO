document.addEventListener('DOMContentLoaded', async () => {
  // Fetch data from database using ImpactData layer
  const allHighlights = await ImpactData.getHighlights();
  const allPosts = await ImpactData.getPosts();
  const rawSpotlights = await ImpactData.getSpotlights();

  // Filter only 'Published'/'Active' items for public view
  const highlights = allHighlights.filter(h => h.status === 'Published');
  const posts = allPosts.filter(p => p.status === 'Published' && !p.isSpotlight);
  const spotlights = rawSpotlights.filter(s => s.status === 'Active');

  // --- RENDER HIGHLIGHTS ---
  const highlightsContainer = document.getElementById('dynamic-highlights-container');
  if (highlightsContainer) {
    if (highlights.length === 0) {
      highlightsContainer.innerHTML = '<p class="text-center w-full" style="color: var(--text-muted);">No highlights available at the moment.</p>';
    } else {
      let html = '';
      highlights.forEach(h => {
        html += `
          <div class="highlight-item" data-id="${h.id}">
            <div class="highlight-img-wrapper">
              <img src="${h.coverImage || 'images/placeholder.jpg'}" alt="${h.title}">
            </div>
            <div class="highlight-title">${h.title}</div>
          </div>
        `;
      });
      highlightsContainer.innerHTML = html;
    }
  }

  // --- RENDER SPOTLIGHT ---
  const spotlightContainer = document.getElementById('dynamic-spotlight-container');
  if (spotlightContainer) {
    if (spotlights.length === 0) {
      spotlightContainer.innerHTML = '<p class="text-center w-full" style="color: var(--text-muted);">No active featured program right now.</p>';
    } else if (spotlights.length === 1) {
      const spotlight = spotlights[0];
      spotlightContainer.innerHTML = `
        <div class="spotlight-card glass">
          <div class="spotlight-img">
            <img src="${spotlight.image || 'images/placeholder.jpg'}" alt="${spotlight.title}">
          </div>
          <div class="spotlight-content">
            <span class="badge badge-featured">Upcoming Program</span>
            <h3 style="font-size: 2.5rem; margin-bottom: 1rem;">${spotlight.title}</h3>
            <p style="font-size: 1.15rem; color: var(--text-muted); margin-bottom: 0;">${spotlight.shortDescription || ''}</p>
          </div>
        </div>
      `;
    } else {
      // Build slider HTML
      let html = '<div class="featured-slider" id="featured-slider">';
      html += '<div class="featured-slider-wrapper">';
      
      spotlights.forEach((spotlight, index) => {
        html += `
          <div class="featured-slide ${index === 0 ? 'active' : ''}">
            <div class="spotlight-card glass">
              <div class="spotlight-img">
                <img src="${spotlight.image || 'images/placeholder.jpg'}" alt="${spotlight.title}">
              </div>
              <div class="spotlight-content">
                <span class="badge badge-featured">Upcoming Program</span>
                <h3 style="font-size: 2.5rem; margin-bottom: 1rem;">${spotlight.title}</h3>
                <p style="font-size: 1.15rem; color: var(--text-muted); margin-bottom: 0;">${spotlight.shortDescription || ''}</p>
              </div>
            </div>
          </div>
        `;
      });
      
      html += '</div>'; // End wrapper
      // Controls
      html += '<button class="slider-control prev" id="featured-prev" aria-label="Previous Slide"><i class="fas fa-chevron-left"></i></button>';
      html += '<button class="slider-control next" id="featured-next" aria-label="Next Slide"><i class="fas fa-chevron-right"></i></button>';
      // Dots
      html += '<div class="slider-dots" id="featured-dots"></div>';
      html += '</div>'; // End slider container
      
      spotlightContainer.innerHTML = html;

      // Initialize Slider Scripting
      const slides = spotlightContainer.querySelectorAll('.featured-slide');
      const dotsContainer = spotlightContainer.querySelector('#featured-dots');
      const prevBtn = spotlightContainer.querySelector('#featured-prev');
      const nextBtn = spotlightContainer.querySelector('#featured-next');
      
      let currentSlide = 0;
      let dotElements = [];
      let autoPlayInterval;

      // Render dots
      slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
        dotElements.push(dot);
      });

      const goToSlide = (index) => {
        slides[currentSlide].classList.remove('active');
        dotElements[currentSlide].classList.remove('active');
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        dotElements[currentSlide].classList.add('active');
        
        resetAutoPlay();
      };

      const nextSlide = () => goToSlide(currentSlide + 1);
      const prevSlide = () => goToSlide(currentSlide - 1);

      const startAutoPlay = () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
      };

      const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
      };

      prevBtn?.addEventListener('click', prevSlide);
      nextBtn?.addEventListener('click', nextSlide);

      startAutoPlay();
    }
  }

  // --- RENDER POSTS ---
  const postsContainer = document.getElementById('dynamic-posts-container');
  const filtersContainer = document.getElementById('post-filters');
  
  if (postsContainer) {
    if (posts.length === 0) {
      postsContainer.innerHTML = '<p class="text-center w-full" style="grid-column: 1 / -1; color: var(--text-muted);">No work updates available at the moment.</p>';
      if (filtersContainer) filtersContainer.style.display = 'none';
    } else {
      if (filtersContainer) filtersContainer.style.display = 'flex';
      let html = '';
      posts.forEach(p => {
        html += `
          <div class="post-card" data-category="${p.category || 'Other'}">
            <div class="post-img-container">
              <span class="post-badge">${p.category || 'Update'}</span>
              <img src="${p.image || 'images/placeholder.jpg'}" alt="${p.title}">
            </div>
            <div class="post-content">
              <div class="post-meta">
                <span><i class="far fa-calendar-alt"></i> ${p.date || ''}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${p.location || ''}</span>
              </div>
              <h3 class="post-title">${p.title}</h3>
              <p class="post-desc">${p.shortDescription || ''}</p>
              <div class="post-footer">
                <div class="post-impact"><i class="fas fa-chart-line" style="margin-right: 5px;"></i> ${p.impactText || 'Impact Info'}</div>
                <button class="btn-text btn-read-more" data-id="${p.id}">Read Story &rarr;</button>
              </div>
            </div>
          </div>
        `;
      });
      postsContainer.innerHTML = html;
    }
  }

  // ==========================================
  // INTERACTIONS (MODALS & FILTERS)
  // ==========================================

  // Filter Pills Logic
  const filterPills = document.querySelectorAll(".filter-pill");
  const postCards = document.querySelectorAll(".post-card");

  if (filterPills.length > 0 && postCards.length > 0) {
    filterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        filterPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        const filterValue = pill.getAttribute("data-filter");
        postCards.forEach((card) => {
          if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
            card.style.display = "flex";
            card.style.opacity = "0";
            setTimeout(() => { card.style.opacity = "1"; }, 50);
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // Modal Logic
  const modalOverlay = document.getElementById("impact-modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalDate = document.getElementById("modal-date");
  const modalLocation = document.getElementById("modal-location");
  const modalDesc = document.getElementById("modal-desc");
  const modalImpact = document.getElementById("modal-impact");

  const openModal = (data) => {
    if (!modalOverlay || !data) return;
    modalImg.src = data.img || data.coverImage || data.image || 'images/placeholder.jpg';
    modalTitle.textContent = data.title || '';
    modalDate.textContent = data.date || '';
    modalLocation.textContent = data.location || '';
    modalDesc.textContent = data.fullDescription || '';
    modalImpact.textContent = data.impactText || 'View Impact';
    
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  // Bind clicks for Highlight items
  document.querySelectorAll(".highlight-item").forEach(item => {
    item.addEventListener("click", () => {
      const id = item.getAttribute("data-id");
      const h = highlights.find(x => x.id === id);
      if (h) openModal(h);
    });
  });

  // Bind clicks for Read Story buttons in Posts
  document.querySelectorAll(".btn-read-more").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const p = posts.find(x => x.id === id);
      if (p) openModal(p);
    });
  });

  // Close Modal Logic
  if (modalOverlay) {
    const closeModal = () => {
      modalOverlay.classList.remove("active");
      document.body.style.overflow = "auto";
    };

    const closeBtn = document.getElementById("close-modal");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
        closeModal();
      }
    });
  }
});
