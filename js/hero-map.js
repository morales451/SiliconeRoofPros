/**
 * Silicone Roof Pros - Hero Map Functionality
 * Google Maps integration for homepage satellite quote
 */

(function() {
    'use strict';

    // State
    let map = null;
    let marker = null;
    let autocomplete = null;
    let geocoder = null;
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

        // Map click listener
        map.addListener('click', handleMapClick);

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

        // Get Quote button
        const getQuoteBtn = document.getElementById('hero-get-quote-btn');
        if (getQuoteBtn) {
            getQuoteBtn.addEventListener('click', openQuoteModal);
        }

        // Modal handlers
        initModal();
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
        const location = event.latLng;

        geocoder.geocode({ location: location }, function(results, status) {
            let address = 'Selected location';

            if (status === 'OK' && results[0]) {
                address = results[0].formatted_address;
                document.getElementById('hero-address-input').value = address;
            }

            placeMarker(location, address);
            updatePinInfo(location, address);
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
                        <path d="M24 0C10.745 0 0 10.745 0 24c0 16.8 24 32 24 32s24-15.2 24-32C48 10.745 37.255 0 24 0z" fill="#0088df" filter="url(#shadow)"/>
                        <circle cx="24" cy="22" r="10" fill="white"/>
                        <circle cx="24" cy="22" r="5" fill="#0088df"/>
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
     * Initialize Modal
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

    /**
     * Open Quote Modal
     */
    function openQuoteModal() {
        const modal = document.getElementById('quote-modal');
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
        if (overlay && typeof google === 'undefined') {
            overlay.innerHTML = `
                <div class="map-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p><strong>Map Loading...</strong></p>
                    <p style="font-size: 0.75rem; margin-top: 0.5rem;">Or call us at (832) 303-3183</p>
                </div>
            `;
        }
    }

    // Check for Google Maps API after delay
    setTimeout(initFallback, 5000);

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
                    fillColor: '#0088df',
                    fillOpacity: 0.9,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                }
            });
        });

        // Draw service area circle
        new google.maps.Circle({
            strokeColor: '#0088df',
            strokeOpacity: 0.3,
            strokeWeight: 2,
            fillColor: '#0088df',
            fillOpacity: 0.1,
            map: serviceMap,
            center: houstonCenter,
            radius: 80000 // 80km radius
        });
    };

    // Initialize service area map after hero map loads
    var originalInitHeroMap = window.initHeroMap;
    window.initHeroMap = function() {
        originalInitHeroMap();
        setTimeout(window.initServiceAreaMap, 500);
    };

})();
