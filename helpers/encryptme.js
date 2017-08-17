const crypto = require('crypto');

module.exports = function (password, secret) {
  const key = crypto.pbkdf2Sync(password, secret, 1000, 30, 'sha512');
  return key.toString('hex')
}
