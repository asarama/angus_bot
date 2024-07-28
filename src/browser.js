const puppeteer = require('puppeteer');

async function launchBrowser() {
  return await puppeteer.launch({ headless: false });
}

module.exports = { launchBrowser };