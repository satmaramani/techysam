// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
    console.error('Error details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

// Profile Image Handling - Simplified and Robust
document.addEventListener('DOMContentLoaded', function() {
    try {
        const profilePhoto = document.querySelector('.profile-photo');
        const navPhoto = document.querySelector('.nav-photo');
        
        // Handle profile photo
        if (profilePhoto) {
            // Set initial state
            profilePhoto.style.opacity = '1';
            profilePhoto.style.visibility = 'visible';
            
            profilePhoto.addEventListener('load', function() {
                try {
                    this.classList.add('loaded');
                    console.log('Profile image loaded successfully');
                } catch (error) {
                    console.error('Error in profile photo load handler:', error);
                }
            });
            
            profilePhoto.addEventListener('error', function() {
                try {
                    console.error('Profile image failed to load');
                    // Keep the image visible but log the error
                    this.style.opacity = '0.7';
                } catch (error) {
                    console.error('Error in profile photo error handler:', error);
                }
            });
            
            // Check if already loaded
            if (profilePhoto.complete && profilePhoto.naturalHeight !== 0) {
                try {
                    profilePhoto.classList.add('loaded');
                } catch (error) {
                    console.error('Error checking profile photo status:', error);
                }
            }
        }
        
        // Handle navigation photo
        if (navPhoto) {
            navPhoto.addEventListener('load', function() {
                try {
                    console.log('Navigation profile image loaded successfully');
                } catch (error) {
                    console.error('Error in nav photo load handler:', error);
                }
            });
            
            navPhoto.addEventListener('error', function() {
                try {
                    console.error('Navigation profile image failed to load');
                    // Keep the image visible but log the error
                    this.style.opacity = '0.7';
                } catch (error) {
                    console.error('Error in nav photo error handler:', error);
                }
            });
            
            // Check if already loaded
            if (navPhoto.complete && navPhoto.naturalHeight !== 0) {
                try {
                    console.log('Navigation profile image already loaded');
                } catch (error) {
                    console.error('Error checking nav photo status:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error in profile image handling:', error);
    }
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
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

// Navbar background change on scroll - Throttled for performance
let navbarScrollTimeout;
window.addEventListener('scroll', () => {
    if (!navbarScrollTimeout) {
        navbarScrollTimeout = setTimeout(() => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            navbarScrollTimeout = null;
        }, 100);
    }
}, { passive: true });

// Intersection Observer for animations - Deferred for TBT
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        setupIntersectionObservers();
    });
} else {
    setTimeout(setupIntersectionObservers, 1500);
}

function setupIntersectionObservers() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission (replace with actual form handling)
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        
        // Reset form
        this.reset();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .notification-close:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Typing effect for hero title - DISABLED for performance
// This effect was causing high TBT (Total Blocking Time)
// Uncomment if needed, but it impacts mobile performance
/*
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}
*/

// Keep hero title static for better performance
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Title stays as-is, no animation for better TBT
        heroTitle.style.opacity = '1';
    }
});

// Counter animation for stats - Optimized with requestIdleCallback
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const hasPlus = counter.textContent.includes('+');
        let current = 0;
        const increment = Math.ceil(target / 50); // Faster animation
        
        const updateCounter = () => {
            if (current < target) {
                current = Math.min(current + increment, target);
                counter.textContent = current + (hasPlus ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (hasPlus ? '+' : '');
            }
        };
        
        // Use requestIdleCallback for non-critical animation
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => updateCounter());
        } else {
            setTimeout(updateCounter, 100);
        }
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Defer observer setup
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    });
} else {
    setTimeout(() => {
        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }, 1000);
}

// Skill tags and project cards hover - Use CSS only for better performance
// Removed JavaScript hover effects - now handled by CSS
// This significantly reduces TBT

// Smooth reveal animation for timeline items - Moved to CSS for TBT optimization
// CSS handles this more efficiently without blocking main thread

// Parallax effect for hero section - DISABLED for TBT optimization
// This creates unnecessary main thread work during scroll
// Uncomment only if needed for visual effect
/*
let parallaxTimeout;
window.addEventListener('scroll', () => {
    if (!parallaxTimeout) {
        parallaxTimeout = requestAnimationFrame(() => {
            const hero = document.querySelector('.hero');
            if (hero && window.pageYOffset < window.innerHeight) {
                const rate = window.pageYOffset * -0.3;
                hero.style.transform = `translateY(${rate}px)`;
            }
            parallaxTimeout = null;
        });
    }
}, { passive: true });
*/

// Active navigation highlighting - Throttled for performance
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
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

// Throttle active nav updates
let activeNavTimeout;
window.addEventListener('scroll', () => {
    if (!activeNavTimeout) {
        activeNavTimeout = setTimeout(() => {
            updateActiveNav();
            activeNavTimeout = null;
        }, 150);
    }
}, { passive: true });

// Add active state styles
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        color: #2563eb !important;
    }
    .nav-menu a.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded - OPTIMIZED for TBT
document.addEventListener('DOMContentLoaded', () => {
    // Defer non-critical animations using requestIdleCallback
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initNonCriticalAnimations();
        });
    } else {
        setTimeout(initNonCriticalAnimations, 2000);
    }
});

function initNonCriticalAnimations() {
    try {
        // Simplified section animations - use CSS instead
        document.querySelectorAll('section').forEach((section) => {
            section.classList.add('section-visible');
        });
    } catch (error) {
        console.error('Error in animations:', error);
    }
}

// Smooth scroll to top functionality - Deferred for performance
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => createScrollToTopButton());
} else {
    setTimeout(createScrollToTopButton, 2000);
}

function createScrollToTopButton() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button - Throttled
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
                scrollTimeout = null;
            }, 100);
        }
    }, { passive: true });
}

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.classList.remove('active');
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');
            }
        });
    });
});