// Helper function to convert filename to readable title
export function filenameToTitle(filename) {
  // Remove .pdf extension
  let title = filename.replace(/\.pdf$/i, '');
  
  // Replace hyphens and underscores with spaces
  title = title.replace(/[-_]/g, ' ');
  
  // Capitalize first letter of each word
  title = title.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  // Handle special cases
  title = title.replace(/\bVdh\b/gi, 'VDH');
  title = title.replace(/\bUmc\b/gi, 'UMC');
  title = title.replace(/\bScp\b/gi, 'SCP');
  title = title.replace(/\bLnvh\b/gi, 'LNVH');
  title = title.replace(/\bHrm\b/gi, 'HRM');
  
  return title;
}

// Get filename from full path
export function getFilenameFromPath(path) {
  return path.split('/').pop();
}

// Base path for publications
export const PUBLICATIONS_PATH = '/wp-content/uploads/publications/';


