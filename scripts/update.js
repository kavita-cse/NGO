const fs = require("fs");
const path = require("path");
const dir = "c:/Users/krishna/.antigravity/NGO";

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Replace Title
  content = content.replace(
    /SAKHI Foundation/g,
    "Kaarn Social Welfare Foundation",
  );

  // Replace Logo
  const svgRegex =
    /<svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http:\/\/www\.w3\.org\/2000\/svg" style="margin-bottom: 5px;">[\s\S]*?<\/svg>/;
  content = content.replace(
    svgRegex,
    '<img src="images/kswf-logo.png" alt="KSWF Logo" style="height: 50px; margin-bottom: 5px;">',
  );

  // Replace Navbar text
  content = content.replace(
    /<span>SAKHI<\/span>\s*<span style="font-size: 0\.6rem; font-weight: normal; color: #555;">Foundation<\/span>/,
    '<span>Kaarn Social</span>\n                <span style="font-size: 0.6rem; font-weight: normal; color: #555;">Welfare Foundation</span>',
  );

  fs.writeFileSync(filePath, content, "utf8");
  console.log("Updated " + file);
}
