const { execSync } = require('child_process');
const dir = process.argv[2] || 'default-dir'; // 取得參數

const command = `tailwindcss -i ${dir}/src/input.css -o ${dir}/dist/output.css --watch`;
execSync(command, { stdio: 'inherit' });