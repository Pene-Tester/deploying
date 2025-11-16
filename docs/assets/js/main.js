// Navigation functionality
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const cloudToggle = document.querySelector('.cloud-menu-toggle');
const menuBackdrop = document.querySelector('.menu-backdrop');

// Active navigation link on scroll
const sections = document.querySelectorAll('.section');

function setActiveNavLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        // Close mobile menu
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        if (cloudToggle) cloudToggle.classList.remove('active');
        if (menuBackdrop) menuBackdrop.classList.remove('active');
    });
});

// Hamburger menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Cloud menu toggle for mobile
if (cloudToggle) {
    cloudToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        cloudToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        if (menuBackdrop) menuBackdrop.classList.toggle('active');
    });

    // Close menu when clicking backdrop
    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', () => {
            cloudToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuBackdrop.classList.remove('active');
        });
    }

    // Close menu when clicking nav links on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                cloudToggle.classList.remove('active');
                navMenu.classList.remove('active');
                if (menuBackdrop) menuBackdrop.classList.remove('active');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !cloudToggle.contains(e.target)) {
                cloudToggle.classList.remove('active');
                navMenu.classList.remove('active');
                if (menuBackdrop) menuBackdrop.classList.remove('active');
            }
        }
    });
}

// Projects Slider with Diagonal Flash Card Animation
class ProjectsSlider {
    constructor() {
        this.currentIndex = 0;
        this.projects = [];
        this.container = document.getElementById('projectsContainer');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('indicators');
        this.sliderWrapper = this.container?.parentElement;
        
        this.init();
    }

    init() {
        // Initialize with projects
        this.projects = [
            {
                title: 'Project 1',
                description: 'A dynamic web application built with modern technologies.',
                folder: 'assets/img/project1',
                image: 'proj1_event0.png'
            },
            {
                title: 'Project 2',
                description: 'An innovative solution for seamless user experiences.',
                folder: 'assets/img/project2'
            },
            {
                title: 'Project 3',
                description: 'A cutting-edge platform combining front-end and back-end excellence.',
                folder: 'assets/img/project3',
                image: 'project3.png',
                images: ['project3.png', 'project2.png']
            }
        ];
        
        this.renderProjects();
        this.setupEventListeners();
        this.updateControls();
    }

    addProject(project) {
        // Remove placeholder if it exists
        if (this.projects.length === 1 && this.projects[0].title === 'Add Your Projects') {
            this.projects = [];
        }
        
        this.projects.push(project);
        this.renderProjects();
        this.updateIndicators();
        this.updateControls();
        this.updateCardPositions();
    }

    renderProjects() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        if (!this.cardSlideshows) this.cardSlideshows = [];
        // clear any existing intervals
        this.cardSlideshows.forEach(id => clearInterval(id));
        this.cardSlideshows = [];

        this.projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            // Get the first image for display
            let displayImage = project.image;
            if (!displayImage && project.images && project.images.length > 0) {
                displayImage = project.images[0];
            }
            
            // Build image path
            let imagePath = displayImage;
            if (project.folder && displayImage) {
                imagePath = `${project.folder}/${displayImage}`;
            }
            
