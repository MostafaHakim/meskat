const bizSdk = require('facebook-nodejs-business-sdk');

const accessToken = 'EAAPr98AE7y0BQvPoGeKkogM78Qc8Q8dN419CnZC43e34VC6ume3ewZBLM7K4YaplhlYmMVRIiy0XRyCACDKIZBsPEJdgmdXoZApvw8vbiywEqRZBrwdESotX2fyo6gPirlwHIZAgTJpeMO3ayJ3QkU9SZBSFyW2ZA9PBsgZCPrBVvl7YvzyPlkO4RzrYyGNDDNAZDZD';
const pixelId = '1590630371523770';

const api = bizSdk.FacebookAdsApi.init(accessToken);

module.exports = {
  bizSdk,
  pixelId,
  api
};
