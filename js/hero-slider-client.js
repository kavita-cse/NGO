document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('slider-wrapper');
  const dotsContainer = document.getElementById('slider-dots');
  if (!wrapper || !dotsContainer) return;

  let currentSlide = 0;
  let slideElements = [];
  let dotElements = [];
  let slidesData = [];
  let autoPlayInterval;

  const renderSlides = async () => {
    slidesData = await window.ImpactData.getHeroSlides();
    
    // Filter active slides only
    slidesData = slidesData.filter(s => s.isFeatured === true || s.isFeatured === 'true');
    if (slidesData.length === 0) return;

    wrapper.innerHTML = '';
    dotsContainer.innerHTML = '';

    slidesData.forEach((slide, index) => {
      // Create slide element
      const slideDiv = document.createElement('div');
      slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
      
      let overlayHtml = '';
      if (slide.title || slide.description) {
        overlayHtml = `
          <div class="slide-overlay">
            ${slide.title ? `<div class="slide-title">${slide.title}</div>` : ''}
            ${slide.description ? `<div class="slide-desc">${slide.description}</div>` : ''}
          </div>
        `;
      }
      
      slideDiv.innerHTML = `
        <img src="${slide.image}" alt="${slide.title || 'Hero Slide'}">
        ${overlayHtml}
      `;
      wrapper.appendChild(slideDiv);
      slideElements.push(slideDiv);

      // Create dot element
      const dot = document.createElement('div');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
      dotElements.push(dot);
    });

    startAutoPlay();
  };

  const goToSlide = (index) => {
    if (slideElements.length === 0) return;
    
    slideElements[currentSlide].classList.remove('active');
    dotElements[currentSlide].classList.remove('active');
    
    currentSlide = index;
    if (currentSlide >= slideElements.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slideElements.length - 1;
    
    slideElements[currentSlide].classList.add('active');
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

  document.getElementById('slider-next')?.addEventListener('click', nextSlide);
  document.getElementById('slider-prev')?.addEventListener('click', prevSlide);

  renderSlides();
});
