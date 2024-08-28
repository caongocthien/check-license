const core = require('@actions/core');
const { promises: fs } = require('fs');
const path = require('path');

async function run() {
  try {
    // Read the package-lock.json file
    const packageLockPath = path.join(process.cwd(), 'package-lock.json');
    const packageLock = JSON.parse(await fs.readFile(packageLockPath, 'utf8'));

    const allowLicenses = core.getInput('licenses').replace(/ /g,'').toUpperCase().split(',');
    
    // Extract dependencies
    const packages = packageLock.packages;

    // Check package empty
    if (!packages) {
      core.info('No dependencies found in package-lock.json.');
      return;
    }


    // Filter main package installed
    const dependencies = packages[""].dependencies ? Object.keys(packages[""].dependencies) : [];
    const devDependencies = packages[""].devDependencies ? Object.keys(packages[""].devDependencies) : [];
    const allDependencies = [...dependencies, ...devDependencies];

    // Filter package name with prefix to filter
    const mapPreFixListPackageName = allDependencies.map(dep => `node_modules/${dep}`)

    // Filter object package with main package
    const filteredDependencies = {};
    for (const key in packages) {
        if (mapPreFixListPackageName.includes(key)) {
            filteredDependencies[key] = packages[key]
        }
    }

    const listNoneLicense = [];
    for (const [packageName, packageInfo] of Object.entries(filteredDependencies)) {
      if (!allowLicenses.includes(packageInfo.license)) {
          listNoneLicense.push(packageName)
      }
    }

    // Check have package with license not suitable
    if (listNoneLicense.length > 0) {
      const formattedPackages = listNoneLicense.map(pkg => `- ${pkg}`).join('\n');
      const message = `Dependencies without license suitable for project:\n${formattedPackages}`;
      core.setFailed(message);
    } else {
      core.info('All dependencies have suitable licenses.');
    }
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
