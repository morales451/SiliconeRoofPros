/**
 * Silicone Roof Pros - Hero Map Functionality
 * Google Maps integration with polygon drawing for instant roof measurement
 */

(function() {
    'use strict';

    // Pricing constants
    const PRICE_PER_SQFT_LOW = 3.50;
    const PRICE_PER_SQFT_HIGH = 5.00;

    // State
    let map = null;
    let marker = null;
    let autocomplete = null;
    let geocoder = null;
    let drawingManager = null;
    let roofPolygon = null;
    let roofAreaSqFt = 0;
    let currentLocation = null;
    let currentAddress = null;

    // Default center (Houston, TX)
    const DEFAULT_CENTER = { lat: 29.7604, lng: -95.3698 };
    const PROPERTY_ZOOM = 19;

    /**
     * Initialize Google Map for Hero Section
     * Called by Google Maps API callback
     */
    window.initHeroMap = function() {
        const mapElement = document.getElementById('hero-map');
        if (!mapElement) return;

        // Initialize Geocoder
        geocoder = new google.maps.Geocoder();

        // Initialize Map
        map = new google.maps.Map(mapElement, {
            center: DEFAULT_CENTER,
            zoom: 10,
            mapTypeId: 'satellite',
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            }
        });

        // Initialize Drawing Manager
        // google.maps.drawing.DrawingManager was removed from the Maps JS API (v3.65);
        // constructing it now throws and aborted the rest of this setup.
        drawingManager = window.createPolygonDrawer({
            drawingMode: null,
            drawingControl: false,
            polygonOptions: {
                fillColor: '#f4a21c',
                fillOpacity: 0.28,
                strokeColor: '#f4a21c',
                strokeWeight: 3,
                editable: true,
                draggable: true
            }
        });
        drawingManager.setMap(map);

        // Initialize Autocomplete
        const addressInput = document.getElementById('hero-address-input');
        if (addressInput) {
            autocomplete = new google.maps.places.Autocomplete(addressInput, {
                componentRestrictions: { country: 'us' },
                fields: ['formatted_address', 'geometry', 'name'],
                types: ['address']
            });

            autocomplete.addListener('place_changed', handlePlaceSelect);
        }

        // Map click listener (only when not drawing)
        map.addListener('click', handleMapClick);

        // Drawing complete listener
        google.maps.event.addListener(drawingManager, 'polygoncomplete', handlePolygonComplete);

        // Search button
        const searchBtn = document.getElementById('hero-search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', handleSearchClick);
        }

        // Enter key on address input
        if (addressInput) {
            addressInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchClick();
                }
            });
        }

        // Drawing controls
        const drawRoofBtn = document.getElementById('hero-draw-roof-btn');
        if (drawRoofBtn) {
            drawRoofBtn.addEventListener('click', startDrawing);
        }

        const clearDrawingBtn = document.getElementById('hero-clear-drawing-btn');
        if (clearDrawingBtn) {
            clearDrawingBtn.addEventListener('click', clearDrawing);
        }

        // Skip drawing link - opens quote modal directly
        const skipDrawingBtn = document.getElementById('hero-skip-drawing-btn');
        if (skipDrawingBtn) {
            skipDrawingBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openQuoteModal();
            });
        }

        // Get estimate button
        const getEstimateBtn = document.getElementById('hero-get-estimate-btn');
        if (getEstimateBtn) {
            getEstimateBtn.addEventListener('click', openEstimateModal);
        }

        // Legacy: Get Quote button (for backwards compatibility)
        const getQuoteBtn = document.getElementById('hero-get-quote-btn');
        if (getQuoteBtn) {
            getQuoteBtn.addEventListener('click', openQuoteModal);
        }

        // Modal handlers
        initModal();
        initEstimateModal();
    };

    /**
     * Handle place selection from autocomplete
     */
    function handlePlaceSelect() {
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
            showNotification('Please select an address from the dropdown', 'error');
            return;
        }

        const location = place.geometry.location;
        const address = place.formatted_address;

        goToLocation(location, address);
    }

    /**
     * Handle search button click
     */
    function handleSearchClick() {
        const addressInput = document.getElementById('hero-address-input');
        const address = addressInput.value.trim();

        if (!address) {
            showNotification('Please enter an address', 'error');
            addressInput.focus();
            return;
        }

        // Show loading state
        const searchBtn = document.getElementById('hero-search-btn');
        const originalText = searchBtn.innerHTML;
        searchBtn.innerHTML = '<span>Searching...</span>';
        searchBtn.disabled = true;

        // Use Geocoder to find address
        geocoder.geocode({ address: address }, function(results, status) {
            searchBtn.innerHTML = originalText;
            searchBtn.disabled = false;

            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                const formattedAddress = results[0].formatted_address;

                addressInput.value = formattedAddress;
                goToLocation(location, formattedAddress);
            } else {
                showNotification('Address not found. Please try again.', 'error');
            }
        });
    }

    /**
     * Handle map click to drop/move pin
     */
    function handleMapClick(event) {
        // Don't handle clicks if drawing mode is active
        if (drawingManager && drawingManager.getDrawingMode() !== null) {
            return;
        }

        const location = event.latLng;

        geocoder.geocode({ location: location }, function(results, status) {
            let address = 'Selected location';

            if (status === 'OK' && results[0]) {
                address = results[0].formatted_address;
                document.getElementById('hero-address-input').value = address;
            }

            placeMarker(location, address);
            updatePinInfo(location, address);
            showDrawingControls();
        });
    }

    /**
     * Go to a specific location on the map
     */
    function goToLocation(location, address) {
        // Hide overlay
        const overlay = document.getElementById('hero-map-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }

        // Center and zoom map
        map.setCenter(location);
        map.setZoom(PROPERTY_ZOOM);

        // Place marker
        placeMarker(location, address);

        // Update pin info
        updatePinInfo(location, address);

        // Show drawing controls
        showDrawingControls();

        // Show notification
        showNotification('Property found! Click "Draw Roof Outline" to get your instant estimate.', 'success');
    }

    /**
     * Place or move marker on map
     */
    function placeMarker(location, title) {
        // Remove existing marker
        if (marker) {
            marker.setMap(null);
        }

        // Create new marker
        marker = new google.maps.Marker({
            position: location,
            map: map,
            title: title,
            draggable: true,
            animation: google.maps.Animation.DROP,
            icon: {
                url: 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
                        </filter>
                        <path d="M24 0C10.745 0 0 10.745 0 24c0 16.8 24 32 24 32s24-15.2 24-32C48 10.745 37.255 0 24 0z" fill="#f4a21c" filter="url(#shadow)"/>
                        <circle cx="24" cy="22" r="10" fill="white"/>
                        <circle cx="24" cy="22" r="5" fill="#f4a21c"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(48, 56),
                anchor: new google.maps.Point(24, 56)
            }
        });

        // Marker drag listener
        marker.addListener('dragend', function() {
            const newLocation = marker.getPosition();

            geocoder.geocode({ location: newLocation }, function(results, status) {
                let address = 'Selected location';

                if (status === 'OK' && results[0]) {
                    address = results[0].formatted_address;
                    document.getElementById('hero-address-input').value = address;
                }

                updatePinInfo(newLocation, address);
            });
        });
    }

    /**
     * Update pin confirmation info
     */
    function updatePinInfo(location, address) {
        currentLocation = location;
        currentAddress = address;

        const pinInfo = document.getElementById('hero-pin-info');
        const pinAddress = document.getElementById('hero-pin-address');

        if (pinInfo) {
            pinInfo.style.display = 'flex';
        }
        if (pinAddress) {
            pinAddress.textContent = address;
        }
    }

    /**
     * Show drawing controls
     */
    function showDrawingControls() {
        const drawingControls = document.getElementById('hero-drawing-controls');
        if (drawingControls) {
            drawingControls.style.display = 'flex';
        }
    }

    /**
     * Start drawing mode
     */
    function startDrawing() {
        // Clear existing polygon if any
        if (roofPolygon) {
            roofPolygon.setMap(null);
            roofPolygon = null;
        }

        // Hide measurement display
        const measurement = document.getElementById('hero-measurement');
        if (measurement) {
            measurement.style.display = 'none';
        }

        // Set drawing mode
        drawingManager.setDrawingMode('polygon');

        // Update UI
        const drawRoofBtn = document.getElementById('hero-draw-roof-btn');
        const clearDrawingBtn = document.getElementById('hero-clear-drawing-btn');
        const drawingHint = document.getElementById('hero-drawing-hint');

        if (drawRoofBtn) drawRoofBtn.style.display = 'none';
        if (clearDrawingBtn) clearDrawingBtn.style.display = 'inline-flex';
        if (drawingHint) {
            drawingHint.textContent = 'Tap or click each corner of your roof, then tap the first corner again to finish.';
            drawingHint.classList.add('active');
        }

        showNotification('Drawing mode active. Click to place points around your roof.', 'success');
    }

    /**
     * Clear drawing and reset
     */
    function clearDrawing() {
        // Remove polygon
        if (roofPolygon) {
            roofPolygon.setMap(null);
            roofPolygon = null;
        }

        // Reset area
        roofAreaSqFt = 0;
        updateHud(0);

        // Hide measurement display
        const measurement = document.getElementById('hero-measurement');
        if (measurement) {
            measurement.style.display = 'none';
        }

        // Reset drawing mode
        drawingManager.setDrawingMode(null);

        // Update UI
        const drawRoofBtn = document.getElementById('hero-draw-roof-btn');
        const clearDrawingBtn = document.getElementById('hero-clear-drawing-btn');
        const drawingHint = document.getElementById('hero-drawing-hint');

        if (drawRoofBtn) drawRoofBtn.style.display = 'inline-flex';
        if (clearDrawingBtn) clearDrawingBtn.style.display = 'none';
        if (drawingHint) {
            drawingHint.textContent = 'Tap or click each corner of your roof to outline it';
            drawingHint.classList.remove('active');
        }
    }

    /**
     * Handle polygon drawing complete
     */
    function handlePolygonComplete(polygon) {
        // Store the polygon
        roofPolygon = polygon;

        // Stop drawing mode
        drawingManager.setDrawingMode(null);

        // Calculate area
        calculateAndDisplayArea();

        // Update UI
        const drawRoofBtn = document.getElementById('hero-draw-roof-btn');
        const clearDrawingBtn = document.getElementById('hero-clear-drawing-btn');
        const drawingHint = document.getElementById('hero-drawing-hint');

        if (drawRoofBtn) drawRoofBtn.style.display = 'none';
        if (clearDrawingBtn) clearDrawingBtn.style.display = 'inline-flex';
        if (drawingHint) {
            drawingHint.textContent = 'Roof outlined! Drag corners to adjust.';
        }

        // Add listeners for polygon edits
        google.maps.event.addListener(polygon.getPath(), 'set_at', calculateAndDisplayArea);
        google.maps.event.addListener(polygon.getPath(), 'insert_at', calculateAndDisplayArea);
        google.maps.event.addListener(polygon, 'dragend', calculateAndDisplayArea);
    }

    /**
     * Calculate area and display results
     */
    /**
     * Survey readout on the map frame: measured area and the
     * $3.50-$5.00/sq ft silicone range. Dashes until a roof is outlined.
     */
    function updateHud(sqft) {
        const area = document.getElementById('hero-hud-area');
        const est = document.getElementById('hero-hud-est');
        const hud = document.getElementById('hero-hud');
        if (!area || !est) return;
        if (!sqft) {
            area.textContent = '\u2014';
            est.textContent = '\u2014';
            if (hud) hud.classList.remove('is-measured');
            return;
        }
        const k = (n) => '$' + Math.round(n / 1000).toLocaleString() + 'k';
        area.textContent = sqft.toLocaleString();
        est.textContent = k(sqft * 3.5) + '\u2013' + k(sqft * 5);
        if (hud) hud.classList.add('is-measured');
    }

    function calculateAndDisplayArea() {
        if (!roofPolygon) return;

        // Calculate area in square meters
        const areaSquareMeters = google.maps.geometry.spherical.computeArea(roofPolygon.getPath());

        // Convert to square feet
        roofAreaSqFt = Math.round(areaSquareMeters * 10.7639);

        // Update display
        const sqftDisplay = document.getElementById('hero-roof-sqft');
        if (sqftDisplay) {
            sqftDisplay.textContent = roofAreaSqFt.toLocaleString();
        }

        // Show measurement display
        const measurement = document.getElementById('hero-measurement');
        if (measurement) {
            measurement.style.display = 'flex';
        }
        updateHud(roofAreaSqFt);

        showNotification(`Roof measured: ${roofAreaSqFt.toLocaleString()} sq ft. Click "Get My Price Estimate"!`, 'success');
    }

    /**
     * Initialize Estimate Modal
     */
    function initEstimateModal() {
        const modal = document.getElementById('hero-estimate-modal');
        const closeBtn = document.getElementById('hero-estimate-modal-close');
        const backdrop = document.getElementById('hero-estimate-modal-backdrop');
        const form = document.getElementById('hero-estimate-contact-form');
        const closeEstimateBtn = document.getElementById('hero-close-estimate');
        const phoneInput = document.getElementById('hero-estimate-phone');

        if (closeBtn) {
            closeBtn.addEventListener('click', closeEstimateModal);
        }
        if (backdrop) {
            backdrop.addEventListener('click', closeEstimateModal);
        }
        if (closeEstimateBtn) {
            closeEstimateBtn.addEventListener('click', closeEstimateModal);
        }
        if (form) {
            form.addEventListener('submit', handleEstimateFormSubmit);
        }
        if (phoneInput) {
            phoneInput.addEventListener('input', formatPhoneNumber);
        }

        // Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeEstimateModal();
            }
        });
    }

    /**
     * Open Estimate Modal
     */
    function openEstimateModal() {
        if (!roofAreaSqFt || roofAreaSqFt === 0) {
            showNotification('Please draw your roof outline first.', 'error');
            return;
        }

        const modal = document.getElementById('hero-estimate-modal');
        const modalSqft = document.getElementById('hero-modal-sqft');
        const stepContact = document.getElementById('hero-estimate-step-contact');
        const stepResult = document.getElementById('hero-estimate-step-result');

        // The measured range is shown openly; the form only requests the written quote
        const money = (n) => '$' + Math.round(n).toLocaleString();
        if (modalSqft) modalSqft.textContent = roofAreaSqFt.toLocaleString();
        const estimateLow = document.getElementById('hero-estimate-low');
        const estimateHigh = document.getElementById('hero-estimate-high');
        const resultAddress = document.getElementById('hero-result-address');
        if (estimateLow) estimateLow.textContent = money(roofAreaSqFt * PRICE_PER_SQFT_LOW);
        if (estimateHigh) estimateHigh.textContent = money(roofAreaSqFt * PRICE_PER_SQFT_HIGH);
        if (resultAddress) resultAddress.textContent = currentAddress || 'Property location';

        // Reset to contact step
        if (stepContact) stepContact.style.display = 'block';
        if (stepResult) stepResult.style.display = 'none';

        // Show modal
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Focus first input
        const nameInput = document.getElementById('hero-estimate-name');
        if (nameInput) {
            setTimeout(() => nameInput.focus(), 100);
        }
    }

    /**
     * Close Estimate Modal
     */
    function closeEstimateModal() {
        const modal = document.getElementById('hero-estimate-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Handle estimate form submission
     */
    function handleEstimateFormSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('hero-estimate-name').value.trim();
        const email = document.getElementById('hero-estimate-email').value.trim();
        const phone = document.getElementById('hero-estimate-phone').value.trim();

        if (!name || !email || !phone) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        const lowEstimate = roofAreaSqFt * PRICE_PER_SQFT_LOW;
        const highEstimate = roofAreaSqFt * PRICE_PER_SQFT_HIGH;

        const resultSqft = document.getElementById('hero-result-sqft');
        if (resultSqft) resultSqft.textContent = roofAreaSqFt.toLocaleString();

        // Switch to the confirmation step
        const stepContact = document.getElementById('hero-estimate-step-contact');
        const stepResult = document.getElementById('hero-estimate-step-result');
        if (stepContact) stepContact.style.display = 'none';
        if (stepResult) stepResult.style.display = 'block';
        const doneBtn = document.getElementById('hero-close-estimate');
        if (doneBtn) doneBtn.focus();

        // Submit lead to Netlify
        submitLeadToNetlify(name, email, phone, roofAreaSqFt, lowEstimate, highEstimate);
    }

    /**
     * Submit lead data to Netlify
     */
    function submitLeadToNetlify(name, email, phone, sqft, lowEstimate, highEstimate) {
        const formData = new FormData();
        formData.append('form-name', 'instant-estimate-home');
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('roof-sqft', sqft);
        formData.append('estimate-low', lowEstimate.toFixed(2));
        formData.append('estimate-high', highEstimate.toFixed(2));
        formData.append('property-address', currentAddress || '');
        formData.append('latitude', currentLocation ? currentLocation.lat() : '');
        formData.append('longitude', currentLocation ? currentLocation.lng() : '');

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        }).catch(err => console.log('Background form submission:', err));
    }

    /**
     * Format phone number as user types
     */
    function formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 10) {
            value = value.slice(0, 10);
        }

        if (value.length >= 6) {
            value = '(' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6);
        } else if (value.length >= 3) {
            value = '(' + value.slice(0, 3) + ') ' + value.slice(3);
        } else if (value.length > 0) {
            value = '(' + value;
        }

        e.target.value = value;
    }

    /**
     * Initialize Modal (Legacy quote modal)
     */
    function initModal() {
        const modal = document.getElementById('quote-modal');
        const closeBtn = document.getElementById('modal-close');
        const backdrop = modal ? modal.querySelector('.quote-modal-backdrop') : null;
        const form = document.getElementById('modal-quote-form');

        if (closeBtn) {
            closeBtn.addEventListener('click', closeQuoteModal);
        }

        if (backdrop) {
            backdrop.addEventListener('click', closeQuoteModal);
        }

        // Close on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeQuoteModal();
            }
        });

        // Form submission
        if (form) {
            form.addEventListener('submit', function(e) {
                // Populate hidden fields
                if (currentLocation) {
                    document.getElementById('modal-latitude').value = currentLocation.lat();
                    document.getElementById('modal-longitude').value = currentLocation.lng();
                }
                if (currentAddress) {
                    document.getElementById('modal-address').value = currentAddress;
                }
            });
        }
    }

    // "Send us your address" links in the map-unavailable message open the
    // quote form with the typed address carried over, instead of a new page.
    document.addEventListener('click', function(e) {
        const link = e.target.closest && e.target.closest('[data-open-quote]');
        if (!link) return;
        e.preventDefault();
        openQuoteModal();
    });

    /**
     * Open Quote Modal
     */
    function openQuoteModal() {
        const modal = document.getElementById('quote-modal');
        // Carry over whatever address the visitor already typed or picked
        const addressField = document.getElementById('modal-address');
        const typed = document.getElementById('hero-address-input');
        if (addressField && !addressField.value) {
            addressField.value = currentAddress || (typed ? typed.value.trim() : '');
        }
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus first input
            setTimeout(function() {
                const firstInput = modal.querySelector('input[type="text"]');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    /**
     * Close Quote Modal
     */
    function closeQuoteModal() {
        const modal = document.getElementById('quote-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Show notification message
     */
    function showNotification(message, type) {
        // Remove existing
        const existing = document.querySelector('.hero-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `hero-notification hero-notification-${type}`;
        notification.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'error'
                    ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
                    : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
                }
            </svg>
            <span>${message}</span>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#fef2f2' : '#ecfdf5'};
            border: 1px solid ${type === 'error' ? '#fecaca' : '#a7f3d0'};
            color: ${type === 'error' ? '#dc2626' : '#065f46'};
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            z-index: 9999;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            animation: slideDown 0.3s ease;
            max-width: 90%;
            text-align: center;
        `;

        notification.querySelector('svg').style.cssText = 'width: 20px; height: 20px; flex-shrink: 0;';

        // Add keyframes
        if (!document.getElementById('hero-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'hero-notification-styles';
            style.textContent = `
                @keyframes slideDown {
                    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(function() {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(function() { notification.remove(); }, 300);
        }, 4000);
    }

    /**
     * Fallback for when Google Maps API fails
     */
    function initFallback() {
        const overlay = document.getElementById('hero-map-overlay');
        if (!overlay || typeof google !== 'undefined') return;
        // The inline loader in the page may already have reported a specific
        // reason (rejected key, missing key). Don't overwrite a better message.
        if (overlay.getAttribute('data-map-failed')) return;
        // "slow" (not "1"): the script may still arrive on a slow connection,
        // and showLiveMapHint() restores the live map if it does.
        overlay.setAttribute('data-map-failed', 'slow');
        overlay.setAttribute('data-placeholder-html', overlay.innerHTML);
        // Previously this said "Map Loading..." and never changed, so a failed
        // map looked like a slow one forever. Say what happened and give the
        // visitor a way through instead.
        overlay.innerHTML = `
            <div class="map-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p><strong>Map Unavailable</strong></p>
                <p style="font-size: 0.8rem; margin-top: 0.5rem;">
                    We can still measure your roof from satellite &mdash;
                    <a href="#satellite-quote" data-open-quote>send us your address</a>
                    or call Texas <a href="tel:8323033183">(832) 303-3183</a> &middot; Pennsylvania <a href="tel:4844018586">(484) 401-8586</a>.
                </p>
            </div>
        `;
    }

    // Give Google Maps a generous window on slow mobile connections before
    // telling the visitor it is unavailable (and recover if it arrives later).
    setTimeout(initFallback, 12000);

    /**
     * Initialize Service Area Map
     */
    window.initServiceAreaMap = function() {
        const mapElement = document.getElementById('service-area-map');
        if (!mapElement || typeof google === 'undefined') return;

        // Houston center
        const houstonCenter = { lat: 29.7604, lng: -95.3698 };

        const serviceMap = new google.maps.Map(mapElement, {
            center: houstonCenter,
            zoom: 9,
            mapTypeId: 'roadmap',
            styles: [
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
                },
                {
                    featureType: 'landscape',
                    elementType: 'geometry',
                    stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.fill',
                    stylers: [{ color: '#ffffff' }, { lightness: 17 }]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }]
                },
                {
                    featureType: 'poi',
                    elementType: 'geometry',
                    stylers: [{ color: '#f5f5f5' }, { lightness: 21 }]
                }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
        });

        // Service area locations
        const serviceAreas = [
            { name: 'Houston', lat: 29.7604, lng: -95.3698 },
            { name: 'The Woodlands', lat: 30.1658, lng: -95.4613 },
            { name: 'Sugar Land', lat: 29.6197, lng: -95.6349 },
            { name: 'Katy', lat: 29.7858, lng: -95.8245 },
            { name: 'Pearland', lat: 29.5636, lng: -95.2860 },
            { name: 'Cypress', lat: 29.9691, lng: -95.6970 },
            { name: 'Spring', lat: 30.0799, lng: -95.4172 },
            { name: 'League City', lat: 29.5075, lng: -95.0950 },
            { name: 'Conroe', lat: 30.3119, lng: -95.4561 },
            { name: 'Pasadena', lat: 29.6911, lng: -95.2091 },
            { name: 'Baytown', lat: 29.7355, lng: -94.9774 },
            { name: 'Missouri City', lat: 29.6186, lng: -95.5377 }
        ];

        // Add markers for each service area
        serviceAreas.forEach(function(area) {
            new google.maps.Marker({
                position: { lat: area.lat, lng: area.lng },
                map: serviceMap,
                title: area.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#f4a21c',
                    fillOpacity: 0.9,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                }
            });
        });

        // Draw service area circle
        new google.maps.Circle({
            strokeColor: '#f4a21c',
            strokeOpacity: 0.3,
            strokeWeight: 2,
            fillColor: '#f4a21c',
            fillOpacity: 0.1,
            map: serviceMap,
            center: houstonCenter,
            radius: 80000 // 80km radius
        });
    };


    /**
     * Once the live map exists, swap the placeholder picture for the real
     * satellite view and keep only a small instruction label on top.
     * Skipped if an address was already chosen (overlay hidden) or the map
     * failed (data-map-failed), so neither state is overwritten.
     */
    function showLiveMapHint(overlayId) {
        const overlay = document.getElementById(overlayId);
        if (!overlay) return;
        // The timeout fallback gave up too early: the map has now loaded, so undo it.
        if (overlay.getAttribute('data-map-failed') === 'slow') {
            overlay.innerHTML = overlay.getAttribute('data-placeholder-html') || overlay.innerHTML;
            overlay.removeAttribute('data-map-failed');
            overlay.removeAttribute('data-placeholder-html');
        }
        if (overlay.classList.contains('hidden') || overlay.getAttribute('data-map-failed')) return;
        const text = overlay.querySelector('p');
        if (text) text.textContent = 'Type your address above to zoom to your roof';
        overlay.classList.add('is-live');
    }

    // Initialize service area map after hero map loads
    var originalInitHeroMap = window.initHeroMap;
    window.initHeroMap = function() {
        originalInitHeroMap();
        showLiveMapHint('hero-map-overlay');
        setTimeout(window.initServiceAreaMap, 500);
    };

})();
