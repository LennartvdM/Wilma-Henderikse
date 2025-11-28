# Deployment Guide - Fixing 404 Errors

If you're experiencing 404 errors on routes like `/publicaties`, follow these steps based on your hosting platform:

## Quick Fix: Use HashRouter (Works Everywhere)

If server-side redirects aren't working, you can use HashRouter instead. This uses `#` in URLs but works on all hosting platforms without configuration.

To enable HashRouter, set this environment variable before building:
```bash
REACT_APP_USE_HASH_ROUTER=true npm run build
```

Or add to `.env`:
```
REACT_APP_USE_HASH_ROUTER=true
```

## Platform-Specific Solutions

### Netlify
- The `public/_redirects` file should work automatically
- Make sure it's in the `public` folder (it will be copied to build)
- Redeploy after adding the file

### Vercel
- The `vercel.json` file should work automatically
- Redeploy after adding the file

### Apache (.htaccess)
- The `public/.htaccess` file should be copied to your build folder
- Make sure mod_rewrite is enabled on your server
- The file should be in the root of your deployed site

### IIS (Windows Server)
- Use the `public/web.config` file
- Make sure URL Rewrite module is installed on IIS

### GitHub Pages
- GitHub Pages doesn't support server-side redirects
- **You must use HashRouter** (see Quick Fix above)
- Or use a custom 404.html that redirects to index.html

### Other Static Hosting
- Check if your platform supports redirects/rewrites
- If not, use HashRouter (see Quick Fix above)

## Testing Your Deployment

1. Build your site: `npm run build`
2. Check that redirect files are in the `build` folder:
   - `build/_redirects` (for Netlify)
   - `build/.htaccess` (for Apache)
   - `build/web.config` (for IIS)
3. Test routes:
   - `/` should work
   - `/publicaties` should work (not 404)
   - `/nonexistent` should show 404 page (not server 404)

## Current Configuration Files

- ✅ `public/_redirects` - Netlify
- ✅ `vercel.json` - Vercel  
- ✅ `public/.htaccess` - Apache
- ✅ `public/web.config` - IIS

All these files will be copied to the `build` folder when you run `npm run build`.

