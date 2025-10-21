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

// Mobile Navigation Toggle - Optimized
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// Smooth scrolling for navigation links - Optimized with event delegation
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}, { passive: false }); // Not passive because we preventDefault

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

// Intersection Observer for animations - Lightweight
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            sectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections - but only after initial render
setTimeout(() => {
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });
}, 100);

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

// Hero title is visible by default (no animation needed for performance)
// Removed to reduce TBT

// Counter animation for stats - Lightweight and fast
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const hasPlus = counter.textContent.includes('+');
        const duration = 800; // Fixed duration
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * target);
            
            counter.textContent = current + (hasPlus ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (hasPlus ? '+' : '');
            }
        };
        
        requestAnimationFrame(updateCounter);
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Defer the animation slightly to not block initial render
            setTimeout(() => animateCounters(), 50);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

// Setup observer after initial render
setTimeout(() => {
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}, 200);

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

// Minimal initialization - Keep TBT low
// Sections animate via CSS automatically
// No heavy operations on page load

// Smooth scroll to top functionality - Created after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        document.body.appendChild(scrollToTopBtn);
        
        // Show/hide - Throttled
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    scrollToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
                    scrollTimeout = null;
                }, 150);
            }
        }, { passive: true });
    }, 500);
});

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