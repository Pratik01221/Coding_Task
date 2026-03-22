const fs = require('fs');

const lineToRemove = "specific line";

fs.readFile('demo.txt', 'utf-8', (err, data) => {

    if (err) {
        console.log("error in reading file", err);
        return;
    }

    const lines = data.split('\n');

    const filteredLines = lines.filter(line => line.trim() !== lineToRemove);

    const updatedContents = filteredLines.join('\n');

    fs.writeFile('demo.txt', updatedContents, 'utf-8', (err) => {
        if (err) {
            console.log("error updating file", err);
            return;
        }
        console.log("File updated successfully");
    });
});