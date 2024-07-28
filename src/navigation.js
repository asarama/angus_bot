async function navigateToUrl(page, url) {
  await page.goto(url);
  await page.waitForSelector('body', { timeout: 5000 });
}

module.exports = { navigateToUrl };