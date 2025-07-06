const fs = require('fs');
const path = require('path');

// Script to add auth headers to route tests
const files = [
  'tests/routes/users.test.ts',
  'tests/routes/collections.test.ts',
  'tests/routes/billing.test.ts',
  'tests/routes/search.test.ts',
  'tests/routes/admin.test.ts'
];

files.forEach(file => {
  const filePath = path.join('/config/Development/BanedonV', file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add auth header to requests that don't have it
    content = content.replace(
      /await request\(app\)\s*\.(get|post|put|delete)\([^)]+\)\s*(?!\.set\('Authorization')/g,
      (match) => {
        // Skip if it's already has set('Authorization') immediately after
        if (match.includes('.set(')) return match;
        return match + "\n        .set('Authorization', 'Bearer mock_admin_token')";
      }
    );
    
    // Write back
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
