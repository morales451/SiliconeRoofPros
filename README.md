# Silicone Roof Pros Website

A modern, responsive website for Silicone Roof Pros - commercial roof restoration specialists serving Houston, TX and surrounding areas.

## Project Structure

```
SiliconeRoofPros/
├── index.html          # Homepage
├── about.html          # About Us page
├── process.html        # Our Process page
├── blog.html           # Blog listing page
├── contact.html        # Contact Us page
├── quote.html          # Interactive quote page with Google Maps
├── css/
│   ├── styles.css      # Main stylesheet
│   └── quote.css       # Quote page styles
├── js/
│   ├── main.js         # JavaScript functionality
│   └── quote-map.js    # Google Maps integration
├── images/             # Image assets (add your images here)
├── assets/
│   └── icons/
│       └── favicon.svg # Site favicon
├── netlify.toml        # Netlify configuration
└── README.md           # This file
```

## Features

- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop
- **Modern CSS**: Uses CSS custom properties (variables) for easy theming
- **Vanilla JavaScript**: No framework dependencies, lightweight and fast
- **SEO Optimized**: Proper meta tags, semantic HTML5 structure
- **Netlify Forms**: Contact and quote forms configured for Netlify Forms
- **Performance Optimized**: Minimal dependencies, optimized for fast loading

## Pages

1. **Home** (`index.html`) - Hero section, services, why choose us, stats, service areas
2. **About** (`about.html`) - Company story, mission, vision, core values
3. **Process** (`process.html`) - 6-step restoration process with timeline
4. **Blog** (`blog.html`) - Blog post listings
5. **Contact** (`contact.html`) - Contact form, location info, service areas
6. **Get a Quote** (`quote.html`) - Interactive map for property location selection

## Deployment to Netlify

### Option 1: Deploy via Git (Recommended)

1. Push this repository to GitHub, GitLab, or Bitbucket
2. Log in to [Netlify](https://netlify.com)
3. Click "Add new site" > "Import an existing project"
4. Connect your Git provider and select this repository
5. Netlify will automatically detect settings from `netlify.toml`
6. Click "Deploy site"

### Option 2: Drag and Drop

1. Log in to [Netlify](https://netlify.com)
2. Drag the entire project folder to the Netlify dashboard
3. Your site will be deployed instantly

### Option 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy (from project directory)
netlify deploy --prod
```

## Form Configuration

The contact forms are pre-configured to work with Netlify Forms. When deployed to Netlify:

1. Forms will automatically be detected via the `data-netlify="true"` attribute
2. Submissions will appear in your Netlify dashboard under "Forms"
3. You can set up email notifications in Netlify settings

### Form Names
- `quote` - Hero section quote request form
- `roof-quote` - Interactive map quote form (quote.html)
- `contact` - Contact page form
- `newsletter` - Newsletter signup form (in footer)

## Google Maps API Setup

The quote page (`quote.html`) uses Google Maps for property location selection. To enable:

### 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
4. Go to "Credentials" and create an API key
5. (Recommended) Restrict the API key to your domain

### 2. Add Your API Key

Open `quote.html` and find this line near the bottom:

```javascript
const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY';
```

Replace `YOUR_API_KEY` with your actual Google Maps API key.

### 3. Pricing

Google provides $200/month free credit which covers:
- ~28,000 map loads per month
- This is typically more than enough for a local business

### Features
- Address autocomplete search
- Satellite view of property
- Click-to-drop pin on roof location
- Draggable marker for precise positioning
- Coordinates captured with form submission

## Customization

### Colors

Edit the CSS variables in `css/styles.css`:

```css
:root {
    --primary: #0088df;        /* Main brand color */
    --primary-dark: #0070b8;   /* Darker shade for hover states */
    --secondary: #1a1a2e;      /* Dark color for headers/footers */
}
```

### Contact Information

Update contact details in each HTML file:
- Phone: `(832) 303-3183`
- Email: `sales@siliconeroofpros.com`
- Address: `1445 North Loop W, 242F #1034, Houston, Texas 77008`

### Adding Images

1. Add your images to the `images/` directory
2. Replace placeholder elements with actual `<img>` tags
3. Recommended image formats: WebP for best compression, with JPEG fallbacks

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome for Android)

## Development

This is a static site with no build process required. Simply edit the HTML, CSS, and JS files directly.

### Local Development

You can use any local server to preview the site:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## License

Copyright 2026 Silicone Roof Pros. All rights reserved.

## Contact

For questions about this website:
- Email: sales@siliconeroofpros.com
- Phone: (832) 303-3183