            projectCard.innerHTML = `
                ${displayImage ? `<img src="${imagePath}" alt="${project.title}" class="project-image clickable-image" data-image="${imagePath}" data-images="${project.images ? project.images.map(img => project.folder ? `${project.folder}/${img}` : img).join(',') : ''}" data-title="${project.title}">` : ''}
                <h3>${project.title}</h3>
                <p>${project.description || ''}</p>
                ${project.technologies ? `<div class="project-tech">${project.technologies.join(', ')}</div>` : ''}
                ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">View Project</a>` : ''}
            `;
            this.container.appendChild(projectCard);

            // Inline slideshow before click
            if (project.images && project.images.length > 1) {
                const imgEl = projectCard.querySelector('.project-image');
                if (imgEl) {
                    let idx = 0;
                    const sources = project.images.map(img => project.folder ? `${project.folder}/${img}` : img);
                    const id = setInterval(() => {
                        idx = (idx + 1) % sources.length;
                        imgEl.style.opacity = '0';
                        setTimeout(() => {
                            imgEl.src = sources[idx];
                            imgEl.style.opacity = '1';
                            imgEl.setAttribute('data-image', sources[idx]);
                            imgEl.setAttribute('data-images', sources.join(','));
                        }, 150);
                    }, 3500);
                    this.cardSlideshows.push(id);
                    projectCard.addEventListener('mouseenter', () => clearInterval(id));
                }
            }
        });
        
        this.updateIndicators();
        this.updateCardPositions();
        this.attachImageClickHandlers();
    }

    attachImageClickHandlers() {
        const images = this.container.querySelectorAll('.clickable-image');
        images.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                const imageSrc = img.getAttribute('data-image');
                const imagesData = img.getAttribute('data-images');
                const imageTitle = img.getAttribute('data-title');
                if (imageSrc) {
                    // If multiple images exist, show image gallery
                    if (imagesData && imagesData.split(',').length > 1) {
                        showProjectModal(imageSrc, imageTitle, imagesData.split(',').map(img => img.trim()));
                    } else {
                        showProjectModal(imageSrc, imageTitle);
                    }
                }
            });
        });
    }

    updateCardPositions() {
        if (!this.container) return;
        
        const projectCards = this.container.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            // Remove all position classes
            card.classList.remove('active', 'prev', 'next', 'hidden');
            
            if (this.projects.length === 1) {
                // Only one project
                card.classList.add('active');
            } else if (index === this.currentIndex) {
                // Current active card
                card.classList.add('active');
            } else if (index === this.currentIndex - 1) {
                // Previous card
                card.classList.add('prev');
            } else if (index === this.currentIndex + 1) {
                // Next card
                card.classList.add('next');
            } else {
                // Hidden cards
                card.classList.add('hidden');
            }
        });
    }

    updateIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        this.projects.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === this.currentIndex ? 'active' : ''}`;
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicatorsContainer.appendChild(indicator);
        });
    }

    updateControls() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.projects.length - 1;
        }
    }

    goToSlide(index) {
        if (index >= 0 && index < this.projects.length) {
            this.currentIndex = index;
            this.updateCardPositions();
            this.updateIndicators();
            this.updateControls();
        }
    }

    nextSlide() {
        if (this.currentIndex < this.projects.length - 1) {
            this.currentIndex++;
            this.updateCardPositions();
            this.updateIndicators();
            this.updateControls();
        }
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCardPositions();
            this.updateIndicators();
            this.updateControls();
        }
    }

    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                const rect = projectsSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    if (e.key === 'ArrowLeft') {
                        this.prevSlide();
                    } else if (e.key === 'ArrowRight') {
                        this.nextSlide();
                    }
                }
            }
        });

        // Touch/swipe support
        this.touchStartX = 0;
        this.touchEndX = 0;

        if (this.container) {
            this.container.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            });

            this.container.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });
        }

        if (this.sliderWrapper) {
            this.sliderWrapper.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            });

            this.sliderWrapper.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });
        }
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
}

// Initialize slider
const slider = new ProjectsSlider();

// Make slider available globally for adding projects
window.addProject = function(project) {
    slider.addProject(project);
};

