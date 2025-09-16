const verifyEmailTemplate = ({name, url}) => {
  return `
  <p>Dear ${name}</p>
    <p>Thank you for registering Ecommerce.</p>
    <a href=${url} style="color:white;background:blue;margin-top:10px; padding:10px">Verify Email</a>
  `
}

module.exports = verifyEmailTemplate