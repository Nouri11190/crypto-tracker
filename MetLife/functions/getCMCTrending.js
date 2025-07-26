const axios = require("axios");

exports.handler = async function (event, context) {
  try {
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/trending/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": "95aa6637-49bc-49ec-8d0e-eedc94be599d",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ message: "CMC fetch failed", error: error.message }),
    };
  }
};
