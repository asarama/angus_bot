const { launchBrowser } = require('./browser');
const { performLogin } = require('./login');
const { navigateToUrl } = require('./navigation');
const config = require('../config');

async function main() {
  const browser = await launchBrowser();
  const mainPage = await browser.newPage();

  try {
    await navigateToUrl(mainPage, config.loginUrl)
    await performLogin(mainPage, config);
    await navigateToUrl(mainPage, config.roomUrl);
    console.log('Login and navigation successful!');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
}

main();