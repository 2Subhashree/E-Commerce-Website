const forgotPasswordTemplate = ({name, otp}) => {
  return `
  <div>
    <p>Dear, ${name}</p>
    <p>You are requested a password reset. please use following OTP code to reset your password.</p>
    <div style="background:yellow; font-size:20px">
      ${otp}
    </div>
    <p>This otp is valid for 1hr only. Enter this otp in the ecommerce website to proceed with resetting your password.</p>
    </br>
    </br>
    <p>Thanks</p>
    <p>Ecommerce</p>
  </div>
  `
}

module.exports = forgotPasswordTemplate