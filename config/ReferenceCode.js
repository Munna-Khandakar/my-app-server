var otpGenerator = require("otp-generator");

module.exports.GenerateRegerenceCode = () => {
  const otp_code = otpGenerator.generate(6, {
    digits: true,
    upperCase: true,
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: true,
  });

  return otp_code;
};
