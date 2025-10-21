// MINIMAL SCRIPT - Maximum Performance, Minimum Blocking Time
// Only essential functionality, no animations

// 1. Smooth scrolling for anchor links with breadcrumb updates
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Update breadcrumb
            updateBreadcrumb(link.getAttribute('href'));
        }
    }
});

// Breadcrumb update function
function updateBreadcrumb(sectionId) {
    const breadcrumbList = document.querySelector('.breadcrumb-list');
    if (!breadcrumbList) return;
    
    const sectionNames = {
        '#home': 'Home',
        '#about': 'About',
        '#profile': 'Profile',
        '#experience': 'Experience',
        '#skills': 'Skills',
        '#projects': 'Projects',
        '#hobbies': 'Hobbies',
        '#awards': 'Awards',
        '#npm-packages': 'NPM Packages',
        '#ai-spaces': 'AI Spaces',
        '#faq': 'FAQ',
        '#contact': 'Contact'
    };
    
    const currentSection = sectionNames[sectionId] || 'Home';
    
    // Clear existing breadcrumb
    breadcrumbList.innerHTML = '';
    
    // Add Home
    const homeItem = document.createElement('li');
    homeItem.className = 'breadcrumb-item';
    homeItem.innerHTML = `<a href="#home">Home</a>`;
    breadcrumbList.appendChild(homeItem);
    
    // Add current section if not home
    if (sectionId !== '#home') {
        const currentItem = document.createElement('li');
        currentItem.className = 'breadcrumb-item';
        currentItem.innerHTML = `<a href="${sectionId}" aria-current="page">${currentSection}</a>`;
        breadcrumbList.appendChild(currentItem);
    } else {
        // Mark home as current
        const homeLink = homeItem.querySelector('a');
        homeLink.setAttribute('aria-current', 'page');
    }
}

// 2. Navbar scroll effect - requestAnimationFrame
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 100);
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Advanced Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Escape key handling
    if (e.key === 'Escape') {
        // Close any open modals or dropdowns
        const openElements = document.querySelectorAll('[aria-expanded="true"]');
        openElements.forEach(element => {
            element.setAttribute('aria-expanded', 'false');
            element.classList.remove('active');
        });
        
        // Focus management
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('focus-trap')) {
            activeElement.blur();
        }
    }
    
    // Arrow key navigation for menu items
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const menuItems = document.querySelectorAll('[role="menuitem"]');
        const currentIndex = Array.from(menuItems).indexOf(document.activeElement);
        
        if (currentIndex !== -1) {
            e.preventDefault();
            let nextIndex;
            
            if (e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % menuItems.length;
            } else {
                nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
            }
            
            menuItems[nextIndex].focus();
        }
    }
    
    // Enter and Space key handling for custom elements
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('faq-question')) {
        e.preventDefault();
        e.target.click();
    }
});

// 3. FAQ Accordion
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.onclick = () => {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all others
            document.querySelectorAll('.faq-question').forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current
            question.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('active');
        };
    });
});

// 4. Debug award images loading
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 DOM loaded, checking award images...');
    const awardImages = document.querySelectorAll('.award-photo');
    console.log(`Found ${awardImages.length} award images`);
    
    awardImages.forEach((img, index) => {
        console.log(`Award Image ${index + 1}:`, {
            src: img.src,
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            offsetWidth: img.offsetWidth,
            offsetHeight: img.offsetHeight
        });
        
        img.addEventListener('load', () => {
            console.log(`✅ Award Image ${index + 1} loaded successfully:`, img.src);
            console.log('Final dimensions:', img.naturalWidth, 'x', img.naturalHeight);
            img.classList.add('loaded');
        });
        
        img.addEventListener('error', (e) => {
            console.log(`❌ Award Image ${index + 1} failed to load:`, img.src);
            console.log('Error details:', e);
        });
        
        // Check if image is already loaded
        if (img.complete && img.naturalWidth > 0) {
            console.log(`✅ Award Image ${index + 1} already loaded:`, img.src);
            img.classList.add('loaded');
        } else {
            console.log(`⏳ Award Image ${index + 1} still loading:`, img.src);
        }
    });
});

// 5. Enhanced Contact form with accessibility
const form = document.getElementById('contactForm');
if (form) {
    // Clear all error states
    function clearErrors() {
        const errorMessages = form.querySelectorAll('.error-message');
        const inputs = form.querySelectorAll('input, textarea');
        
        errorMessages.forEach(msg => {
            msg.classList.remove('show');
            msg.textContent = '';
        });
        
        inputs.forEach(input => {
            input.setAttribute('aria-invalid', 'false');
        });
    }
    
    // Show error for specific field
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + '-error');
        
        field.setAttribute('aria-invalid', 'true');
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    }
    
    // Validate individual field
    function validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        
        if (field.hasAttribute('required') && !value) {
            showError(fieldId, 'This field is required');
            return false;
        }
        
        if (fieldId === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            showError(fieldId, 'Please enter a valid email address');
            return false;
        }
        
        return true;
    }
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            clearErrors();
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.getAttribute('aria-invalid') === 'true') {
                clearErrors();
                validateField(input);
            }
        });
    });
    
    // Form submission
    form.onsubmit = (e) => {
        e.preventDefault();
        clearErrors();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = 'Thank you! I\'ll get back to you soon.';
            successMsg.setAttribute('role', 'alert');
            successMsg.setAttribute('aria-live', 'polite');
            
            form.insertBefore(successMsg, form.firstChild);
            form.reset();
            
            // Announce success to screen readers
            const liveRegion = document.getElementById('live-region');
            if (liveRegion) {
                liveRegion.textContent = 'Form submitted successfully. Thank you for your message.';
            }
            
            // Focus management after success
            setTimeout(() => {
                const firstInput = form.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 100);
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                if (successMsg.parentNode) {
                    successMsg.remove();
                }
            }, 5000);
        } else {
            // Focus first invalid field
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid) {
                firstInvalid.focus();
                
                // Announce error to screen readers
                const liveRegion = document.getElementById('live-region');
                if (liveRegion) {
                    liveRegion.textContent = 'Please correct the errors in the form before submitting.';
                }
            }
        }
    };
}

// 5. Scroll to top button - Created after 2s
setTimeout(() => {
    const btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(btn);
    
    let timeout;
    window.addEventListener('scroll', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            btn.classList.toggle('visible', window.scrollY > 300);
        }, 150);
    }, { passive: true });
}, 2000);

// That's it! Super minimal, super fast.

