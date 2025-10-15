

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

    // Scholarship Section Enhancements
    initializeScholarshipSection();
    
    // Alumni Section Enhancements
    setTimeout(() => {
        initializeAlumniSlider();
    }, 200);
    
    // Additional initialization after DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                initializeAlumniSlider();
            }, 100);
        });
    }
});

// Scholarship Section Interactive Features
function initializeScholarshipSection() {
    const scholarshipTable = document.querySelector('.scholarship-table');
    const tableRows = document.querySelectorAll('.scholarship-table tbody tr');
    const academicTable = document.querySelector('.academic-table');
    const academicTableRows = document.querySelectorAll('.academic-table tbody tr');
    const criteriaBoxes = document.querySelectorAll('.criteria-box');
    
    if (!scholarshipTable || !tableRows.length) return;

    // Add smooth scroll reveal animation
    const scholarshipSection = document.querySelector('.scholarship-section');
    if (scholarshipSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(scholarshipSection);
    }

    // Clean table row interactions
    tableRows.forEach((row, index) => {
        // Add staggered animation delay
        row.style.animationDelay = `${index * 0.1}s`;
        
        // Add click interaction for mobile
        row.addEventListener('click', function() {
            // Remove active class from all rows
            tableRows.forEach(r => r.classList.remove('active'));
            // Add active class to clicked row
            this.classList.add('active');
        });
    });

    // Academic table row interactions
    if (academicTable && academicTableRows.length) {
        academicTableRows.forEach((row, index) => {
            // Add staggered animation delay
            row.style.animationDelay = `${(index + tableRows.length) * 0.1}s`;
            
            // Add click interaction for mobile
            row.addEventListener('click', function() {
                // Remove active class from all academic rows
                academicTableRows.forEach(r => r.classList.remove('active'));
                // Add active class to clicked row
                this.classList.add('active');
            });
        });
    }

    // Criteria box interactions
    criteriaBoxes.forEach(criteriaBox => {
        if (criteriaBox) {
            criteriaBox.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        }
    });

    // Add table sorting functionality (optional enhancement)
    addTableSorting();
}

// Optional: Add table sorting functionality
function addTableSorting() {
    const table = document.querySelector('.scholarship-table');
    if (!table) return;

    const headers = table.querySelectorAll('th');
    
    headers.forEach((header, index) => {
        // Only make amount columns sortable
        if (index % 2 === 1) { // Amount columns (2nd, 4th, 6th, 8th)
            header.style.cursor = 'pointer';
            header.style.userSelect = 'none';
            header.innerHTML += ' <span style="font-size: 10px;">↕</span>';
            
            header.addEventListener('click', () => {
                sortTableByColumn(table, index);
            });
        }
    });
}

function sortTableByColumn(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    const isAscending = table.getAttribute('data-sort-direction') !== 'asc';
    
    rows.sort((a, b) => {
        const aValue = parseInt(a.cells[columnIndex].textContent.replace(/,/g, ''));
        const bValue = parseInt(b.cells[columnIndex].textContent.replace(/,/g, ''));
        
        return isAscending ? aValue - bValue : bValue - aValue;
    });
    
    // Clear tbody and append sorted rows
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
    
    // Update sort direction
    table.setAttribute('data-sort-direction', isAscending ? 'asc' : 'desc');
}

// Alumni Slider Interactive Features
function initializeAlumniSlider() {
    const slider = document.querySelector('.alumni-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pagination = document.querySelector('.slider-pagination');
    
    if (!slider || !prevBtn || !nextBtn || !pagination) {
        console.error('Alumni slider elements not found:', {
            slider: !!slider,
            prevBtn: !!prevBtn,
            nextBtn: !!nextBtn,
            pagination: !!pagination
        });
        return;
    }

    const cards = slider.querySelectorAll('.alumni-card');
    const totalCards = cards.length;
    let currentSlide = 0;
    let cardsPerSlide = 4; // Default for large screens

    // Function to update cards per slide based on screen size
    function updateCardsPerSlide() {
        if (window.innerWidth <= 480) {
            cardsPerSlide = 1;
        } else if (window.innerWidth <= 768) {
            cardsPerSlide = 2;
        } else if (window.innerWidth <= 1200) {
            cardsPerSlide = 3;
        } else {
            cardsPerSlide = 4;
        }
    }

    // Function to calculate total slides
    function getTotalSlides() {
        return Math.ceil(totalCards / cardsPerSlide);
    }

    // Function to update slider position
    function updateSlider() {
        const slideWidth = 100 / cardsPerSlide;
        const translateX = -(currentSlide * slideWidth);
        slider.style.transform = `translateX(${translateX}%)`;
        
        // Debug logging
        console.log('Slider update:', {
            currentSlide,
            cardsPerSlide,
            slideWidth,
            translateX
        });
        
        // Update pagination
        updatePagination();
        
        // Update navigation buttons
        updateNavigationButtons();
    }

    // Function to update pagination dots
    function updatePagination() {
        pagination.innerHTML = '';
        const totalSlides = getTotalSlides();
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `pagination-dot ${i === currentSlide ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateSlider();
            });
            
            pagination.appendChild(dot);
        }
    }

    // Function to update navigation buttons
    function updateNavigationButtons() {
        const totalSlides = getTotalSlides();
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }

    // Navigation event listeners
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Prev button clicked, currentSlide:', currentSlide);
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const totalSlides = getTotalSlides();
        console.log('Next button clicked, currentSlide:', currentSlide, 'totalSlides:', totalSlides);
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlider();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentSlide > 0) {
            currentSlide--;
            updateSlider();
        } else if (e.key === 'ArrowRight') {
            const totalSlides = getTotalSlides();
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateSlider();
            }
        }
    });

    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    let isDragging = false;

    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    });

    slider.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });

    slider.addEventListener('touchend', (e) => {
        if (isDragging) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
            isDragging = false;
            startAutoPlay();
        }
    });

    function handleSwipe() {
        const swipeThreshold = 30;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentSlide < getTotalSlides() - 1) {
                // Swipe left - next slide
                currentSlide++;
                updateSlider();
            } else if (diff < 0 && currentSlide > 0) {
                // Swipe right - previous slide
                currentSlide--;
                updateSlider();
            }
        }
    }

    // Auto-play functionality (optional)
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            const totalSlides = getTotalSlides();
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Pause auto-play on hover
    const sliderContainer = document.querySelector('.alumni-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoPlay);
        sliderContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Initialize slider
    updateCardsPerSlide();
    updateSlider();
    startAutoPlay();
    
    // Debug logging
    console.log('Alumni slider initialized:', {
        totalCards,
        cardsPerSlide,
        totalSlides: getTotalSlides(),
        currentSlide
    });
    
    // Force initial update
    setTimeout(() => {
        updateSlider();
    }, 100);
    
    // Test function for debugging
    window.testSlider = () => {
        console.log('Testing slider...');
        currentSlide = (currentSlide + 1) % getTotalSlides();
        updateSlider();
    };

    // Update on resize
    window.addEventListener('resize', () => {
        updateCardsPerSlide();
        currentSlide = 0; // Reset to first slide
        updateSlider();
    });

    // Add entrance animation
    const alumniSection = document.querySelector('.alumni-testimonials-section');
    if (alumniSection) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        // Add staggered animation to cards
                        cards.forEach((card, index) => {
                            card.style.animationDelay = `${index * 0.1}s`;
                        });
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(alumniSection);
    }

    // Add hover effects to cards
    cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        });
    });
}