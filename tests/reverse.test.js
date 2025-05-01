const { test , describe } = require('node:test')
const assert = require('node:assert')

const reverse = require('../utils/for_testing').reverse


describe('reverse',() => { test('reverse of saippuakauppias', () => {
  const result = reverse('saippuakauppias')

  assert.strictEqual(result, 'saippuakauppias')
})

test('reverse of saippuakauppias', () => {
  const result = reverse('saippuakauppias')

  assert.strictEqual(result, 'saippuakauppias')
})
})
