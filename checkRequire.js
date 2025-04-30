const fs = require('fs');
const path = require('path');

// Function to check files for "Require" in undefined
const checkRequireInFiles = (dir) => {
  // Loop through all files and directories in the directory
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);

    if (fs.lstatSync(filePath).isDirectory()) {
      // Recursively check in subdirectories
      checkRequireInFiles(filePath);
    } else if (filePath.endsWith('.js')) {
      // Read the contents of the file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      if (fileContent.includes('Require') && fileContent.includes('undefined')) {
        console.log(`Found 'Require' in undefined in: ${filePath}`);
      }
    }
  });
};

// Start checking from the current directory
checkRequireInFiles(__dirname);
