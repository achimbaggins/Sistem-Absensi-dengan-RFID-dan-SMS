module.exports = function cekHP(string) {
  let hp = /\+\d+/;
  return hp.test(string);
}
