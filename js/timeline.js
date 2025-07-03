// Timeline Animation Controller
class Timeline {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.content = this.container.querySelector('#timelineContent');
        this.items = [];
        this.currentIndex = 0;
        this.animationId = null;
        this.isAnimating = true;
        this.itemHeight = 0;
        // Dynamic gap based on screen size - mobile needs more space for expanded cards
        this.updateGap();
        this.animationSpeed = 0.5; // pixels per frame
        this.currentPosition = 0;
        this.userScrollTimeout = null;
        this.isUserScrolling = false;
        this.lastScrollTime = 0;
        this.mobileMode = window.innerWidth <= 767;

        this.bindEvents();
    }

    updateGap() {
        // Gap only matters for desktop animation
        const isMobile = window.innerWidth <= 767;
        const isTablet = window.innerWidth <= 1023;

        if (isMobile) {
            this.gap = 0; // No gap needed for mobile static layout
        } else if (isTablet) {
            this.gap = 380; // Medium space for tablet
        } else {
            this.gap = 320; // Default desktop spacing
        }
    }

    bindEvents() {
        // Resize handler
        window.addEventListener('resize', () => {
            this.updateGap();
            this.calculateDimensions();

            // Switch between mobile and desktop modes
            const isMobile = window.innerWidth <= 767;
            if (isMobile && !this.mobileMode) {
                this.setupMobileMode();
                this.mobileMode = true;
            } else if (!isMobile && this.mobileMode) {
                this.setupDesktopMode();
                this.mobileMode = false;
            }
        });

        // Manual scroll functionality (desktop only)
        this.container.addEventListener('wheel', (e) => {
            if (window.innerWidth > 767) {
                this.handleManualScroll(e);
            }
        });

        // Touch events for desktop/tablet only
        this.container.addEventListener('touchstart', (e) => {
            if (window.innerWidth > 767) {
                this.handleTouchStart(e);
            }
        });

        this.container.addEventListener('touchmove', (e) => {
            if (window.innerWidth > 767) {
                this.handleTouchMove(e);
            }
        });

        this.container.addEventListener('touchend', () => {
            if (window.innerWidth > 767) {
                this.handleTouchEnd();
            }
        });
    }


    handleManualScroll(e) {
        e.preventDefault();

        // Light throttling for smooth scrolling
        const now = Date.now();
        if (now - this.lastScrollTime < 8) { // ~120fps for smoother experience
            return;
        }
        this.lastScrollTime = now;

        // Pause auto-animation
        this.pauseAutoAnimation();

        // Faster, more responsive scroll speed
        const scrollSpeed = Math.abs(e.deltaY) > 100 ? 8 : 4; // Adaptive speed based on scroll intensity
        const scrollDirection = e.deltaY > 0 ? 1 : -1;

        // Update position more responsively
        this.currentPosition += scrollDirection * scrollSpeed;

        // Ensure we don't go below 0
        if (this.currentPosition < 0) {
            this.currentPosition = 0;
        }

        // Check if we need to append more items when manually scrolling forward
        const totalHeight = this.itemHeight * this.items.length;
        const visibleHeight = this.containerHeight;
        const bufferHeight = visibleHeight * 4;
        
        if (this.currentPosition > totalHeight - bufferHeight) {
            this.appendMoreItems(this.data.professional_experience.length);
            setTimeout(() => this.calculateDimensions(), 50);
        }

        // Resume auto-animation after delay
        this.resumeAutoAnimationDelayed();
    }

    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
        this.pauseAutoAnimation();
    }

    handleTouchMove(e) {
        if (!this.touchStartY) return;

        e.preventDefault();
        const touchY = e.touches[0].clientY;
        const deltaY = this.touchStartY - touchY;

        // Update position with better touch sensitivity
        const touchScrollSpeed = 2;
        this.currentPosition += deltaY * touchScrollSpeed;

        // Ensure we don't go below 0
        if (this.currentPosition < 0) {
            this.currentPosition = 0;
        }

        // Check if we need to append more items when touch scrolling forward
        const totalHeight = this.itemHeight * this.items.length;
        const visibleHeight = this.containerHeight;
        const bufferHeight = visibleHeight * 4;
        
        if (this.currentPosition > totalHeight - bufferHeight) {
            this.appendMoreItems(this.data.professional_experience.length);
            setTimeout(() => this.calculateDimensions(), 50);
        }

        this.touchStartY = touchY;
    }

    handleTouchEnd() {
        this.touchStartY = null;
        this.resumeAutoAnimationDelayed();
    }

    pauseAutoAnimation() {
        this.isUserScrolling = true;
        if (this.userScrollTimeout) {
            clearTimeout(this.userScrollTimeout);
        }
    }

    resumeAutoAnimationDelayed() {
        if (this.userScrollTimeout) {
            clearTimeout(this.userScrollTimeout);
        }

        this.userScrollTimeout = setTimeout(() => {
            this.isUserScrolling = false;
        }, 2000); // Resume after 2 seconds of no interaction
    }

    async initialize(data) {
        this.data = data;
        this.createTimelineItems();
        this.calculateDimensions();

        const isMobile = window.innerWidth <= 767;

        if (isMobile) {
            // Mobile: static timeline with all cards expanded
            this.setupMobileMode();
            this.mobileMode = true;
        } else {
            // Desktop: animated timeline
            this.mobileMode = false;
            setTimeout(() => {
                this.startAnimation();
            }, 500);
        }
    }

    setupMobileMode() {
        // Reset position to start
        this.currentPosition = 0;
        this.content.style.transform = 'translateY(0px)';

        // Show only the original set of items on mobile
        this.items.forEach((item, index) => {
            // Show only the first set of experiences (original items)
            if (index < this.data.professional_experience.length) {
                item.style.display = 'flex';
                item.classList.add('centered');
                
                const highlights = item.querySelector('.card-highlights');
                const card = item.querySelector('.timeline-card');
                
                if (highlights) {
                    highlights.style.maxHeight = '300px';
                    highlights.style.opacity = '1';
                }
                
                if (card) {
                    card.style.transform = 'none';
                }
            } else {
                // Hide dynamically appended items on mobile
                item.style.display = 'none';
            }
        });
    }


    setupDesktopMode() {
        // Show all items (including duplicates) and expand all cards
        this.items.forEach(item => {
            item.style.display = 'flex';
            item.classList.add('centered'); // Keep all cards expanded

            const highlights = item.querySelector('.card-highlights');
            const card = item.querySelector('.timeline-card');

            if (highlights) {
                highlights.style.maxHeight = '300px'; // Keep expanded
                highlights.style.opacity = '1';
            }

            if (card) {
                card.style.transform = 'scale(1.05)'; // Keep slightly scaled
            }
        });

        // Restart animation
        this.startAnimation();
    }

    createTimelineItems() {
        this.content.innerHTML = '';
        this.items = [];

        if (!this.data || !this.data.professional_experience) return;

        const experiences = this.data.professional_experience;

        // Create initial items for each experience
        experiences.forEach((exp, index) => {
            const item = this.createTimelineItem(exp, index);
            this.content.appendChild(item);
            this.items.push(item);
        });

        // Pre-load additional cycles to prevent rendering delays
        // This ensures smooth transitions when cycling through experiences
        for (let cycle = 1; cycle <= 2; cycle++) {
            experiences.forEach((exp, index) => {
                const item = this.createTimelineItem(exp, this.items.length);
                this.content.appendChild(item);
                this.items.push(item);
            });
        }

        // Initialize the cycling index for infinite appending
        this.cycleIndex = experiences.length * 3; // Start after pre-loaded cycles
    }

    // Dynamically append more items for infinite scrolling
    appendMoreItems(count = 1) {
        if (!this.data || !this.data.professional_experience) return;

        const experiences = this.data.professional_experience;
        
        for (let i = 0; i < count; i++) {
            // Cycle through experiences infinitely
            const expIndex = this.cycleIndex % experiences.length;
            const exp = experiences[expIndex];
            
            // Create new item with unique index
            const item = this.createTimelineItem(exp, this.items.length);
            this.content.appendChild(item);
            this.items.push(item);
            
            // Advance cycle index
            this.cycleIndex++;
        }
    }

    createTimelineItem(exp, index) {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.dataset.index = index;

        // Handle assets using SVG icons - ensure uniqueness
        const rawAssets = exp.assets || [];
        const assets = [...new Set(rawAssets)]; // Remove duplicates
        const techHtml = assets.map(asset => {
            const assetKey = typeof asset === 'string' ? asset : asset.name || asset;
            const assetInfo = window.getAssetInfo ? window.getAssetInfo(assetKey) : null;
            
            if (assetInfo && assetInfo.icon) {
                return `<div class="tech-icon" title="${assetInfo.name}">
                    <img src="${assetInfo.icon}" alt="${assetInfo.name}" />
                </div>`;
            } else {
                // Fallback for unknown assets
                return `<div class="tech-icon tech-icon-fallback" title="${assetKey}">
                    <span>${assetKey.charAt(0).toUpperCase()}</span>
                </div>`;
            }
        }).join('');

        const highlightsHtml = exp.highlights ? exp.highlights.map(highlight =>
            `<li class="highlight-item">${highlight}</li>`
        ).join('') : '';

        // Format dates properly
        const dateRange = this.formatDateRange(exp.start_date, exp.end_date);

        item.innerHTML = `
            <div class="timeline-circle"></div>
            <div class="timeline-card">
                <div class="card-header">
                    <div class="card-info">
                        <h3 class="card-title">${exp.company}</h3>
                        <div class="card-company">${exp.role}</div>
                    </div>
                    <div class="card-type">${dateRange}</div>
                </div>

                <div class="card-meta">
                    <div class="card-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${exp.location}</span>
                    </div>
                    <div class="card-role-type">
                        <i class="fas fa-briefcase"></i>
                        <span>${exp.role_type}</span>
                    </div>
                </div>

                <div class="card-highlights">
                    <ul class="highlights-list">
                        ${highlightsHtml}
                    </ul>
                </div>

                <div class="card-technologies">
                    <div class="technologies-icons">
                        ${techHtml}
                    </div>
                </div>
            </div>
        `;


        return item;
    }

    // Calculate circle position along straight line
    calculateLinePosition(circleTop) {
        // Get the actual SVG element to calculate real position
        const svgElement = this.container.querySelector('.timeline-line');
        if (!svgElement) return { x: 0, progress: 0 };

        const svgRect = svgElement.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        const isMobile = window.innerWidth <= 767;

        if (isMobile) {
            // For mobile, position at the mobile timeline line
            const x = 32; // From mobile CSS positioning
            return {
                x: x,
                progress: Math.max(0, Math.min(1, circleTop / this.containerHeight))
            };
        }

        // For desktop/tablet: SVG path is at x=70 in viewBox "0 0 100 100"
        // More precise calculation accounting for SVG positioning
        const lineX = 70; // SVG path x coordinate in viewBox
        const svgWidth = svgRect.width;
        const svgLeft = svgRect.left;
        
        // Calculate the exact pixel position of the line within the SVG
        const linePixelX = (lineX / 100) * svgWidth;
        const absoluteLineX = svgLeft + linePixelX;
        
        // Convert to position relative to timeline container
        const relativeX = absoluteLineX - containerRect.left;

        return {
            x: relativeX,
            progress: Math.max(0, Math.min(1, circleTop / this.containerHeight))
        };
    }

    formatDateRange(startDate, endDate) {
        if (!startDate) return 'Unknown';

        const start = startDate;
        const end = endDate || 'Present';
        return `${start} - ${end}`;
    }

    calculateDimensions() {
        if (this.items.length === 0) return;

        const firstItem = this.items[0];
        const rect = firstItem.getBoundingClientRect();
        this.itemHeight = rect.height + this.gap;
        this.containerHeight = this.container.clientHeight;

        // Ensure we have valid dimensions
        if (this.itemHeight <= 0) {
            this.itemHeight = 400; // Fallback height
        }

        console.log('Timeline dimensions:', {
            itemHeight: this.itemHeight,
            containerHeight: this.containerHeight,
            totalItems: this.items.length,
            gap: this.gap
        });
    }

    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Ensure dimensions are calculated
        this.calculateDimensions();
        
        // Initialize position - cards will naturally move upward like a snake
        this.currentPosition = 0;

        this.animate();
    }

    animate() {
        if (!this.isAnimating) {
            this.animationId = requestAnimationFrame(() => this.animate());
            return;
        }

        const isMobile = window.innerWidth <= 767;

        // Skip animation on mobile - static timeline
        if (isMobile) {
            this.animationId = requestAnimationFrame(() => this.animate());
            return;
        }

        // Only auto-move if user is not scrolling (desktop only)
        if (!this.isUserScrolling) {
            this.currentPosition += this.animationSpeed;

            // Check if we need to append more items for infinite scrolling
            const totalHeight = this.itemHeight * this.items.length;
            const visibleHeight = this.containerHeight;
            const bufferHeight = visibleHeight * 4; // Keep 4 screen heights ahead for smoother rendering
            
            // If we're getting close to the end, append more items
            if (this.currentPosition > totalHeight - bufferHeight) {
                this.appendMoreItems(this.data.professional_experience.length);
                // Force recalculation of dimensions after adding items
                setTimeout(() => this.calculateDimensions(), 50);
            }
        }

        // Always apply transform and update positioning (desktop only)
        this.content.style.transform = `translateY(-${this.currentPosition}px)`;
        this.updateItemPositions();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    updateItemPositions() {
        const isMobile = window.innerWidth <= 767;
        
        // Skip positioning logic on mobile - cards are already positioned by CSS
        if (isMobile) {
            return;
        }
        
        // Adjust spacing based on screen size
        const isTablet = window.innerWidth <= 1023;
        const constantSpacing = isTablet ? 45 : 60;

        this.items.forEach((item, index) => {
            const itemTop = this.itemHeight * index - this.currentPosition;
            const circleTop = itemTop; // Circle is aligned with top of card

            // Calculate line position for circle based on its position
            const linePos = this.calculateLinePosition(circleTop);

            // Update circle position along arc
            const circle = item.querySelector('.timeline-circle');
            const card = item.querySelector('.timeline-card');

            if (circle && card) {
                // Position circle perfectly centered on the line stroke
                const circleSize = 18; // Always expanded size
                const circleRadius = circleSize / 2;
                
                gsap.set(circle, {
                    x: linePos.x - circleRadius,
                    y: '0px'
                });

                // Position card to the left of circle (reflected timeline)
                // Move card further left to avoid overlapping the track
                const cardWidth = window.innerWidth * 0.4; // 40vw
                const extraGap = 120; // Additional gap to clear the track completely
                gsap.set(card, {
                    x: linePos.x - constantSpacing - cardWidth - extraGap,
                    y: '0px'
                });
            }
        });
    }



    // Control methods
    pause() {
        this.isAnimating = false;
    }

    resume() {
        this.isAnimating = true;
    }

    togglePlayPause() {
        if (this.isAnimating) {
            this.pause();
        } else {
            this.resume();
        }
    }
}

// Export for global use
window.Timeline = Timeline;
