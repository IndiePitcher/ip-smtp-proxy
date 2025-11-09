const fs = require('fs');
const { execSync } = require('child_process');

let majorUpdates = [];
try {
  majorUpdates = JSON.parse(fs.readFileSync('major-updates.json', 'utf8'));
} catch (e) {
  console.log('No major updates file found');
  process.exit(0);
}

for (const update of majorUpdates) {
  const title = `Update ${update.package} from v${update.current} to v${update.latest}`;
  const bodyContent = `A new major version of **${update.package}** is available.

**Current Version:** ${update.current}

**Latest Version:** ${update.latest}

This is a major version update and may contain breaking changes. Please review the changelog and update manually.

[View on npm](https://www.npmjs.com/package/${update.package})`;
  
  try {
    execSync(`gh issue create --title "${title}" --body "${bodyContent}" --label "dependencies,major-update"`, {
      stdio: 'inherit',
      env: { ...process.env, GH_TOKEN: process.env.GITHUB_TOKEN }
    });
  } catch (e) {
    console.error(`Failed to create issue for ${update.package}`, e);
  }
}
