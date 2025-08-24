// SEO Configuration for Sampurna Atmaramani Portfolio
const seoConfig = {
    // Basic SEO
    title: "Sampurna Atmaramani - Senior Technical Architect & Full-Stack Developer | Pune, India",
    description: "Sampurna Atmaramani - Senior Technical Architect & Full-Stack Developer with 20+ years of experience in React, Node.js, AWS, DevOps, AI/ML technologies. Expert in microservices, cloud architecture, and team leadership.",
    keywords: "Sampurna Atmaramani, Senior Architect, Full-Stack Developer, React, Node.js, AWS, DevOps, AI/ML, Hugging Face, Portfolio, Technical Architect, Pune, India, Microservices, Cloud Architecture, Team Leadership, AWS Certified Solutions Architect Professional",
    author: "Sampurna Atmaramani",
    language: "en",
    
    // URLs
    canonical: "https://techysam.vercel.app/",
    baseUrl: "https://techysam.vercel.app",
    
    // Social Media
    social: {
        linkedin: "https://www.linkedin.com/in/sampurna/",
        github: "https://github.com/satmaramani",
        medium: "https://medium.com/@s.atmaramani",
        youtube: "https://www.youtube.com/@techysam-bl9mk",
        udemy: "https://www.udemy.com/user/sampurna-atmaramani/",
        npm: "https://www.npmjs.com/~s.atmaramani",
        huggingface: "https://huggingface.co/techysam"
    },
    
    // Analytics
    analytics: {
        googleAnalytics: "G-7XPZHRS05K", // Replace with actual GA ID
        googleTagManager: "GTM_XXXXXXX", // Replace with actual GTM ID
        facebookPixel: "FB_PIXEL_ID" // Replace with actual FB Pixel ID
    },
    
    // Performance
    performance: {
        preloadFonts: true,
        preloadCriticalCSS: true,
        lazyLoadImages: true,
        minifyCSS: true,
        minifyJS: true
    },
    
    // Security
    security: {
        contentSecurityPolicy: true,
        hsts: true,
        xFrameOptions: "DENY",
        xContentTypeOptions: "nosniff"
    },
    
    // Sitemap
    sitemap: {
        enabled: true,
        priority: {
            home: 1.0,
            about: 0.9,
            experience: 0.9,
            skills: 0.8,
            projects: 0.8,
            aiSpaces: 0.8,
            npmPackages: 0.7,
            awards: 0.7,
            contact: 0.6
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = seoConfig;
} else {
    window.seoConfig = seoConfig;
}
