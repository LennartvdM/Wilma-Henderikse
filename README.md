# Wilma Henderikse - React Website

This is a React conversion of the original WordPress site for Wilma Henderikse. The site has been rebuilt to match the original design exactly while using modern React technologies.

## Features

- **Homepage** with hero section, quote, work section, publications gallery, about section, and contact form
- **Publications page** with a comprehensive list of all publications
- **Responsive design** that matches the original WordPress site
- **Modern React architecture** with component-based structure
- **React Router** for navigation

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```powershell
npm install
```

2. Start the development server:
```powershell
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

To create a production build:

```powershell
npm run build
```

To check if the build has all required files:

```powershell
npm run check-build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Hero.js         # Hero section with name and title
│   ├── Quote.js        # Quote section
│   ├── Work.js         # Work section with publications link
│   ├── PublicationsGallery.js  # Gallery of publication images
│   ├── About.js        # About section
│   └── Contact.js      # Contact form
├── pages/              # Page components
│   ├── Home.js         # Homepage
│   └── Publicaties.js  # Publications page
├── App.js              # Main app component with routing
└── index.js            # Entry point

public/
└── index.html          # HTML template

wp-content/             # Original WordPress assets (images, PDFs, fonts)
```

## Assets

All assets are located in the `public/wp-content/uploads/` directory:

- **Images**: `public/wp-content/uploads/2018/10/` and `public/wp-content/uploads/2021/11/`
- **PDFs**: `public/wp-content/uploads/publications/` - **All publications are consolidated here**

### Adding New Publications

1. Drop your PDF file into `public/wp-content/uploads/publications/`
2. Add the filename to the `pdfFilenames` array in `src/pages/Publicaties.js`
3. The title will be automatically generated from the filename

The site uses:
- **Fonts**: Montserrat and Open Sans (loaded from Google Fonts)
- **Images**: All images from the original site
- **PDFs**: All publication PDFs in one consolidated folder

## Styling

The site uses CSS modules and maintains the original Divi theme styling. All colors, fonts, and layouts match the original WordPress site:

- Primary color: `#fcd21d` (yellow)
- Accent color: `#e09900` (orange)
- Text colors: `#353740`, `#747d88`, `#3f3f3f`
- Background: `#f7f7f7` (light gray)

## Contact Form

The contact form currently uses a mailto link to send emails. For production use, you would want to integrate with a backend service or email service provider.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is a conversion of the original WordPress site for Wilma Henderikse.
