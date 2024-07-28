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

    // Set Duration
    await mainPage.tap('#facility-page-content > div.facility-selected-items.second-row > span > span > span.k-select > span')
    await mainPage.waitForTimeout(500);
    await mainPage.tap('#service-duration-dropdown_listbox > li:nth-child(4)')

    // Set Number of people to attend
    await mainPage.tap('#facility-page-content > div.number-of-people-input > span > span > span.k-select > span.k-link.k-link-increase')
    await mainPage.waitForTimeout(1000);
    await mainPage.tap('#facility-page-content > div.number-of-people-input > span > span > span.k-select > span.k-link.k-link-increase')
    // No idea why I need a third tap
    await mainPage.tap('#facility-page-content > div.number-of-people-input > span > span > span.k-select > span.k-link.k-link-increase')


    console.log('Login and navigation successful!');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
}

main();