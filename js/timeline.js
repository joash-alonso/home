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
        this.animationSpeed = 0.5; // pixels per frame (increased speed)
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

        this.container.addEventListener('touchend', (e) => {
            if (window.innerWidth > 767) {
                this.handleTouchEnd(e);
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

        // Keep within bounds with seamless looping
        const originalItemsCount = this.items.length / 2;
        const maxPosition = this.itemHeight * originalItemsCount;

        if (this.currentPosition < 0) {
            this.currentPosition = maxPosition + this.currentPosition;
        } else if (this.currentPosition >= maxPosition) {
            this.currentPosition = this.currentPosition - maxPosition;
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

        // Keep within bounds
        const originalItemsCount = this.items.length / 2;
        const maxPosition = this.itemHeight * originalItemsCount;

        if (this.currentPosition < 0) {
            this.currentPosition = maxPosition + this.currentPosition;
        } else if (this.currentPosition >= maxPosition) {
            this.currentPosition = this.currentPosition - maxPosition;
        }

        this.touchStartY = touchY;
    }

    handleTouchEnd(e) {
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

        // Show only original items (not duplicates) and expand all cards
        this.items.forEach((item, index) => {
            // Only show first half of items (original experiences, not duplicates)
            if (index < this.items.length / 2) {
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
                // Hide duplicate items on mobile
                item.style.display = 'none';
            }
        });
    }


    setupDesktopMode() {
        // Show all items (including duplicates)
        this.items.forEach(item => {
            item.style.display = 'flex';
            item.classList.remove('centered');

            const highlights = item.querySelector('.card-highlights');
            const card = item.querySelector('.timeline-card');

            if (highlights) {
                highlights.style.maxHeight = '0px';
                highlights.style.opacity = '0';
            }

            if (card) {
                card.style.transform = 'scale(1)';
            }
        });

        // Restart animation
        this.startAnimation();
    }

    createTimelineItems() {
        this.content.innerHTML = '';
        this.items = [];

        if (!this.data || !this.data.professional_experience) return;

        // Create items for each experience
        this.data.professional_experience.forEach((exp, index) => {
            const item = this.createTimelineItem(exp, index);
            this.content.appendChild(item);
            this.items.push(item);
        });

        // Duplicate items for seamless loop
        this.data.professional_experience.forEach((exp, index) => {
            const item = this.createTimelineItem(exp, index + this.data.professional_experience.length);
            this.content.appendChild(item);
            this.items.push(item);
        });
    }

    createTimelineItem(exp, index) {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.dataset.index = index;

        // Handle assets (which might be just strings)
        const assets = exp.assets || [];
        const techHtml = assets.map(asset => {
            // If asset is just a string, try to extract technology name
            const techName = typeof asset === 'string' ?
                asset.replace(/devicon-|-plain|-wordmark|-colored|\.png/g, '').replace(/([A-Z])/g, ' $1').trim() :
                asset.name || asset;

            return `<div class="tech-item">
                <span>${techName}</span>
            </div>`;
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
                    <div class="technologies-grid">
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
        // Scale to actual SVG dimensions
        const lineX = 70; // SVG path x coordinate
        const relativeX = (lineX / 100) * svgRect.width;
        const absoluteX = svgRect.left + relativeX;

        // Convert to position relative to timeline container
        const containerRect = this.container.getBoundingClientRect();
        const x = absoluteX - containerRect.left;

        return {
            x: x,
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

        console.log('Timeline dimensions:', {
            itemHeight: this.itemHeight,
            containerHeight: this.containerHeight,
            totalItems: this.items.length
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

            // Calculate loop point (when we've moved one full set of items)
            const originalItemsCount = this.items.length / 2;
            const maxPosition = this.itemHeight * originalItemsCount;

            // Reset position for seamless loop
            if (this.currentPosition >= maxPosition) {
                this.currentPosition = 0;
            }
        }

        // Always apply transform and check centered items (desktop only)
        this.content.style.transform = `translateY(-${this.currentPosition}px)`;
        this.checkCenteredItem();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    checkCenteredItem() {
        const isMobile = window.innerWidth <= 767;
        
        // Skip positioning logic on mobile - cards are already positioned by CSS
        if (isMobile) {
            return;
        }
        
        const containerHeight = this.containerHeight;
        const expansionZoneTop = containerHeight * 0.10; // 10% from top
        const expansionZoneBottom = containerHeight * 0.90; // 90% from top
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
                // Position circle centered on the line stroke
                // Responsive circle sizes to match CSS
                const isExpanded = item.classList.contains('centered');
                const circleSize = isExpanded ? 18 : 14; // Desktop sizes
                
                gsap.set(circle, {
                    x: linePos.x - (circleSize / 2),
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

            // Get current expansion state
            const isCurrentlyExpanded = item.classList.contains('centered');
            const shouldBeExpanded = circleTop >= expansionZoneTop && circleTop <= expansionZoneBottom;

            // Check if circle is in expansion zone (10% to 90% of screen height)
            if (shouldBeExpanded && !isCurrentlyExpanded) {
                item.classList.add('centered');

                // Use GSAP for smooth expansion
                const highlights = item.querySelector('.card-highlights');

                if (highlights && card) {
                    gsap.to(highlights, {
                        duration: 0.3,
                        maxHeight: '300px',
                        opacity: 1,
                        ease: 'power2.out',
                        onComplete: () => {
                            // Recalculate dimensions after expansion on mobile
                            if (window.innerWidth <= 767) {
                                setTimeout(() => this.calculateDimensions(), 100);
                            }
                        }
                    });

                    gsap.to(card, {
                        duration: 0.3,
                        scale: 1.05,
                        ease: 'power2.out'
                    });
                }
            } else if (!shouldBeExpanded && isCurrentlyExpanded) {
                item.classList.remove('centered');

                // Use GSAP for smooth collapse
                const highlights = item.querySelector('.card-highlights');

                if (highlights && card) {
                    gsap.to(highlights, {
                        duration: 0.2,
                        maxHeight: '0px',
                        opacity: 0,
                        ease: 'power2.in',
                        onComplete: () => {
                            // Recalculate dimensions after collapse on mobile
                            if (window.innerWidth <= 767) {
                                setTimeout(() => this.calculateDimensions(), 100);
                            }
                        }
                    });

                    gsap.to(card, {
                        duration: 0.2,
                        scale: 1,
                        ease: 'power2.in'
                    });
                }
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
