// ===== PERFORMANCE OPTIMIZED SMOOTH SCROLLING =====
class SmoothScrolling {
    constructor() {
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.init();
    }

    init() {
        // Enhanced smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });

        // Performance-optimized scroll events
        this.setupOptimizedScrollEvents();
        
        // Mobile touch optimizations
        this.setupTouchOptimizations();
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const startPosition = window.pageYOffset;
            const targetPosition = targetElement.offsetTop - 80; // Account for fixed navbar
            const distance = targetPosition - startPosition;
            const duration = Math.min(1000, Math.abs(distance) / 2); // Dynamic duration
            
            this.smoothScrollTo(startPosition, targetPosition, duration);
        }
    }

    smoothScrollTo(startPosition, targetPosition, duration) {
        const startTime = performance.now();
        
        const animateScroll = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function for smooth acceleration/deceleration
            const easeInOutCubic = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            const currentPosition = startPosition + (targetPosition - startPosition) * easeInOutCubic;
            
            window.scrollTo(0, currentPosition);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                this.isScrolling = false;
            }
        };
        
        this.isScrolling = true;
        requestAnimationFrame(animateScroll);
    }

    setupOptimizedScrollEvents() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            // Update navbar scroll state
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            // Update active navigation
            this.updateActiveNavigation();
            
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };

        // Throttled scroll event listener
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    updateActiveNavigation() {
        if (this.isScrolling) return; // Skip during programmatic scrolling
        
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && 
                window.scrollY < sectionTop + sectionHeight) {
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

    setupTouchOptimizations() {
        // Optimize touch scrolling for mobile
        if ('ontouchstart' in window) {
            document.body.style.touchAction = 'pan-y';
            
            // Reduce scroll latency on mobile
            let touchStartY = 0;
            let touchEndY = 0;
            
            document.addEventListener('touchstart', (e) => {
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });
            
            document.addEventListener('touchmove', (e) => {
                touchEndY = e.changedTouches[0].screenY;
                
                // Detect scroll direction and optimize
                const scrollDirection = touchStartY - touchEndY;
                if (Math.abs(scrollDirection) > 10) {
                    // Apply optimizations based on scroll direction
                    this.optimizeForScrollDirection(scrollDirection);
                }
            }, { passive: true });
        }
    }

    optimizeForScrollDirection(direction) {
        // Reduce animation complexity during fast scrolling
        const animatedElements = document.querySelectorAll('.service-card, .portfolio-card, .testimonial-card');
        
        if (Math.abs(direction) > 50) { // Fast scrolling
            animatedElements.forEach(el => {
                el.style.transition = 'none';
            });
            
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                animatedElements.forEach(el => {
                    el.style.transition = '';
                });
            }, 150);
        }
    }
}

// Initialize smooth scrolling
document.addEventListener('DOMContentLoaded', () => {
    new SmoothScrolling();
    setupLazyLoading();
    
    // Animate hero content on load
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('animated');
        }
    }, 300);
});

// ===== LAZY LOADING FUNCTIONALITY =====
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loaded class when image is loaded
                    if (img.complete) {
                        img.classList.add('loaded');
                    } else {
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.classList.add('loaded');
        });
    }
}

// ===== ENHANCED SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            // Stagger animation for cards
            const cards = entry.target.querySelectorAll('.service-card, .portfolio-card, .tech-category, .feature-card, .testimonial-card, .pricing-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animated');
                }, index * 150); // Slower stagger for better effect
            });
            
            // Animate testimonial stats, pricing info, and custom features separately
            const statItems = entry.target.querySelectorAll('.testimonials-stats .stat-item');
            statItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animated');
                }, index * 200);
            });
            
            const pricingInfo = entry.target.querySelectorAll('.pricing-card .pricing-info, .custom-plan-card .custom-icon');
            pricingInfo.forEach((info, index) => {
                setTimeout(() => {
                    info.classList.add('animated');
                }, index * 150);
            });
            
            const customFeatures = entry.target.querySelectorAll('.custom-features .feature-item');
            customFeatures.forEach((feature, index) => {
                setTimeout(() => {
                    feature.classList.add('animated');
                }, index * 100);
            });
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .portfolio-card, .tech-category, .feature-card, .testimonial-card, .pricing-card').forEach(el => {
    observer.observe(el);
});

// Observe stat items for animation
document.querySelectorAll('.testimonials-stats .stat-item').forEach(el => {
    observer.observe(el);
});

// ===== NAVIGATION TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking links
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        
        // Reset hamburger animation
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navToggle && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        
        // Reset hamburger animation
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ===== CONSOLE BRANDING =====
console.log('%c Pixify - Transforming brands, one pixel at a time', 'color: #00A8FF; font-size: 16px; font-weight: bold;');
console.log('%c Precision • Performance • Innovation', 'color: #888888; font-size: 12px;');
