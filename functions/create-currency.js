const chromium = require("chrome-aws-lambda");
const sendQuery = require("./utils/send-query");

const CREATE_CURRENCY = `
  mutation($name: String!, $amount: Float!) {
    createCurrency(data: { name: $name, amount: $amount })
    {
      _id
      name
      amount
    }
  }

`;

// const url = `https://www.google.com/search?q=usd+to+dop`;

exports.handler = async () => {
  const selector =
    "#knowledge-currency__updatable-data-column > div.b1hJbf > div.dDoNo.vk_bk.gsrt > span.DFlfde.SwHCTb";

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto("https://www.google.com/search?q=eur+to+dop");
  await page.waitForSelector(selector);

  const results = await page.$(selector);
  const currency = await results.evaluate(element => element.innerText);

  await browser.close();

  const created = {
    name: "EUR",
    amount: parseFloat(currency),
  };

  const { data, errors } = await sendQuery(CREATE_CURRENCY, created);

  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors),
    };
  }

  return {
    statusCode: 200,
    message: `Got the currency`,
    body: JSON.stringify({ newCurrency: data.createCurrency }),
  };
};
