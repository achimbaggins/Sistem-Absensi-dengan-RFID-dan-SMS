module.exports = function() {
  source = 'ab1cd2ef3gh4ij5kl6mn7op8qr9st0uvwxyz'
  result = []
    for(let i = 0; i < 8; i++){
      let x = Math.floor(Math.random()*36);

      result.push(source.charAt(x))

    }
  return result.join('')
}
