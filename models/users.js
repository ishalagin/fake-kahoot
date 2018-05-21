const fs = require('fs')

class Users {
  /**
   * @summary User object that holds a list of users
   * @name Users
   * @class
   * @public
   * @deprecated Using Account() instead
   *
   * @param fileName - Path to load/save user data
   *
   * @example
   * let users = new Users()
   */
  constructor (fileName = './models/users_data.json') {
    this.fileName = fileName
    this.userList = this.loadUsers()
  }

  /**
   * @summary loads the user data from the database, if there is no file
   * it will be created.
   * @method
   * @public
   * @deprecated
   *
   * @returns {object} It will return the users_data.json as an object
   * if the file exists
   */
  loadUsers () {
    if (fs.existsSync(this.fileName)) {
      return JSON.parse(fs.readFileSync(this.fileName))
    } else {
      let dummyFile = {
        'user': []
      }
      fs.writeFileSync(this.fileName,
        JSON.stringify(dummyFile, null, 4),
        'utf8')
    }
  }

  /**
   * @summary It's a function that saves users' info into a file.
   * @method
   * @public
   * @deprecated
   */
  saveUsers () {
    fs.writeFileSync(
      this.fileName,
      JSON.stringify(this.userList, null, 4),
      'utf8')
  }

  /**
   * @summary stores user data to a file.
   * @method
   * @public
   * @deprecated
   *
   * @param userObject
   */
  storeUser (userObject) {
    let date = new Date()
    let timeStamp = `${date.toLocaleDateString('en-CA')} 
    ${date.toLocaleTimeString('en-CA')}`

    this.userList.user.push({
      userData: userObject.username,
      scoreData: userObject.userScore,
      streakData: userObject.highestStreak,
      date: timeStamp
    })
    this.saveUsers()
  }

  /**
   * @summary Sort user information with sortOption as keyword.
   * @method
   * @public
   * @deprecated
   *
   * @param {string} sortOption - keyword for sorting
   *
   * @return {array} sorted object contains user information
   */
  sortScores (sortOption) {
    let userInfo = this.userList.user.slice(0)
    userInfo.sort((a, b) => {
      return b[sortOption] - a[sortOption]
    })
    return userInfo
  }

  /**
   * @summary Display top 10 users with their rank, user name, highest streak
   * and scores.
   * @method
   * @public
   *
   * @return string string contains rank, user name, highest streak and
   * scores of a user.
   */
  displayTopUsers () {
    let newSort = this.sortScores('scoreData')
    let displayString = ''
    let rankCounter = 1
    for (let i = 0; i < newSort.length; i++) {
      displayString += '<div class="scoreDisplayRow">\n\t'

      displayString += '<div class="leaderboardDisplayColumn">\n'
      displayString += `<p class="displayInfo"> ${rankCounter} </p>\n`
      displayString += '</div>\n'

      displayString += '<div class="leaderboardDisplayColumn">\n'
      displayString += `<p class="displayInfo"> ${newSort[i].userData} </p>\n`
      displayString += '</div>\n'

      displayString += '<div class="leaderboardDisplayColumn">\n'
      displayString += `<p class="displayInfo"> ${newSort[i].streakData} </p>\n`
      displayString += '</div>\n'

      displayString += '<div class="leaderboardDisplayColumn">\n'
      displayString += `<p class="displayInfo"> ${newSort[i].scoreData} </p>\n`
      displayString += '</div>\n'

      displayString += '<div class="leaderboardDisplayColumn">\n'
      displayString += `<p class="displayInfo"> ${newSort[i].date} </p>\n`
      displayString += '</div>\n</div>\n'

      if (rankCounter >= 10) {
        break
      }
      rankCounter++
    }
    return displayString
  }
}

class User {
  /**
   * @summary holds the variables that construct the User Object.
   * @name User
   * @class
   * @public
   *
   * @param username Name of the user
   * @param userScore Score of the user
   * @param currentStreak Current streak the user has for the quiz
   * @param highestStreak Highest streak the user has for the quiz
   *
   * @example
   * const userObject = new User(
   *  username = 'exampleUser',
   *  userScore = 500,
   *  currentStreak = 5,
   *  highestStreak = 9
   *  )
   */
  constructor (
    username = 'testUser',
    userScore = 0,
    currentStreak = 5,
    highestStreak = 5) {
    this.username = username
    this.userScore = userScore
    this.currentStreak = currentStreak
    this.highestStreak = highestStreak
  }
}

/**
 * exports User class and Users class
 * @type {{Users: Users, User: User}}
 */
module.exports = {
  Users,
  User
}
