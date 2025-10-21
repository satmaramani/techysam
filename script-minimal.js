// MINIMAL SCRIPT - Maximum Performance, Minimum Blocking Time
// Only essential functionality, no animations

// 1. Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});

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
        });
        
        img.addEventListener('error', (e) => {
            console.log(`❌ Award Image ${index + 1} failed to load:`, img.src);
            console.log('Error details:', e);
        });
        
        // Check if image is already loaded
        if (img.complete && img.naturalWidth > 0) {
            console.log(`✅ Award Image ${index + 1} already loaded:`, img.src);
        } else {
            console.log(`⏳ Award Image ${index + 1} still loading:`, img.src);
        }
    });
});

// 5. Contact form
const form = document.getElementById('contactForm');
if (form) {
    form.onsubmit = (e) => {
        e.preventDefault();
        const data = new FormData(form);
        if (data.get('email') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get('email'))) {
            alert('Thank you! I\'ll get back to you soon.');
            form.reset();
        } else {
            alert('Please enter a valid email.');
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

