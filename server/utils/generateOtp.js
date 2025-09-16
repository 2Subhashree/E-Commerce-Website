const generateOtp = () => {
  return Math.floor(Math.random() * 900000) + 100000 //100000 to 900000 generate 6digit number
}

module.exports = generateOtp