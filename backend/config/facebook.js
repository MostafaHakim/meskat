const bizSdk = require("facebook-nodejs-business-sdk");
const User = bizSdk.User;
const ServerEvent = bizSdk.ServerEvent;

const accessToken = process.env.ACCESS_TOKEN;
const pixelId = process.env.PIXEL_ID;
const api = bizSdk.FacebookAdsApi.init(accessToken);

module.exports = {
  bizSdk,
  pixelId,
};
