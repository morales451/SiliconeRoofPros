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

# Netlify publishes the repo root, so tooling folders would otherwise be
# downloadable from the live site. Strip them from the deploy only - the
# NETLIFY check keeps a local run of this script from deleting them.
if [ "$NETLIFY" = "true" ]; then
    rm -rf .claude
    echo "Removed .claude/ from the deploy"
fi

echo "Build complete"
