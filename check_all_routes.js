const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'server', 'routes');
const files = fs.readdirSync(routesDir);

files.forEach(file => {
    if (file.endsWith('.js')) {
        try {
            console.log(`Checking ${file}...`);
            require(path.join(routesDir, file));
            console.log(`✅ ${file} loaded successfully.`);
        } catch (err) {
            console.error(`❌ ${file} failed:`, err.message);
        }
    }
});
