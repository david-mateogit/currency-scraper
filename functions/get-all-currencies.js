const sendQuery = require("./utils/send-query")

const GET_ALL_CURRENCIES = `
query {
  allCurrencies {
    data {
      name
      _id
      amount
    }
  }
}
`

exports.handler = async () => {
  const { data, errors } = await sendQuery(GET_ALL_CURRENCIES)

  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ currencies: data.allCurrencies.data }),
  }
}
