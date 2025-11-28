# Troubleshooting 404 Errors

## Quick Diagnosis

Run the routing test:
```bash
npm run test-routing
```

## Common Issues & Solutions

### Issue 1: Redirect files not in build folder

**Solution:** After building, redirect files should automatically be copied from `public/` to `build/`. Verify:
```bash
npm run build
# Then check:
# - build/_redirects exists
# - build/.htaccess exists  
# - build/web.config exists
```

### Issue 2: Hosting platform doesn't support redirects

**Solution:** Use HashRouter instead (works everywhere, no server config needed):

1. Create a `.env` file in the root:
```
REACT_APP_USE_HASH_ROUTER=true
```

2. Rebuild:
```bash
npm run build
```

3. URLs will change from `/publicaties` to `/#/publicaties` but will work on any hosting platform.

### Issue 3: Redirect files not being recognized

**Check your hosting platform:**

- **Netlify:** `_redirects` must be in `public/` folder (will be in build root)
- **Vercel:** `vercel.json` must be in project root
- **Apache:** `.htaccess` must be in build root, mod_rewrite must be enabled
- **IIS:** `web.config` must be in build root, URL Rewrite module required
- **GitHub Pages:** Doesn't support server-side redirects - **must use HashRouter**

### Issue 4: Routes work locally but not in production

This usually means:
1. Build wasn't deployed (only source code was)
2. Redirect files weren't included in deployment
3. Server isn't configured correctly

**Solution:**
1. Build: `npm run build`
2. Deploy the `build/` folder, not the `src/` folder
3. Ensure redirect files are in the deployed root

## Testing Your Fix

1. Build the site: `npm run build`
2. Check build folder contains:
   - `index.html`
   - `_redirects` (for Netlify)
   - `.htaccess` (for Apache)
   - `web.config` (for IIS)
3. Deploy the `build/` folder
4. Test routes:
   - `/` should work
   - `/publicaties` should work (not 404)
   - `/nonexistent` should show custom 404 page

## Still Not Working?

If redirects still don't work, the safest solution is to use HashRouter:

1. Add to `.env`:
```
REACT_APP_USE_HASH_ROUTER=true
```

2. Rebuild and redeploy

This will change URLs to use `#` (e.g., `/#/publicaties`) but works on **any** hosting platform without server configuration.

