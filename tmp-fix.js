const fs = require('fs');
const file = 'app/web-development/page.js';
const c = fs.readFileSync(file, 'utf8');
const fixed = c.replace(/\\`/g, '`');
fs.writeFileSync(file, fixed);
console.log('Fixed backticks.');
