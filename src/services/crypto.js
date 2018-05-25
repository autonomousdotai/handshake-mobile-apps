const CryptoJS = require('crypto-js');
const SHA256 = require('crypto-js/sha256');

module.exports = {
  SECRECT_KEY: '',
  encrypt(message) {
    const ciphertext = CryptoJS.AES.encrypt(message, this.SECRECT_KEY);
    return ciphertext.toString();
  },
  decrypt(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.SECRECT_KEY);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  },
  sha256(text) {
    return SHA256(text);
  },
};
