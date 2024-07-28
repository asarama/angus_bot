const { launchBrowser } = require('./browser');
const { performLogin } = require('./login');
const { navigateToDashboard } = require('./navigation');
const config = require('../config');

async function main() {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  try {
    await performLogin(page, config);
    await navigateToDashboard(page, config);
    console.log('Login and navigation successful!');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
}

main();