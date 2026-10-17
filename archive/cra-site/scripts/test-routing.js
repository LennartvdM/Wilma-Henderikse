/**
 * Simple test script to check if routing configuration is correct
 * Run with: node scripts/test-routing.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Routing Configuration...\n');

const checks = [];

// Check 1: Redirect files exist
console.log('1. Checking redirect configuration files...');
const redirectFiles = [
  { file: 'public/_redirects', platform: 'Netlify' },
  { file: 'public/.htaccess', platform: 'Apache' },
  { file: 'public/web.config', platform: 'IIS' },
  { file: 'vercel.json', platform: 'Vercel' }
];

redirectFiles.forEach(({ file, platform }) => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  checks.push({ name: `${platform} config (${file})`, passed: exists });
  console.log(`   ${exists ? '✅' : '❌'} ${platform}: ${file} ${exists ? 'exists' : 'missing'}`);
});

// Check 2: App.js uses Router
console.log('\n2. Checking React Router setup...');
const appJs = fs.readFileSync(path.join(__dirname, '..', 'src', 'App.js'), 'utf8');
const hasRouter = appJs.includes('Router') || appJs.includes('BrowserRouter') || appJs.includes('HashRouter');
const hasRoutes = appJs.includes('<Routes>');
const hasPublicaties = appJs.includes('/publicaties');

checks.push({ name: 'Router imported', passed: hasRouter });
checks.push({ name: 'Routes component used', passed: hasRoutes });
checks.push({ name: 'Publicaties route defined', passed: hasPublicaties });

console.log(`   ${hasRouter ? '✅' : '❌'} Router imported`);
console.log(`   ${hasRoutes ? '✅' : '❌'} Routes component used`);
console.log(`   ${hasPublicaties ? '✅' : '❌'} /publicaties route defined`);

// Check 3: Build folder (if exists)
console.log('\n3. Checking build output...');
const buildExists = fs.existsSync(path.join(__dirname, '..', 'build'));
if (buildExists) {
  const buildIndex = fs.existsSync(path.join(__dirname, '..', 'build', 'index.html'));
  const buildRedirects = fs.existsSync(path.join(__dirname, '..', 'build', '_redirects'));
  const buildHtaccess = fs.existsSync(path.join(__dirname, '..', 'build', '.htaccess'));
  
  console.log(`   ✅ Build folder exists`);
  console.log(`   ${buildIndex ? '✅' : '❌'} index.html in build`);
  console.log(`   ${buildRedirects ? '✅' : '❌'} _redirects in build`);
  console.log(`   ${buildHtaccess ? '✅' : '❌'} .htaccess in build`);
  
  checks.push({ name: 'Build folder exists', passed: buildExists });
  checks.push({ name: 'index.html in build', passed: buildIndex });
  checks.push({ name: 'Redirect files in build', passed: buildRedirects || buildHtaccess });
} else {
  console.log(`   ⚠️  Build folder doesn't exist - run 'npm run build' first`);
  checks.push({ name: 'Build folder exists', passed: false });
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Summary:');
const passed = checks.filter(c => c.passed).length;
const total = checks.length;
console.log(`   ${passed}/${total} checks passed\n`);

if (passed === total) {
  console.log('✅ All checks passed! Your routing should work correctly.');
  console.log('\n💡 If you still get 404 errors:');
  console.log('   1. Make sure you rebuilt after adding redirect files');
  console.log('   2. Check your hosting platform supports the redirect method');
  console.log('   3. Try using HashRouter (set REACT_APP_USE_HASH_ROUTER=true)');
} else {
  console.log('⚠️  Some checks failed. Review the issues above.');
  console.log('\n💡 Recommendations:');
  if (!buildExists) {
    console.log('   - Run: npm run build');
  }
  console.log('   - Ensure redirect files are in public/ folder');
  console.log('   - Redeploy your site after adding redirect files');
}

process.exit(passed === total ? 0 : 1);




