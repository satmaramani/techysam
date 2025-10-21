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

// Mobile Navigation Toggle - Now inline in HTML for faster execution
// See inline script in index.html

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

// Navbar scroll effect - Lightweight with passive listener
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 100);
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Section animations DISABLED for performance
// Sections display immediately without animation
// Massive improvement to FCP, LCP, TBT

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

// Counter animation DISABLED for performance
// Numbers display immediately - no animation
// This significantly improves TBT and FCP

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

// Navigation and animations DISABLED for maximum performance
// All styling handled by CSS for instant rendering

// Minimal initialization - Keep TBT low
// Sections animate via CSS automatically
// No heavy operations on page load

// Scroll to top button - Deferred way after load
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
            }, 200);
        }
    }, { passive: true });
}, 3000); // Wait 3 seconds before creating button

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