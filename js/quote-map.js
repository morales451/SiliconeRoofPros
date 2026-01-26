/**
 * Silicone Roof Pros - Quote Map Functionality
 * Google Maps integration for property location selection
 */

(function() {
    'use strict';

    // State
    let map = null;
    let marker = null;
    let autocomplete = null;
    let geocoder = null;

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
    const quoteForm = document.getElementById('quote-form');

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

        // Autocomplete listener
        autocomplete.addListener('place_changed', handlePlaceSelect);

        // Map click listener for dropping pin
        map.addListener('click', handleMapClick);

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

        // Form submission validation
        if (quoteForm) {
            quoteForm.addEventListener('submit', handleFormSubmit);
        }
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

        // Center and zoom map
        map.setCenter(location);
        map.setZoom(PROPERTY_ZOOM);

        // Place marker
        placeMarker(location, address);

        // Update form fields
        updateFormFields(location, address);

        // Show pin info
        showPinInfo(address);
    }

    /**
     * Handle map click to drop/move pin
     */
    function handleMapClick(event) {
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

            // Show pin info
            showPinInfo(address);
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

                // Update pin info
                showPinInfo(address);
            });
        });
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
