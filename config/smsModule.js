// dependencies
const request = require("request");

/**
 * @name send_verification_sms
 * @description Sends the verification code to the user phone number
 * @param {string} receiver user phone number
 * @param {string} otp_code otp code for verification
 *
 * @returns {*} send sms
 */
module.exports.send_verification_sms = async (receiver, otp_code) => {
  let username = process.env.BULKSMSDB_USERNAME;
  let password = process.env.BULKSMSDB_PASSWORD;
  let msg = `Your OTP code is ${otp_code}`;
  var options = {
    method: "POST",
    url: `http://66.45.237.70/api.php?username=${username}&password=${password}&number=${receiver}&message=${msg}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};

/**
 * @name send_block_sms
 * @description Sends the verification code to the user phone number
 * @param {string} receiver user phone number
 *
 * @returns {*} send sms
 */
module.exports.send_block_sms = async (receiver) => {
  let username = process.env.BULKSMSDB_USERNAME;
  let password = process.env.BULKSMSDB_PASSWORD;
  let msg = `Your MyPlate account is blocked for your unexpected activities. Contact MyPlate for more details at myplatexyz@gmail.com`;
  var options = {
    method: "POST",
    url: `http://66.45.237.70/api.php?username=${username}&password=${password}&number=${receiver}&message=${msg}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};

/**
 * @name send_unblock_sms
 * @description Sends the verification code to the user phone number
 * @param {string} receiver user phone number
 *
 * @returns {*} send sms
 */
module.exports.send_unblock_sms = async (receiver) => {
  let username = process.env.BULKSMSDB_USERNAME;
  let password = process.env.BULKSMSDB_PASSWORD;
  let msg = `Congratulations...! Your MyPlate account is unblocked.`;
  var options = {
    method: "POST",
    url: `http://66.45.237.70/api.php?username=${username}&password=${password}&number=${receiver}&message=${msg}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};
