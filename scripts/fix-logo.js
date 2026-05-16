const fs = require("fs");
const path = require("path");
const dir = "c:/Users/krishna/.antigravity/NGO";

// Fix HTML
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Regex to match the entire logo div
  const logoRegex = /<div class="logo">[\s\S]*?<\/div>/;
  const newLogo =
    '<div class="logo">\n                <a href="index.html" style="display: flex; align-items: center;"><img src="images/kswf-logo.png" alt="KSWF Logo"></a>\n            </div>';

  content = content.replace(logoRegex, newLogo);
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Updated " + file);
}

// Fix CSS
const cssPath = path.join(dir, "css", "style.css");
let cssContent = fs.readFileSync(cssPath, "utf8");
cssContent = cssContent.replace(
  /\.logo\s*\{[\s\S]*?\}/,
  ".logo {\n  display: flex;\n  align-items: center;\n}",
);
cssContent = cssContent.replace(
  /\.logo img\s*\{[\s\S]*?\}/,
  ".logo img {\n  height: 80px;\n  width: auto;\n  display: block;\n}",
);
fs.writeFileSync(cssPath, cssContent, "utf8");
console.log("Updated style.css");
