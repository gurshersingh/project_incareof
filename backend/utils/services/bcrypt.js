const bcrypt = require('bcryptjs')
const config = require('config')

const generateHash = (password) => {
    return bcrypt.hashSync(password, config.salt)
}

module.exports = {
    generateHash
}