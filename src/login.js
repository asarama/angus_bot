async function performLogin(page, config) {
  await page.type(config.selectors.usernameInput, config.username);
  await page.type(config.selectors.passwordInput, config.password);
  await page.click(config.selectors.loginButton);
  await page.waitForNavigation();
}

module.exports = { performLogin };