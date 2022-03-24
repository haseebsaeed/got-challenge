const { getRandomInt } = require('../utils/helper')
const { CONFIG } = require('../utils/constants')

//Game service to handle game actions
class GameService {
    constructor() { }

    generateRandomNumber() {
        return getRandomInt(CONFIG.RANDOM_NUM_MIN, CONFIG.RANDOM_NUM_MAX)
    }

    //checks to see if the winning condition is met
    isWinningCondition(result) {
        return result === CONFIG.WINNING_NUM
    }

    processNumber(num) {

        const addedNumber = this.calNumberToAdd(num)
        const result = this.divideNumber(num, addedNumber)
        this.printData({ Actual: num, Added: addedNumber, Result: result })

        return result
    }

    /**
    * calculates the number to be added to make it divisible
    **/
    calNumberToAdd(num) {
        const divisor = CONFIG.GAME_DIVISOR
        const remainder = num % divisor

        if (num < divisor || remainder > divisor / 2)
            return divisor - remainder
        else
            return remainder ? remainder * -1 : remainder
    }

    divideNumber(num, addedNumber) {
        return (num + addedNumber) / CONFIG.GAME_DIVISOR
    }

    printData(data) {
        console.log(data)
    }

}

module.exports = GameService