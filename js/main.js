// Main Application Controller
class PortfolioApp {
    constructor() {
        this.yamlLoader = new YAMLLoader();
        this.timeline = null;
        this.data = null;
    }

    async initialize() {
        try {
            // Show loading state
            this.showLoadingState();
            
            // Load YAML data
            this.data = await this.yamlLoader.loadData();
            
            // Initialize timeline
            this.timeline = new Timeline('.timeline-container');
            await this.timeline.initialize(this.data);
            
            // Populate skills
            this.populateSkills();
            
            // Hide loading state
            this.hideLoadingState();
            
            console.log('Portfolio initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio:', error);
            this.showErrorState();
        }
    }

    showLoadingState() {
        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>Loading portfolio...</p>
            </div>
        `;
        
        // Add loading styles
        const style = document.createElement('style');
        style.textContent = `
            #loadingOverlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(102, 126, 234, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(10px);
            }
            
            .loading-content {
                text-align: center;
                color: white;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(loadingOverlay);
    }

    hideLoadingState() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
            }, 300);
        }
    }

    showErrorState() {
        this.hideLoadingState();
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Portfolio</h3>
                <p>There was an issue loading the portfolio data. Please refresh the page to try again.</p>
                <button onclick="location.reload()" class="retry-btn">Retry</button>
            </div>
        `;
        
        // Add error styles
        const style = document.createElement('style');
        style.textContent = `
            .error-message {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(220, 53, 69, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(10px);
            }
            
            .error-content {
                text-align: center;
                color: white;
                max-width: 400px;
                padding: 2rem;
            }
            
            .error-content i {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .error-content h3 {
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }
            
            .error-content p {
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            
            .retry-btn {
                background: white;
                color: #dc3545;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 5px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .retry-btn:hover {
                background: #f8f9fa;
                transform: translateY(-2px);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(errorMessage);
    }

    populateSkills() {
        const skillsContainer = document.getElementById('skillsContainer');
        if (!skillsContainer) return;
        
        const technologies = this.yamlLoader.getAllTechnologies();
        
        skillsContainer.innerHTML = technologies.map(tech => `
            <div class="skill-item">
                <i class="${tech.icon}"></i>
                <span>${tech.name}</span>
            </div>
        `).join('');
    }


    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global instances
window.yamlLoader = null;
window.timeline = null;
window.app = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    window.app = new PortfolioApp();
    window.yamlLoader = window.app.yamlLoader;
    await window.app.initialize();
    window.timeline = window.app.timeline;
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.timeline) {
        if (document.hidden) {
            window.timeline.pause();
        } else {
            window.timeline.resume();
        }
    }
});

// Handle window focus/blur
window.addEventListener('blur', () => {
    if (window.timeline) {
        window.timeline.pause();
    }
});

window.addEventListener('focus', () => {
    if (window.timeline) {
        window.timeline.resume();
    }
});

// Add smooth scrolling to navigation links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
});