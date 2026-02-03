/**
 * Silicone Roof Pros - Quote Map Functionality
 * Google Maps integration with polygon drawing for roof measurement
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

    // Default center (Houston, TX)
    const DEFAULT_CENTER = { lat: 29.7604, lng: -95.3698 };
    const DEFAULT_ZOOM = 10;
    const PROPERTY_ZOOM = 19;

    // DOM Elements
    const addressInput = document.getElementById('address-input');
    const searchBtn = document.getElementById('search-btn');
    const mapOverlay = document.getElementById('map-overlay');
    const pinInfo = document.getElementById('pin-info');
    const pinAddress = document.getElementById('pin-address');
    const propertyAddressInput = document.getElementById('property-address');
    const formLatitude = document.getElementById('form-latitude');
    const formLongitude = document.getElementById('form-longitude');
    const formFormattedAddress = document.getElementById('form-formatted-address');
    const formRoofSqft = document.getElementById('form-roof-sqft');
    const formEstimateLow = document.getElementById('form-estimate-low');
    const formEstimateHigh = document.getElementById('form-estimate-high');
    const quoteForm = document.getElementById('quote-form');

    // Drawing controls
    const drawingControls = document.getElementById('drawing-controls');
    const drawRoofBtn = document.getElementById('draw-roof-btn');
    const clearDrawingBtn = document.getElementById('clear-drawing-btn');
    const drawingHint = document.getElementById('drawing-hint');

    // Measurement display
    const measurementDisplay = document.getElementById('measurement-display');
    const roofSqftDisplay = document.getElementById('roof-sqft');
    const getEstimateBtn = document.getElementById('get-estimate-btn');

    // Estimate modal
    const estimateModal = document.getElementById('estimate-modal');
    const estimateModalBackdrop = document.getElementById('estimate-modal-backdrop');
    const estimateModalClose = document.getElementById('estimate-modal-close');
    const estimateContactForm = document.getElementById('estimate-contact-form');
    const estimateStepContact = document.getElementById('estimate-step-contact');
    const estimateStepResult = document.getElementById('estimate-step-result');
    const modalSqft = document.getElementById('modal-sqft');
    const resultSqft = document.getElementById('result-sqft');
    const resultAddress = document.getElementById('result-address');
    const estimateLow = document.getElementById('estimate-low');
    const estimateHigh = document.getElementById('estimate-high');
    const requestExactQuote = document.getElementById('request-exact-quote');
    const closeEstimate = document.getElementById('close-estimate');

    // Phone input in modal
    const estimatePhone = document.getElementById('estimate-phone');

    /**
     * Initialize Google Map
     * Called by Google Maps API callback
     */
    window.initMap = function() {
        // Initialize Geocoder
        geocoder = new google.maps.Geocoder();

        // Initialize Map
        map = new google.maps.Map(document.getElementById('map'), {
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            mapTypeId: 'satellite',
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT,
                mapTypeIds: ['satellite', 'hybrid', 'roadmap']
            },
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true
        });

        // Initialize Places Autocomplete
        autocomplete = new google.maps.places.Autocomplete(addressInput, {
            componentRestrictions: { country: 'us' },
            fields: ['formatted_address', 'geometry', 'name'],
            types: ['address']
        });

        // Initialize Drawing Manager
        drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: false, // We use custom controls
            polygonOptions: {
                fillColor: '#0088df',
                fillOpacity: 0.35,
                strokeColor: '#0088df',
                strokeWeight: 3,
                editable: true,
                draggable: true
            }
        });
        drawingManager.setMap(map);

        // Autocomplete listener
        autocomplete.addListener('place_changed', handlePlaceSelect);

        // Map click listener for dropping pin (only when not drawing)
        map.addListener('click', handleMapClick);

        // Drawing complete listener
        google.maps.event.addListener(drawingManager, 'polygoncomplete', handlePolygonComplete);

        // Search button click
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

        // Draw roof button
        if (drawRoofBtn) {
            drawRoofBtn.addEventListener('click', startDrawing);
        }

        // Clear drawing button
        if (clearDrawingBtn) {
            clearDrawingBtn.addEventListener('click', clearDrawing);
        }

        // Get estimate button
        if (getEstimateBtn) {
            getEstimateBtn.addEventListener('click', openEstimateModal);
        }

        // Modal interactions
        if (estimateModalBackdrop) {
            estimateModalBackdrop.addEventListener('click', closeEstimateModal);
        }
        if (estimateModalClose) {
            estimateModalClose.addEventListener('click', closeEstimateModal);
        }
        if (closeEstimate) {
            closeEstimate.addEventListener('click', closeEstimateModal);
        }

        // Estimate contact form submission
        if (estimateContactForm) {
            estimateContactForm.addEventListener('submit', handleEstimateFormSubmit);
        }

        // Request exact quote button
        if (requestExactQuote) {
            requestExactQuote.addEventListener('click', handleRequestExactQuote);
        }

        // Form submission validation
        if (quoteForm) {
            quoteForm.addEventListener('submit', handleFormSubmit);
        }

        // Phone masking for modal
        if (estimatePhone) {
            estimatePhone.addEventListener('input', formatPhoneNumber);
        }

        // Escape key closes modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && estimateModal.classList.contains('active')) {
                closeEstimateModal();
            }
        });
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

        // Center map on location
        goToLocation(location, address);
    }

    /**
     * Handle search button click
     */
    function handleSearchClick() {
        const address = addressInput.value.trim();

        if (!address) {
            showNotification('Please enter an address', 'error');
            return;
        }

        // Use Geocoder to find address
        geocoder.geocode({ address: address }, function(results, status) {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                const formattedAddress = results[0].formatted_address;

                // Update input with formatted address
                addressInput.value = formattedAddress;

                // Go to location
                goToLocation(location, formattedAddress);
            } else {
                showNotification('Address not found. Please try again.', 'error');
            }
        });
    }

    /**
     * Go to a specific location on the map
     */
    function goToLocation(location, address) {
        // Hide overlay
        if (mapOverlay) {
            mapOverlay.classList.add('hidden');
        }

        // Show drawing controls
        if (drawingControls) {
            drawingControls.style.display = 'flex';
        }

        // Center and zoom map
        map.setCenter(location);
        map.setZoom(PROPERTY_ZOOM);

        // Place marker
        placeMarker(location, address);

        // Update form fields
        updateFormFields(location, address);

        // Show notification about drawing
        showNotification('Property found! Click "Draw Roof Outline" to measure your roof.', 'success');
    }

    /**
     * Handle map click to drop/move pin
     */
    function handleMapClick(event) {
        // Don't handle clicks if drawing mode is active
        if (drawingManager.getDrawingMode() !== null) {
            return;
        }

        const location = event.latLng;

        // Reverse geocode to get address
        geocoder.geocode({ location: location }, function(results, status) {
            let address = 'Selected location';

            if (status === 'OK' && results[0]) {
                address = results[0].formatted_address;
                addressInput.value = address;
            }

            // Place marker
            placeMarker(location, address);

            // Update form fields
            updateFormFields(location, address);

            // Show drawing controls if hidden
            if (drawingControls && drawingControls.style.display === 'none') {
                drawingControls.style.display = 'flex';
                if (mapOverlay) {
                    mapOverlay.classList.add('hidden');
                }
            }
        });
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
                        <path d="M20 0C8.954 0 0 8.954 0 20c0 14 20 28 20 28s20-14 20-28C40 8.954 31.046 0 20 0z" fill="#0088df"/>
                        <circle cx="20" cy="18" r="8" fill="white"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(40, 48),
                anchor: new google.maps.Point(20, 48)
            }
        });

        // Marker drag listener
        marker.addListener('dragend', function() {
            const newLocation = marker.getPosition();

            // Reverse geocode new position
            geocoder.geocode({ location: newLocation }, function(results, status) {
                let address = 'Selected location';

                if (status === 'OK' && results[0]) {
                    address = results[0].formatted_address;
                    addressInput.value = address;
                }

                // Update form fields
                updateFormFields(newLocation, address);
            });
        });
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
        if (measurementDisplay) {
            measurementDisplay.style.display = 'none';
        }

        // Set drawing mode
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);

        // Update UI
        if (drawRoofBtn) {
            drawRoofBtn.style.display = 'none';
        }
        if (clearDrawingBtn) {
            clearDrawingBtn.style.display = 'inline-flex';
        }
        if (drawingHint) {
            drawingHint.textContent = 'Click corners of your roof to outline it. Double-click or click the first point to complete.';
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

        // Hide measurement display
        if (measurementDisplay) {
            measurementDisplay.style.display = 'none';
        }

        // Reset drawing mode
        drawingManager.setDrawingMode(null);

        // Update UI
        if (drawRoofBtn) {
            drawRoofBtn.style.display = 'inline-flex';
        }
        if (clearDrawingBtn) {
            clearDrawingBtn.style.display = 'none';
        }
        if (drawingHint) {
            drawingHint.textContent = 'Click corners of your roof to outline it. Double-click or click the first point to complete.';
            drawingHint.classList.remove('active');
        }

        // Clear form fields
        if (formRoofSqft) formRoofSqft.value = '';
        if (formEstimateLow) formEstimateLow.value = '';
        if (formEstimateHigh) formEstimateHigh.value = '';
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
        if (drawRoofBtn) {
            drawRoofBtn.style.display = 'none';
        }
        if (clearDrawingBtn) {
            clearDrawingBtn.style.display = 'inline-flex';
        }
        if (drawingHint) {
            drawingHint.textContent = 'Roof outlined! Drag corners to adjust, or click "Clear & Redraw" to start over.';
        }

        // Add listeners for polygon edits
        google.maps.event.addListener(polygon.getPath(), 'set_at', calculateAndDisplayArea);
        google.maps.event.addListener(polygon.getPath(), 'insert_at', calculateAndDisplayArea);
        google.maps.event.addListener(polygon, 'dragend', calculateAndDisplayArea);
    }

    /**
     * Calculate area and display results
     */
    function calculateAndDisplayArea() {
        if (!roofPolygon) return;

        // Calculate area in square meters
        const areaSquareMeters = google.maps.geometry.spherical.computeArea(roofPolygon.getPath());

        // Convert to square feet (1 sq meter = 10.7639 sq feet)
        roofAreaSqFt = Math.round(areaSquareMeters * 10.7639);

        // Calculate estimates
        const lowEstimate = roofAreaSqFt * PRICE_PER_SQFT_LOW;
        const highEstimate = roofAreaSqFt * PRICE_PER_SQFT_HIGH;

        // Update display
        if (roofSqftDisplay) {
            roofSqftDisplay.textContent = roofAreaSqFt.toLocaleString();
        }

        // Show measurement display
        if (measurementDisplay) {
            measurementDisplay.style.display = 'block';
        }

        // Update form hidden fields
        if (formRoofSqft) formRoofSqft.value = roofAreaSqFt;
        if (formEstimateLow) formEstimateLow.value = lowEstimate.toFixed(2);
        if (formEstimateHigh) formEstimateHigh.value = highEstimate.toFixed(2);

        showNotification(`Roof measured: ${roofAreaSqFt.toLocaleString()} sq ft. Click "Get My Price Estimate" to continue!`, 'success');
    }

    /**
     * Open estimate modal
     */
    function openEstimateModal() {
        if (!roofAreaSqFt || roofAreaSqFt === 0) {
            showNotification('Please draw your roof outline first.', 'error');
            return;
        }

        // Update modal sqft display
        if (modalSqft) {
            modalSqft.textContent = roofAreaSqFt.toLocaleString();
        }

        // Reset to contact step
        if (estimateStepContact) estimateStepContact.style.display = 'block';
        if (estimateStepResult) estimateStepResult.style.display = 'none';

        // Show modal
        if (estimateModal) {
            estimateModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Focus first input
        const nameInput = document.getElementById('estimate-name');
        if (nameInput) {
            setTimeout(() => nameInput.focus(), 100);
        }
    }

    /**
     * Close estimate modal
     */
    function closeEstimateModal() {
        if (estimateModal) {
            estimateModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Handle estimate form submission
     */
    function handleEstimateFormSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('estimate-name').value.trim();
        const email = document.getElementById('estimate-email').value.trim();
        const phone = document.getElementById('estimate-phone').value.trim();

        if (!name || !email || !phone) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        // Calculate estimates
        const lowEstimate = roofAreaSqFt * PRICE_PER_SQFT_LOW;
        const highEstimate = roofAreaSqFt * PRICE_PER_SQFT_HIGH;

        // Update result display
        if (resultSqft) resultSqft.textContent = roofAreaSqFt.toLocaleString();
        if (resultAddress) resultAddress.textContent = addressInput.value || 'Property location';
        if (estimateLow) estimateLow.textContent = '$' + lowEstimate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        if (estimateHigh) estimateHigh.textContent = '$' + highEstimate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

        // Pre-fill the main form with captured info
        const mainName = document.getElementById('name');
        const mainEmail = document.getElementById('email');
        const mainPhone = document.getElementById('phone');
        if (mainName) mainName.value = name;
        if (mainEmail) mainEmail.value = email;
        if (mainPhone) mainPhone.value = phone;

        // Switch to result step
        if (estimateStepContact) estimateStepContact.style.display = 'none';
        if (estimateStepResult) estimateStepResult.style.display = 'block';

        // Send lead data to Netlify form (background submission)
        submitLeadToNetlify(name, email, phone, roofAreaSqFt, lowEstimate, highEstimate);
    }

    /**
     * Submit lead data to Netlify in background
     */
    function submitLeadToNetlify(name, email, phone, sqft, lowEstimate, highEstimate) {
        const formData = new FormData();
        formData.append('form-name', 'instant-estimate');
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('roof-sqft', sqft);
        formData.append('estimate-low', lowEstimate.toFixed(2));
        formData.append('estimate-high', highEstimate.toFixed(2));
        formData.append('property-address', addressInput.value || '');
        formData.append('latitude', formLatitude ? formLatitude.value : '');
        formData.append('longitude', formLongitude ? formLongitude.value : '');

        // Submit in background
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        }).catch(err => console.log('Background form submission:', err));
    }

    /**
     * Handle request exact quote button
     */
    function handleRequestExactQuote() {
        // Close modal
        closeEstimateModal();

        // Scroll to form
        const formSection = document.querySelector('.form-section');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Show notification
        showNotification('Complete the form below to request your exact quote!', 'success');
    }

    /**
     * Update hidden form fields with location data
     */
    function updateFormFields(location, address) {
        if (formLatitude) {
            formLatitude.value = location.lat();
        }
        if (formLongitude) {
            formLongitude.value = location.lng();
        }
        if (formFormattedAddress) {
            formFormattedAddress.value = address;
        }
        if (propertyAddressInput) {
            propertyAddressInput.value = address;
        }
    }

    /**
     * Show pin confirmation info
     */
    function showPinInfo(address) {
        if (pinInfo) {
            pinInfo.style.display = 'flex';
        }
        if (pinAddress) {
            pinAddress.textContent = address;
        }
    }

    /**
     * Handle form submission
     */
    function handleFormSubmit(event) {
        // Check if location has been set
        if (!formLatitude.value || !formLongitude.value) {
            event.preventDefault();
            showNotification('Please search for and select your property location on the map', 'error');

            // Scroll to map
            document.querySelector('.map-section').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            return false;
        }

        return true;
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
     * Show notification message
     */
    function showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.map-notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `map-notification map-notification-${type}`;
        notification.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'error'
                    ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
                    : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
                }
            </svg>
            <span>${message}</span>
        `;

        // Style notification
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

        notification.querySelector('svg').style.cssText = `
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        `;

        // Add animation keyframes
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideDown {
                    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(function() {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 4000);
    }

    /**
     * Fallback for when Google Maps API is not loaded
     */
    function initFallback() {
        if (typeof google === 'undefined' || !google.maps) {
            const mapContainer = document.getElementById('map');
            if (mapContainer && mapOverlay) {
                mapOverlay.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p><strong>Map Unavailable</strong></p>
                    <p style="font-size: 0.75rem;">Please enter your address manually in the form below, or contact us at (832) 303-3183</p>
                `;

                // Make address input editable
                if (propertyAddressInput) {
                    propertyAddressInput.removeAttribute('readonly');
                    propertyAddressInput.placeholder = 'Enter your property address';
                }
            }
        }
    }

    // Check for Google Maps API after page load
    document.addEventListener('DOMContentLoaded', function() {
        // Give Google Maps time to load
        setTimeout(initFallback, 3000);
    });

})();
