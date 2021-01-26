function sum(a, b) {
  const result = a + b // закешировали ответ -> ниже он используеться дважды
  if (typeof result === 'number') return result
  throw new TypeError('not a number')
}

module.exports = sum;
