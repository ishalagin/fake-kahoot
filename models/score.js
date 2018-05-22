const db = require('./database')

class Score {
  /**
   * @summary Create an instance of the user's score data
   * @name Score
   * @class
   * @public
   *
   * @param userScore Score of the user
   * @param currentStreak Current streak the user has for the quiz
   * @param highestStreak Highest streak the user has for the quiz
   *
   * @example
   * let currentScore = new Score()
   */
  constructor (userScore = 0, currentStreak = 0, highestStreak = 0) {
    this.userScore = userScore
    this.currentStreak = currentStreak
    this.highestStreak = highestStreak
  }

  /**
   * @summary Converts this classes data to an object
   * @method
   * @public
   *
   * @returns {{
   *  userScore: (number|*),
   *  currentStreak: (number|*),
   *  highestStreak: (number|*)
   * }}
   */
  toJSON () {
    return {
      'userScore': this.userScore,
      'currentStreak': this.currentStreak,
      'highestStreak': this.highestStreak
    }
  }

  /**
   * @summary Get leaderboard statistics from database and injects html to
   * web site
   * @method
   * @public
   *
   * @param category
   * @param difficulty
   * @return {Promise<any>}
   */
  getLeaderboardStats (category = '9', difficulty = '1') {
    return new Promise((resolve, reject) => {
      db.executeQuery(
        `SELECT AC."USERNAME",
         S."SCORE",
         S."HIGHEST_STREAK",
         S."DATE" FROM public."SCORES" S,
         public."ACCOUNTS" AC WHERE 
         S."QUIZ_CATEGORY_ID" = ${category} 
         and S."DIFFICULTY_ID" = ${difficulty}
         and S."ACCOUNT_ID" = AC."ACCOUNT_ID" ORDER BY S."SCORE" DESC;`)
        .then((queryResult) => {
          let scoreResult = JSON.parse(queryResult)
          let displayString = ''
          for (let i = 0; i < scoreResult.length; i++) {
            displayString += '<div class="scoreDisplayRow">\n\t'

            displayString += '<div class="leaderboardDisplayColumn">\n'
            displayString += `<p class="displayInfo"> ${i + 1} </p>\n`
            displayString += '</div>\n'

            displayString += '<div class="leaderboardDisplayColumn">\n'
            displayString += `<p class="displayInfo"> ${scoreResult[i].USERNAME} </p>\n`
            displayString += '</div>\n'

            displayString += '<div class="leaderboardDisplayColumn">\n'
            displayString += `<p class="displayInfo"> ${scoreResult[i].HIGHEST_STREAK} </p>\n`
            displayString += '</div>\n'

            displayString += '<div class="leaderboardDisplayColumn">\n'
            displayString += `<p class="displayInfo"> ${scoreResult[i].SCORE} </p>\n`
            displayString += '</div>\n'

            displayString += '<div class="leaderboardDisplayColumn">\n'
            displayString += `<p class="displayInfo"> ${scoreResult[i].DATE} </p>\n`
            displayString += '</div>\n</div>\n'
          }
          resolve(displayString)
        })
    })
  }
}

/**
 * exports Score class
 * @type {{Score: Score}}
 */
module.exports = {
  Score
}
