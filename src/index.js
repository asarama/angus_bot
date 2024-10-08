const moment = require("moment");

const { launchBrowser } = require("./browser");
const { performLogin } = require("./login");
const { navigateToUrl } = require("./navigation");
const config = require("../config");
const { assert } = require("puppeteer");

function parseDateRange(dateRangeString) {
  // Extract the year from the end of the string
  const splitDateString = dateRangeString.split(", ");
  const year = splitDateString[1];
  const datesWithoutYear = splitDateString[0];

  // Split the remaining string into start and end date parts
  const [startDateStr, endDateStr] = datesWithoutYear.split(" - ");

  // Parse the start date
  const startDate = moment(`${startDateStr} ${year}`, "MMM D YYYY");

  // Parse the end date
  let endDate;
  if (endDateStr.includes(' ')) {
    // If endDateStr includes a month, parse it normally
    endDate = moment(`${endDateStr} ${year}`, 'MMM D YYYY');
  } else {
    // If endDateStr is just a day, use the month from startDate
    endDate = moment(`${startDate.format('MMM')} ${endDateStr} ${year}`, 'MMM D YYYY');
  }

  return { startDate, endDate };
}

const pause = async (delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Promise resolved after " + delay + " milliseconds");
    }, delay);
  });
};

const confirmTargetDateInRange = (targetDate) => {
  const currentDate = moment(moment().format("YYYY-MM-DD"));

  // If targetDate < startDate throw error - can't book rooms for the past
  if (targetDate < currentDate) {
    throw new Error(
      `Can't book rooms for the past. \n Target date (${targetDate}) < today (${currentDate})`
    );
  }

  // We can book upto 7 days in advance
  const farthestDate = moment(currentDate).add(7, "days");

  if (targetDate > farthestDate) {
    throw new Error(
      `Can't book rooms more than 7 days in advance. \n Target date (${targetDate})`
    );
  }
};

const getTargetCellInView = async (targetDate, page) => {
  // Read current date range
  // Get inner text
  const tableDateRange = await page.evaluate(() => {
    const titleElement = document.querySelector(
      "#facility-page-content > div.scheduler-wrapper > div.sheduler-nav > div.sheduler-nav-status"
    );
    return titleElement.innerText;
  });
  const { startDate, endDate } = parseDateRange(tableDateRange);

  // If startDate <= targetDate =< endDate - should be able to find the cell to select
  if (startDate <= targetDate && targetDate <= endDate) {
    
    // Target date is in range now we need to find the correct cell
    // This will happen in another method

  } else if (endDate < targetDate) {

    // If endDate < targetDate - click next date button and reevaluate
    await page.tap(
      "#facility-page-content > div.scheduler-wrapper > div.sheduler-nav > div.sheduler-nav-btn.next"
    );

    await getTargetCellInView(targetDate, page);

  } else {
    throw new Error(
      "Oh....\nSomething probably went wrong with the date assertions"
    );
  }
};

const clickTargetTimeslotElement = async (targetDate, targetSlot, page) => {
  // Basic structure of query
  // "#scheduler > table > tbody > tr:nth-child(2) > td:nth-child(2) > div > table > tbody > tr:nth-child(3) > td:nth-child(4)"
  // 
  // This is the main section that will change
  // tbody > tr:nth-child(3) > td:nth-child(4)
  // The 3 needs to be replaced using the targetSlot input
  // Iterate through the left most column of the table to find which row the targetSlot is in
  // This row number replace the 3
  // Leftmost column selector:
  // #scheduler > table > tbody > tr:nth-child(2) > td:nth-child(1) > div > table > tbody
  // 
  // The 4 needs to be replaced using the targetDate input
  // Iterate through the date columns and see which column index we need to use
  // This number will replace the 4
  // The selector for this row is:
  // #scheduler > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > table > tbody > tr

};

const TARGETDATESTRING = "2024-08-04";

const main = async () => {

  // Confirm date is not in the past and not too far into the future
  const targetDate = moment(TARGETDATESTRING);
  confirmTargetDateInRange(targetDate);

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

    await getTargetCellInView(targetDate, mainPage);

    // Click the cell of interest
    // This will be crazy hard...
    // The cells are all organized as children of one element
    // wait...
    // We can actually use the table element instead!
    await clickTargetTimeslotElement(targetDate, "10:00 AM", mainPage)

    console.log("Login and navigation successful!");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
};

main();
