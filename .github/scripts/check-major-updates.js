const fs = require('fs');

let outdated = {};
try {
  const content = fs.readFileSync('outdated.json', 'utf8');
  if (content.trim()) {
    outdated = JSON.parse(content);
  }
} catch (e) {
  console.log('No outdated packages or error parsing JSON');
}

const majorUpdates = [];
for (const [pkg, info] of Object.entries(outdated)) {
  const current = info.current || '0.0.0';
  const latest = info.latest || '0.0.0';
  const currentMajor = parseInt(current.split('.')[0]);
  const latestMajor = parseInt(latest.split('.')[0]);
  
  if (latestMajor > currentMajor) {
    majorUpdates.push({
      package: pkg,
      current: current,
      latest: latest
    });
  }
}

if (majorUpdates.length > 0) {
  console.log('MAJOR_UPDATES_FOUND=true');
  fs.writeFileSync('major-updates.json', JSON.stringify(majorUpdates, null, 2));
} else {
  console.log('MAJOR_UPDATES_FOUND=false');
}
