const axios = require("axios");

exports.handler = async function (event, context) {
  try {
    const response = await axios.get("https://api.binance.com/api/v3/ticker/24hr");

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ message: "Binance fetch failed", error: error.message }),
    };
  }
};
