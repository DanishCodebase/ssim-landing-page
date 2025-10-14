

// Add CSS for ripple effect
const style = document.createElement("style");
style.textContent = `
        .course-card {
          position: relative;
          overflow: hidden;
        }
        
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.1);
          transform: scale(0);
          animation: ripple-animation 0.6s linear;
          pointer-events: none;
        }
        
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
document.head.appendChild(style);

// Auto-slider for International Collaborations Section
document.addEventListener("DOMContentLoaded", function () {
  const sliderContainer = document.querySelector(".international-section");
  if (!sliderContainer) return;

  const slider = sliderContainer.querySelector(".process-steps");
  const items = slider.querySelectorAll(".step-card");
  if (items.length === 0) return;

  // Create and inject controls
  const controlsHtml = `
    <div class="slider-controls">
      <div class="slider-indicators"></div>
    </div>
  `;
  slider.insertAdjacentHTML('afterend', controlsHtml);
  const indicatorsContainer = sliderContainer.querySelector(".slider-indicators");

  let itemsPerPage = getItemsPerPage();
  let totalPages = Math.ceil(items.length / itemsPerPage);
  let currentPage = 0;
  let scrollInterval;

  function getItemsPerPage() {
    if (window.innerWidth <= 576) return 1;
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 1200) return 3;
    return 4;
  }

  function setupSlider() {
    itemsPerPage = getItemsPerPage();
    totalPages = Math.ceil(items.length / itemsPerPage);
    if (currentPage >= totalPages) {
      currentPage = totalPages - 1;
    }
    setupIndicators();
    goToPage(currentPage, 'auto');
  }

  function setupIndicators() {
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const button = document.createElement('button');
      button.classList.add('indicator');
      button.setAttribute('aria-label', `Go to slide ${i + 1}`);
      button.addEventListener('click', () => {
        goToPage(i);
        stopAutoScroll();
        startAutoScroll(); // Reset interval on manual navigation
      });
      indicatorsContainer.appendChild(button);
    }
    updateIndicators();
  }

  function updateIndicators() {
    const indicators = indicatorsContainer.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentPage);
    });
  }

  function goToPage(pageNumber, behavior = 'smooth') {
    currentPage = pageNumber;
    const cardWidth = items[0].offsetWidth;
    const gap = parseInt(window.getComputedStyle(slider).gap, 10) || 0;
    const scrollAmount = currentPage * (cardWidth * itemsPerPage + gap * itemsPerPage);
    
    // A more precise scroll calculation
    let totalWidth = 0;
    for(let i=0; i < currentPage * itemsPerPage; i++){
        totalWidth += items[i].offsetWidth + gap;
    }

    slider.scrollTo({
      left: totalWidth,
      behavior: behavior
    });

    updateIndicators();
  }

  function startAutoScroll() {
    stopAutoScroll();
    scrollInterval = setInterval(() => {
      let nextPage = (currentPage + 1) % totalPages;
      goToPage(nextPage);
    }, 3000);
  }

  function stopAutoScroll() {
    clearInterval(scrollInterval);
  }

  // Event Listeners
  slider.addEventListener('mouseenter', stopAutoScroll);
  slider.addEventListener('mouseleave', startAutoScroll);
  
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setupSlider, 250);
  });

  // Initial setup
  setupSlider();
  startAutoScroll();
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("video-modal");
    const modalIframe = document.getElementById("youtube-video-iframe");
    const closeModalBtn = document.querySelector(".close-modal-btn");

    function setupVideoSlider(containerSelector) {
        const sliderContainer = document.querySelector(containerSelector);
        if (!sliderContainer) return;

        const slider = sliderContainer.querySelector(".student-slider");
        const indicatorsContainer = sliderContainer.querySelector(".slider-indicators");
        const prevBtn = sliderContainer.querySelector(".prev-btn");
        const nextBtn = sliderContainer.querySelector(".next-btn");

        if (!slider) return;

        const slides = slider.querySelectorAll(".student-video-card");
        let currentIndex = 0;
        let itemsPerSlide = getItemsPerSlide();
        let totalPositions = slides.length > itemsPerSlide ? slides.length - itemsPerSlide + 1 : 1;
        let autoSlideInterval;

        function getItemsPerSlide() {
            if (window.innerWidth >= 1024) return 4;
            if (window.innerWidth >= 768) return 3;
            if (window.innerWidth >= 500) return 2;
            return 1;
        }

        function updateSlider() {
            itemsPerSlide = getItemsPerSlide();
            totalPositions = slides.length > itemsPerSlide ? slides.length - itemsPerSlide + 1 : 1;

            slides.forEach(slide => {
                slide.style.flex = `0 0 ${100 / itemsPerSlide}%`;
            });

            if (currentIndex >= totalPositions) {
                currentIndex = totalPositions - 1;
            }

            goToSlide(currentIndex);
        }

        function createIndicators() {
            indicatorsContainer.innerHTML = "";
            for (let i = 0; i < totalPositions; i++) {
                const indicator = document.createElement("div");
                indicator.classList.add("indicator");
                indicator.addEventListener("click", () => {
                    goToSlide(i);
                });
                indicatorsContainer.appendChild(indicator);
            }
            updateIndicators();
        }

        function updateIndicators() {
            const indicators = indicatorsContainer.querySelectorAll(".indicator");
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle("active", index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            const singleSlideWidthPercentage = 100 / itemsPerSlide;
            slider.style.transform = `translateX(-${currentIndex * singleSlideWidthPercentage}%)`;
            updateIndicators();
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(() => {
                let nextIndex = currentIndex + 1;
                if (nextIndex >= totalPositions) {
                    nextIndex = 0;
                }
                goToSlide(nextIndex);
            }, 5000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        prevBtn.addEventListener("click", () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = totalPositions - 1;
            }
            goToSlide(prevIndex);
        });

        nextBtn.addEventListener("click", () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= totalPositions) {
                nextIndex = 0;
            }
            goToSlide(nextIndex);
        });

        slider.addEventListener("mouseenter", stopAutoSlide);
        slider.addEventListener("mouseleave", startAutoSlide);

        slides.forEach(slide => {
            slide.addEventListener("click", () => {
                const videoId = slide.dataset.videoId;
                modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                modal.style.display = "flex";
            });
        });
        
        window.addEventListener("resize", () => {
            let timeout;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const newItemsPerSlide = getItemsPerSlide();
                if (itemsPerSlide !== newItemsPerSlide) {
                    currentIndex = 0;
                    updateSlider();
                    createIndicators();
                }
            }, 200);
        });

        updateSlider();
        createIndicators();
        startAutoSlide();
    }

    // Initialize sliders
    setupVideoSlider(".student-speak-section:not(.alumni-speak-section)");
    setupVideoSlider(".alumni-speak-section");

    // General modal closing logic
    if (modal) {
        closeModalBtn.addEventListener("click", () => {
            modal.style.display = "none";
            modalIframe.src = "";
        });

        window.addEventListener("click", (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
                modalIframe.src = "";
            }
        });
    }

    // Smooth scroll for Apply Now button
    const applyBtn = document.querySelector(".fixed-apply-btn");
    if (applyBtn) {
        applyBtn.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });

        // Show/hide button on scroll
        const heroSection = document.getElementById("hero-banner");
        window.addEventListener("scroll", () => {
            const heroSectionBottom = heroSection.getBoundingClientRect().bottom;
            if (heroSectionBottom < 0) {
                applyBtn.classList.add("show");
            } else {
                applyBtn.classList.remove("show");
            }
        });
    }
});