const { getRandomInt } = require('../../src/utils/helper')
const { expect } = require('chai')


describe('#getRandomInt()', function () {

    it('should return a number', function () {
        expect(getRandomInt(2, Number.MAX_SAFE_INTEGER)).to.be.a('number')
    })

    it('should return the number within range (inclusive)', function () {
        const min = 2
        const max = Number.MAX_SAFE_INTEGER
        expect(getRandomInt(min, max)).to.be.within(min, max)
    })
})