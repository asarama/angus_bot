const { launchBrowser } = require("./browser");
const { performLogin } = require("./login");
const { navigateToUrl } = require("./navigation");
const config = require("../config");

async function pause(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Promise resolved after " + delay + " milliseconds");
    }, delay);
  });
}

async function main() {
  const browser = await launchBrowser();
  const mainPage = await browser.newPage();

  try {
    await navigateToUrl(mainPage, config.loginUrl);
    await performLogin(mainPage, config);
    await navigateToUrl(mainPage, config.roomUrl);

    // Set Duration
    await mainPage.tap(
      "#facility-page-content > div.facility-selected-items.second-row > span > span > span.k-select > span"
    );
    await pause(500);
    await mainPage.tap("#service-duration-dropdown_listbox > li:nth-child(4)");
    await pause(250);

    // Set Number of people to attend
    await mainPage.tap(
      "#facility-page-content > div.number-of-people-input > span > span > span.k-select > span.k-link.k-link-increase"
    );
    await pause(250);
    await mainPage.tap(
      "#facility-page-content > div.number-of-people-input > span > span > span.k-select > span.k-link.k-link-increase"
    );

    // Read current date range
    // Get inner text
    const tableDateRange = await mainPage.evaluate(() => {
      const titleElement = document.querySelector("#facility-page-content > div.scheduler-wrapper > div.sheduler-nav > div.sheduler-nav-status");
      return titleElement.innerText;
    });
    console.log("Title text:", tableDateRange);

    // Make the date we are interested the final date by clicking the back and forward arrows
    
    // Click the cell of interest

    console.log("Login and navigation successful!");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
}

main();
