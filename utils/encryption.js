const fs = require('fs');
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync('keys/private.key');
const publicKey = fs.readFileSync('keys/public.pem');

exports.encodeToken = function(payload) {
  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}
exports.decodeToken = function(token) {
  return jwt.verify(token, publicKey, { algorithm: 'RS256' });
}
