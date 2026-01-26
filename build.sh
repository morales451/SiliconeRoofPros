#!/bin/bash
# Build script to inject environment variables into HTML files

# Check if GOOGLE_MAPS_API_KEY is set
if [ -z "$GOOGLE_MAPS_API_KEY" ]; then
    echo "Warning: GOOGLE_MAPS_API_KEY environment variable is not set"
    echo "Maps functionality will not work without a valid API key"
else
    echo "Injecting Google Maps API key..."
    # Replace placeholder with actual API key in all HTML files
    sed -i "s/__GOOGLE_MAPS_API_KEY__/$GOOGLE_MAPS_API_KEY/g" index.html
    sed -i "s/__GOOGLE_MAPS_API_KEY__/$GOOGLE_MAPS_API_KEY/g" quote.html
    echo "API key injection complete"
fi

echo "Build complete"
