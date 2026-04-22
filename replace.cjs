const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.js', 'utf8');
content = content.replace(/\$(\d+)/g, '₹$1');
fs.writeFileSync('src/data/mockData.js', content);
