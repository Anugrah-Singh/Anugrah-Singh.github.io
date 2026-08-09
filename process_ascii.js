const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Extract the ASCII art block
const match = html.match(/<div class="terminal-left-ascii"[^>]*>([\s\S]*?)<\/div>/);
if (match) {
    let ascii = match[1];
    
    // Replace background characters with space
    // Let's assume background is - = + * and maybe some others.
    // Face characters are usually # % @
    // Let's see all unique characters
    let uniqueChars = [...new Set(ascii.split(''))].sort();
    console.log("Unique chars:", uniqueChars.join(''));
    
    // Replace - = + * with space
    ascii = ascii.replace(/[-=+*]/g, ' ');
    
    html = html.replace(match[1], ascii);
    
    // We also need to widen it and shift down.
    // Let's modify the inline style of terminal-left-ascii.
    // original: font-size: 3.5px; line-height: 3.8px; ... flex-shrink: 0; pointer-events: none; user-select: none;
    // widen: font-size: 4px; line-height: 4px;
    // shift down: align-self: flex-end; margin-bottom: -24px; (terminal-body has padding)
    
    // Let's just do the replacement in JS.
    html = html.replace(/<div class="terminal-left-ascii" style="([^"]*)">/, (m, p1) => {
        let newStyle = p1.replace(/font-size: 3.5px; line-height: 3.8px;/, 'font-size: 4.2px; line-height: 4.2px; margin-bottom: -24px; margin-left: -24px; align-self: flex-end;');
        return `<div class="terminal-left-ascii" style="${newStyle}">`;
    });
    
    fs.writeFileSync('index.html', html);
    console.log("Updated index.html");
} else {
    console.log("Could not find ASCII block");
}
