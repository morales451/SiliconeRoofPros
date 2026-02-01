/**
 * Exit Intent Popup
 * Captures visitors about to leave with a "Wait! Get your free quote" offer
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        cookieName: 'exitIntentShown',
        cookieDays: 7,           // Don't show again for 7 days after dismissal
        delayBeforeEnable: 5000, // Wait 5 seconds before enabling exit detection
        sensitivity: 20          // Mouse must be within 20px of top to trigger
    };

    let isEnabled = false;
    let hasShown = false;

    // Check if we should show the popup (not shown recently)
    function shouldShowPopup() {
        // Don't show on thank-you pages
        if (window.location.pathname.includes('thank-you')) {
            return false;
        }

        // Check cookie
        const cookie = getCookie(CONFIG.cookieName);
        return !cookie;
    }

    // Cookie helpers
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
    }

    function getCookie(name) {
        const nameEQ = name + '=';
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    }

    // Create and inject the popup HTML
    function createPopup() {
        const popupHTML = `
            <div class="exit-intent-popup" id="exit-intent-popup">
                <div class="exit-intent-backdrop"></div>
                <div class="exit-intent-content">
                    <div class="exit-intent-header">
                        <button class="exit-intent-close" id="exit-intent-close" aria-label="Close popup">&times;</button>
                        <span class="exit-intent-badge">Before You Go!</span>
                        <h2>Wait! Get Your Free Quote</h2>
                        <p>Don't miss out on saving thousands on your roof</p>
                    </div>
                    <div class="exit-intent-body">
                        <div class="exit-intent-benefits">
                            <div class="exit-benefit">
                                <div class="exit-benefit-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span class="exit-benefit-text"><strong>Save 50-70%</strong> compared to full roof replacement</span>
                            </div>
                            <div class="exit-benefit">
                                <div class="exit-benefit-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span class="exit-benefit-text"><strong>Free estimate</strong> within 60 minutes</span>
                            </div>
                            <div class="exit-benefit">
                                <div class="exit-benefit-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <span class="exit-benefit-text"><strong>20-year warranty</strong> on all coatings</span>
                            </div>
                        </div>
                        <form class="exit-intent-form" name="exit-intent-quote" method="POST" action="/thank-you.html" data-netlify="true" netlify-honeypot="bot-field">
                            <input type="hidden" name="form-name" value="exit-intent-quote">
                            <p class="hidden" style="display:none;"><label>Don't fill this out: <input name="bot-field"></label></p>
                            <div class="form-group">
                                <label for="exit-name">Your Name *</label>
                                <input type="text" id="exit-name" name="name" placeholder="John Smith" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="exit-email">Email *</label>
                                    <input type="email" id="exit-email" name="email" placeholder="john@email.com" required>
                                </div>
                                <div class="form-group">
                                    <label for="exit-phone">Phone *</label>
                                    <input type="tel" id="exit-phone" name="phone" placeholder="(555) 123-4567" required>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary btn-lg">Get My Free Quote Now</button>
                            <p class="exit-intent-note">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Your information is secure and will never be shared
                            </p>
                        </form>
                        <button class="exit-intent-skip" id="exit-intent-skip">No thanks, I'll pass on the savings</button>
                    </div>
                </div>
            </div>
        `;

        // Insert into body
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }

    // Show the popup
    function showPopup() {
        if (hasShown) return;
        hasShown = true;

        const popup = document.getElementById('exit-intent-popup');
        if (popup) {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus the first input for accessibility
            setTimeout(function() {
                const firstInput = popup.querySelector('input[type="text"]');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    // Hide the popup
    function hidePopup(setCookieFlag) {
        const popup = document.getElementById('exit-intent-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = '';

            if (setCookieFlag !== false) {
                setCookie(CONFIG.cookieName, 'true', CONFIG.cookieDays);
            }
        }
    }

    // Exit intent detection
    function handleMouseLeave(e) {
        if (!isEnabled || hasShown) return;

        // Only trigger when mouse leaves from the top of the page
        if (e.clientY <= CONFIG.sensitivity) {
            showPopup();
        }
    }

    // Mobile detection - show on back button or after scroll up
    function handleMobileExitIntent() {
        let lastScrollTop = 0;
        let scrollUpCount = 0;

        window.addEventListener('scroll', function() {
            if (!isEnabled || hasShown) return;

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Detect quick scroll up (potential exit behavior on mobile)
            if (scrollTop < lastScrollTop && scrollTop < 100) {
                scrollUpCount++;
                if (scrollUpCount >= 3) {
                    showPopup();
                }
            } else {
                scrollUpCount = 0;
            }

            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    // Initialize event listeners
    function initEventListeners() {
        // Close button
        document.addEventListener('click', function(e) {
            if (e.target.id === 'exit-intent-close' || e.target.id === 'exit-intent-skip') {
                hidePopup();
            }
        });

        // Backdrop click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('exit-intent-backdrop')) {
                hidePopup();
            }
        });

        // Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hidePopup();
            }
        });

        // Exit intent detection (desktop)
        document.addEventListener('mouseleave', handleMouseLeave);

        // Mobile exit intent
        if ('ontouchstart' in window) {
            handleMobileExitIntent();
        }
    }

    // Initialize
    function init() {
        if (!shouldShowPopup()) return;

        // Create the popup
        createPopup();

        // Set up event listeners
        initEventListeners();

        // Enable exit detection after delay
        setTimeout(function() {
            isEnabled = true;
        }, CONFIG.delayBeforeEnable);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