// Project Modal Functionality
const projectModal = document.getElementById('projectModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = projectModal?.querySelector('.modal-backdrop');
let currentImageIndex = 0;
let imageGallery = [];
let slideshowInterval = null;
let slideshowIsActive = false;

function showProjectModal(imageSrc, imageTitle, images = null) {
    if (!projectModal || !modalImage) return;
    
    if (images && images.length > 1) {
        imageGallery = images;
        currentImageIndex = images.indexOf(imageSrc);
        if (currentImageIndex === -1) currentImageIndex = 0;
        setupImageGallery();
        startSlideshow();
    } else {
        imageGallery = [];
        removeImageGallery();
        stopSlideshow();
    }
    
    modalImage.src = imageSrc;
    modalImage.alt = imageTitle || 'Project image';
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function startSlideshow() {
    stopSlideshow(); // Clear any existing slideshow
    if (imageGallery.length <= 1) return;
    
    slideshowIsActive = true;
    slideshowInterval = setInterval(() => {
        navigateImage(1);
    }, 4000); // Change image every 4 seconds
}

function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
    slideshowIsActive = false;
}

function toggleSlideshow() {
    if (slideshowIsActive) {
        stopSlideshow();
    } else {
        startSlideshow();
    }
    updateSlideshowButton();
}

function updateSlideshowButton() {
    const slideshowBtn = projectModal?.querySelector('.slideshow-toggle');
    if (slideshowBtn) {
        if (slideshowIsActive) {
            slideshowBtn.classList.add('active');
            slideshowBtn.setAttribute('aria-label', 'Pause slideshow');
        } else {
            slideshowBtn.classList.remove('active');
            slideshowBtn.setAttribute('aria-label', 'Start slideshow');
        }
    }
}

function setupImageGallery() {
    if (!projectModal || imageGallery.length <= 1) return;
    
    let modalContent = projectModal.querySelector('.modal-content');
    if (!modalContent.querySelector('.modal-nav')) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'modal-nav modal-nav-prev';
        prevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>';
        prevBtn.setAttribute('aria-label', 'Previous image');
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            stopSlideshow();
            navigateImage(-1);
            startSlideshow();
        });
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'modal-nav modal-nav-next';
        nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
        nextBtn.setAttribute('aria-label', 'Next image');
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            stopSlideshow();
            navigateImage(1);
            startSlideshow();
        });
        
        // Add slideshow toggle button
        const slideshowBtn = document.createElement('button');
        slideshowBtn.className = 'slideshow-toggle active';
        slideshowBtn.innerHTML = `
            <svg class="play-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
                <path d="M8 5v14l11-7z"/>
            </svg>
            <svg class="pause-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
        `;
        slideshowBtn.setAttribute('aria-label', 'Pause slideshow');
        slideshowBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSlideshow();
        });
        
        modalContent.appendChild(prevBtn);
        modalContent.appendChild(nextBtn);
        modalContent.appendChild(slideshowBtn);
        
        // Add indicator
        const indicator = document.createElement('div');
        indicator.className = 'modal-indicator';
        indicator.innerHTML = `<span class="modal-current">${currentImageIndex + 1}</span> / <span class="modal-total">${imageGallery.length}</span>`;
        modalContent.appendChild(indicator);
        
        updateSlideshowButton();
    }
}

function removeImageGallery() {
    if (!projectModal) return;
    const modalContent = projectModal.querySelector('.modal-content');
    const navButtons = modalContent.querySelectorAll('.modal-nav, .modal-indicator, .slideshow-toggle');
    navButtons.forEach(btn => btn.remove());
}

function navigateImage(direction) {
    if (imageGallery.length === 0) return;
    
    currentImageIndex += direction;
    if (currentImageIndex < 0) {
        currentImageIndex = imageGallery.length - 1;
    } else if (currentImageIndex >= imageGallery.length) {
        currentImageIndex = 0;
    }
    
    if (modalImage) {
        // Add fade effect
        modalImage.style.opacity = '0';
        setTimeout(() => {
            modalImage.src = imageGallery[currentImageIndex];
            modalImage.style.opacity = '1';
        }, 150);
    }
    
    // Update indicator
    const indicator = projectModal.querySelector('.modal-current');
    if (indicator) {
        indicator.textContent = currentImageIndex + 1;
    }
}

function closeProjectModal() {
    if (!projectModal) return;
    
    stopSlideshow();
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
    imageGallery = [];
    removeImageGallery();
}

// Close modal events
if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal);
}

if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeProjectModal);
}

// Close modal with ESC key and arrow navigation
document.addEventListener('keydown', (e) => {
    if (projectModal?.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeProjectModal();
        } else if (e.key === 'ArrowLeft' && imageGallery.length > 1) {
            navigateImage(-1);
        } else if (e.key === 'ArrowRight' && imageGallery.length > 1) {
            navigateImage(1);
        }
    }
});

// Close modal when clicking modal content (but not the image)
if (projectModal) {
    const modalContent = projectModal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            if (e.target === modalContent || e.target === modalImage) {
                // Don't close if clicking the image or content container
                return;
            }
            closeProjectModal();
        });
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe skill cards
document.querySelectorAll('.skill-card').forEach(card => {
    observer.observe(card);
});

// Observe section titles
document.querySelectorAll('.section-title').forEach(title => {
    observer.observe(title);
});

// Smooth scroll for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

