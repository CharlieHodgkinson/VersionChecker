const core = require('@actions/core');
const semver = require('semver')
const execSync = require('child_process').execSync;

try {
    const localPackage = require(core.getInput('localFilePath'))
    const packageName = core.getInput('publicPackageName')
    const publicPackage = execSync('npm view ' + packageName + ' -json', { encoding: 'utf-8' });

    const publicVersion = semver.valid(JSON.parse(publicPackage)["dist-tags"].latest)
    const localVersion = semver.valid(localPackage.version)

    console.log("public version: ", publicVersion, "local version: ", localVersion)
    core.setOutput("localVersion", localVersion)
    core.setOutput("publicVersion", publicVersion)

    semver.gt(localVersion, publicVersion) ? core.setOutput("updated", true) : core.setFailed("version number has not been increased")
  
} catch (error) {
  core.setFailed(error.message);
}