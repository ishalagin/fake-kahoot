const db = require('./database')
const bcrypt = require('bcrypt')
const score = require('./score')

/**
 * @class
 */
class Account {
  /**
   * @summary Holds the methods and attributes for Accounts
   * @name Account
   * @class
   * @public
   *
   * @param username - fdsf
   * @param userID - dasf
   * @member this.currentScore - Instantiates Score Class
   */
  constructor (username = undefined, userID = undefined) {
    this.username = username
    this.userID = userID
    this.currentScore = new score.Score()
  }

  /**
   * @summary Queries database and compares user inputted information to
   * confirm login
   * @method
   * @public
   *
   * @param username - user's username
   * @param password - user's password
   * @returns {Promise<object>}
   */
  login (username, password) {
    return new Promise((resolve, reject) => {
      db.executeQuery(`SELECT * FROM public."ACCOUNTS" WHERE "USERNAME" = '${username}';`).then((queryResult) => {
        let result = JSON.parse(queryResult)
        if (result.length > 0 && bcrypt.compareSync(password, result[0].PASSWORD)) {
          this.username = result[0].USERNAME
          this.userID = result[0]['ACCOUNT_ID']
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

  /**
   * @summary Encrypts user's password with bcrypt
   * @method
   * @public
   *
   * @param password - user's password
   * @returns {Promise<object>}
   */
  encryptPassword (password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10).then((hash) => {
        resolve(hash)
      })
    })
  }

  /**
   * @summary Registration of the user in the database
   * @method
   * @public
   *
   * @param username - user's username
   * @param password - user's password
   * @returns {Promise<object>}
   */
  register (username, password) {
    return new Promise((resolve, reject) => {
      this.encryptPassword(password).then((result) => {
        db.executeQuery(
          `INSERT INTO public."ACCOUNTS"("USERNAME", "PASSWORD")
           VALUES ($1, $2);`,
          [username, result]).then((result) => { resolve(result) })
      })
    })
  }

  /**
   * @summary Converts Account class attributes to object
   * @method
   * @public
   *
   * @return {{username: *, userID: *, currentScore: *}}
   */
  toJSON () {
    return {
      'username': this.username,
      'userID': this.userID,
      'currentScore': this.currentScore.toJSON()
    }
  }

  /**
   * @summary Saves user score information to database.
   * @method
   * @public
   *
   * @return {Promise<any>}
   */
  saveCurrentScore () {
    return new Promise((resolve, reject) => {
      let date = new Date()
      let timeStamp = `${date.toLocaleDateString('en-CA')} 
      ${date.toLocaleTimeString('en-CA')}`

      db.executeQuery(
        `INSERT INTO public."SCORES" (
        "ACCOUNT_ID",
        "SCORE",
        "HIGHEST_STREAK",
        "DATE"
        ) VALUES (
        $1,
        $2,
        $3,
        $4)`,
        [this.userID,
          this.currentScore.userScore,
          this.currentScore.highestStreak,
          timeStamp]
      ).then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  /**
   * @summary Compares user inputted username to database username list and
   * resolves whether the username inputted exists in the database or not.
   * Also, tests parameter on alphanumeric regular expression otherwise rejects
   * username.
   * @method
   * @public
   *
   * @param {string} USERNAME - User's username
   * @returns {Promise<object>}
   */
  validateUsername (USERNAME) {
    return new Promise((resolve, reject) => {
      if (this.regexUsername(USERNAME)) {
        db.executeQuery('SELECT "USERNAME" FROM public."ACCOUNTS";')
          .then((result) => {
            let userArray = JSON.parse(result)
            let found = userArray.some(function (el) {
              return el.USERNAME === USERNAME
            })
            resolve(!found)
          })
      } else {
        reject(new Error('Bad Username'))
      }
    })
  }

  /**
   * @summary tests regex pattern on username string to validate username
   * @method
   * @public
   *
   * @param username
   * @returns {boolean}
   */
  regexUsername (username) {
    return /^[a-zA-Z\d]{3,29}$/.test(username)
  }

  /**
   * @summary Validates for a strong password
   * @method
   * @public
   *
   * @param pass - password passed by the user <** correct? **>
   * @returns {boolean} if password is valid returns true, false
   */
  regexPassword (pass) {
    let numbers = pass.match(/\d+/g)
    let uppers = pass.match(/[A-Z]/)
    let lowers = pass.match(/[a-z]/)
    let lengths = pass.length >= 6
    let valid

    if (
      numbers === null ||
      uppers === null ||
      lowers === null ||
      lengths === false
    ) valid = false

    if (
      numbers !== null &&
      uppers !== null &&
      lowers !== null &&
      lengths
    ) valid = true

    return valid
  }
}

/**
 * exports Account class
 * @type {{Account: Account}}
 */
module.exports = {
  Account
}
