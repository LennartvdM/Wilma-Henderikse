// Router configuration utility
// This helps detect if we're in a hosting environment that doesn't support BrowserRouter
// and can fall back to HashRouter if needed

export const shouldUseHashRouter = () => {
  // Check if we're in a static hosting environment that might not support rewrites
  // You can set this manually if needed
  return process.env.REACT_APP_USE_HASH_ROUTER === 'true';
};

export const getRouterType = () => {
  return shouldUseHashRouter() ? 'HashRouter' : 'BrowserRouter';
};


