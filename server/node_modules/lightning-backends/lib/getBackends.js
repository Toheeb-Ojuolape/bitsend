const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '.', 'backends');
const files = fs.readdirSync(dirPath);

module.exports = function() {
	return files.map(file => {
		const filePath = path.join(dirPath, file);
		return require(filePath);
	});
};
