const account = require('./models/account.js')
const userQuestions = require('./models/userQuestions')
const cookieSession = require('cookie-session')
const express = require('express')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const _ = require('lodash')
const users = require('./models/users')
const questions = require('./controllers/questions')

const score = require('./models/score')

/**
 * @desc Import environment variable port module and assign port equal to 8080.
 * @type {*|number}
 */
const port = process.env.PORT || 8080

/**
 * @module app
 * @type {*|Function}
 */
let app = express()

/**
 * @summary object that contains sessionID objects that contain user
 * account data, such as username, user id and current score
 * @example
 * let playingUsers = {
 *  'sessionCode': {
 *    user: account.Account,
 *    question: questions.Questions
 *  }
 *}
 * @type {Object}
 */
let playingUsers = {}

hbs.registerPartials(`${__dirname}/views/partials`)

app.set('views', `${__dirname}/views`)
app.set('view engine', 'hbs')

/**
 * @summary Cookie is created for the user upon visit
 * @name Cookie
 *
 * @example
 * app.get('/', (request, response) => {
 *  console.log(request.session.id.toString())
 *  }
 */
app.use(cookieSession({
  name: 'session',
  keys: ['password'],
  maxAge: 24 * 60 * 60 * 1000
}))

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

hbs.registerHelper('dummy', () => {
  return undefined
})

/**
 * @summary Check if session is established
 * @name Session
 * @body {String} session.id getTime() in string format is stored as session key.
 */
app.use((request, response, next) => {
  if (request.session.id === undefined) {
    let date = new Date()
    request.session.id = date.getTime().toString()
  }
  next()
})

/**
 * @summary Renders index.hbs
 * @name Root
 * @response {String} index.hbs filename of homepage to render
 */
app.get('/', (request, response) => {
  response.render('index.hbs')
})

/**
 * @summary Check if account is logged in
 * @name Check Login Status
 * @path {POST} /checkLoginStatus
 *
 * @response {Object} userData Holds data to ID user and their quiz score
 * @code {403} Unauthorized user
 */
app.post('/checkLoginStatus', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID) &&
    playingUsers[sessionID].user.userID !== undefined) {
    response.send(playingUsers[sessionID].user.toJSON())
  } else {
    response.sendStatus(403)
  }
})

/**
 * @summary If the user exists logs him in.
 * @name Login
 * @path {POST} /login
 *
 * @body {String} username Username text used to check database
 * @body {String} password Password text used to compare hashed passwords
 *
 * @code {200} If server request is successful
 * @code {406} No content found after server request
 */
app.post('/login', (request, response) => {
  let username = request.body.username
  let password = request.body.password
  let userAccount = new account.Account()
  userAccount.login(username, password).then((result) => {
    if (result) {
      let sessionID = request.session.id.toString()
      playingUsers[sessionID] = {}
      playingUsers[sessionID].user = userAccount
      response.sendStatus(200)
    } else {
      response.sendStatus(406)
    }
  })
})

/**
 * @summary Log out the user. Delete the session key from application
 * @name Logout
 * @path {POST} /logout
 *
 * @code {200} If server request for a log out is successful
 */
app.post('/logout', (request, response) => {
  let sessionID = request.session.id.toString()
  delete playingUsers[sessionID]
  response.sendStatus(200)
})

/**
 * @summary Store the user and their quiz score to the database
 * @name Store User Information
 * @path {POST} /storeuser
 *
 * @code {201} User information was stored in DB successfully.
 * @code {400} Bad query Syntax.
 * @code {401} User does not exist to save info to DB.
 * @code {403} Session does not exit to save info to DB.
 */
app.post('/storeuser', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    if (playingUsers[sessionID].user !== undefined &&
      playingUsers[sessionID].user.userID !== undefined) {
      playingUsers[sessionID].user.saveCurrentScore().then(result => {
        response.sendStatus(201)
      }).catch(error => {
        response.sendStatus(400)
      })
    } else {
      response.sendStatus(401)
    }
  } else {
    response.sendStatus(403)
  }
})

/**
 * @summary Creates a new sessionID and a new User using the Account
 * class, allowing users to play without an account.
 * @name Play As Guest
 * @path {POST} /playAsGuest
 *
 * @body {String} username Guest username string sent from client
 *
 * @response {Object} Sends Account class attributes of guest user to this path
 */
app.post('/playAsGuest', (request, response) => {
  let sessionID = request.session.id.toString()
  let newUser = new account.Account(request.body.username)
  playingUsers[sessionID] = {}
  playingUsers[sessionID].user = newUser
  response.send(newUser.toJSON())
})

/**
 * @summary Starts the game by getting the session id from cookie and sends
 * user property to this path
 * @name Play
 * @path {POST} /play
 *
 * @response {Object} Sends account class attributes of client's session to this
 * path
 */
app.post('/play', (request, response) => {
  let sessionID = request.session.id.toString()
  response.send(playingUsers[sessionID].user.toJSON())
})

/**
 * @summary Renders the leaderboards.hbs page.
 * @name Leaderboard
 * @path {GET} /leaderboard
 *
 * @response {String} leaderboard.hbs Filename of page to render
 * @response {Object} list_of_user_data property that creates HTML tag structure
 * for the leader board page
 */
app.get('/leaderboard', (request, response) => {
  let userList = new users.Users()
  response.render('leaderboard.hbs', {
    list_of_user_data: userList.displayTopUsers()
  })
})

app.post('/leaderboardCategory', (request, response) => {
  let newScore = new score.Score()
  console.log('hi')
  newScore.getLeaderboardStats(request.body.chosenCateogry, request.body.chosenDifficulty).then(result => {
    console.log(result)
    response.send(result)
  })
})

/**
 * @summary Requests the next question, responds with
 * question object or a number indicating reason for a failure
 * @name Get Next Question
 * @path {POST} /getnextquestion
 *
 * @response {Object} Sends the next question object to this path
 * @code {204} If the user is on the last question
 * @code {401} Unauthorized because there was no question object
 * @code {401} Unauthorized because question number is greater than 10
 * @code {403} Session ID was not found
 */
app.post('/getnextquestion', (request, response) => {
  let sessionID = request.session.id.toString()
  let minQuestions = playingUsers[sessionID].questions.currentQuestion
  if (Object.keys(playingUsers).includes(sessionID)) {
    if (playingUsers[sessionID].questions !== undefined) {
      if (playingUsers[sessionID].questions.currentQuestion < 9) {
        playingUsers[sessionID].questions.currentQuestion++
        response.send(
          playingUsers[sessionID].questions.minimalQuestionsList[minQuestions])
      } else if (minQuestions === 9) {
        response.sendStatus(204)
      } else {
        response.sendStatus(401)
      }
    } else {
      response.sendStatus(401)
    }
  } else {
    response.sendStatus(403)
  }
})

app.post('/getbonusquestion', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    if (playingUsers[sessionID].questions !== undefined) {
      if (playingUsers[sessionID].questions.currentQuestion === 9) {
        userQuestions.getRandomQuestions().then((result) => {
          let bonusQuestion = JSON.parse(result)[0]
          let answerArray = _.shuffle([
            bonusQuestion.RIGHT_ANSWER,
            bonusQuestion.WRONG_ANSWER1,
            bonusQuestion.WRONG_ANSWER2,
            bonusQuestion.WRONG_ANSWER3])
          playingUsers[sessionID].questions.questionsList.push({
            'question': bonusQuestion.QUESTION_CONTENT,
            'option1': answerArray[0],
            'option2': answerArray[1],
            'option3': answerArray[2],
            'option4': answerArray[3],
            'answers': _.indexOf(answerArray, bonusQuestion.RIGHT_ANSWER) + 1
          })
          let i = playingUsers[sessionID].questions.minimalQuestionsList.length
          playingUsers[sessionID].questions.minimalQuestionsList.push({
            'index': playingUsers[sessionID].questions.minimalQuestionsList.length,
            'question': playingUsers[sessionID].questions.questionsList[i].question,
            'option1': playingUsers[sessionID].questions.questionsList[i].option1,
            'option2': playingUsers[sessionID].questions.questionsList[i].option2,
            'option3': playingUsers[sessionID].questions.questionsList[i].option3,
            'option4': playingUsers[sessionID].questions.questionsList[i].option4
          })
          playingUsers[sessionID].questions.currentQuestion++
          response.send(playingUsers[sessionID].questions.minimalQuestionsList[playingUsers[sessionID].questions.currentQuestion])
        })
      } else {
        response.sendStatus(204)
      }
    } else {
      response.sendStatus(401)
    }
  } else {
    response.sendStatus(403)
  }
})

/**
 * @desc If user has session ID then create new question with chosen question
 * type, else sends 500 to indicate that an interal server error occured.
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.post('/starttrivia', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    let newQuestions = new questions.Questions()
    playingUsers[sessionID].currentReview = []
    playingUsers[sessionID].questions = newQuestions
    let minQuestID = playingUsers[sessionID].questions.currentQuestion
    newQuestions.getQuestions(10, request.body.chosenType, request.body.chosenDiff).then((result) => {
      response.send(
        playingUsers[sessionID].questions.minimalQuestionsList[minQuestID]
      )
    })
  } else {
    response.sendStatus(403)
  }
})

/**
 * @desc Function sends post request to the server, if user has session ID
 * responds with result object, else responds with 400 to indicate that an error
 * occured
 * @param {Object} request - Node.js request object contains session data
 * @param {Object} response - Node.js response object, responds with
 * questionObject, or with 400 if error occurred
 */
app.post('/validateanswer', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    let userObject = playingUsers[sessionID].user
    let questionsObject = playingUsers[sessionID].questions

    let result = questionsObject.assessQuestionResult(
      userObject,
      questionsObject.currentQuestion,
      request.body.chosenAnswer
    )

    playingUsers[sessionID].currentReview.push([
      questionsObject.questionsList[questionsObject.currentQuestion].question,
      questionsObject.questionsList[questionsObject.currentQuestion][`option${questionsObject.questionsList[questionsObject.currentQuestion].answers}`]
    ])
    response.send(result)
  } else {
    response.send(403)
  }
})
app.post('/review', (request, response) => {
  let sessionID = request.session.id.toString()
  response.send(playingUsers[sessionID].currentReview)
})
/**
 * @desc Function sends get request to render about.hbs page, successful
 * response renders the page
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.get('/about', (request, response) => {
  response.render('about.hbs')
})

/**
 * @desc Renders Sign Up page
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.get('/register', (request, response) => {
  response.render('register.hbs')
})

app.get('/profile', (request, response) => {
  response.render('profile.hbs')
})

app.get('/review', (request, response) => {
  response.render('review.hbs')
})

/**
 * @desc If requested page is not found function renders 404 error page
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.get('*', (request, response) => {
  response.render('404.hbs')
})

/**
 * @desc Functions sends post request to the server containing username,
 * if username is valid responds with true, else responds with false
 * @param {Object} request - Node.js request object, contains username
 * @param {Object} response - Node.js response object, responds with true if
 * username is valid, else false
 */
app.post('/validateusername', (request, response) => {
  let userAccount = new account.Account()
  userAccount.validateUsername(request.body.USERNAME.toString())
    .then((result) => {
      if (result) {
        response.sendStatus(200)
      } else {
        response.sendStatus(406)
      }
    }).catch(error => {
      response.sendStatus(406)
    })
})

app.post('/validatepassword', (request, response) => {
  let userAccount = new account.Account()
  let result = userAccount.regexPassword(request.body.PASSWORD.toString())
  if (result) {
    response.sendStatus(200)
  } else {
    response.sendStatus(406)
  }
})

/**
 * @desc Function sends post request to register user, responds with true
 * for success, else with false
 * @param {Object} request - Node.js request object contains account data
 * @param {Object} response - Node.js response object, responds with true
 * for success, else with false
 */
app.post('/register', (request, response) => {
  let USERNAME = request.body.USERNAME.toString()
  let PASSWORD = request.body.PASSWORD.toString()
  let CPASSWORD = request.body.CPASSWORD.toString()
  let userAccount = new account.Account()

  userAccount.validateUsername(USERNAME).then((result) => {
    if (
      result &&
      userAccount.regexPassword(PASSWORD) &&
      PASSWORD === CPASSWORD
    ) {
      console.log('validation passed')
      userAccount.register(USERNAME, PASSWORD).then((finalResult) => {
        response.send(finalResult)
      })
    } else {
      response.sendStatus(406)
    }
  }).catch(error => {
    if (error.message === 'Bad Username') {
      response.sendStatus(406)
    }
  })
})

app.post('/createQuestion', (request, response) => {
  let questionContent = request.body.questionContent.toString()
  let rightAnswer = request.body.rightAnswer.toString()
  let wrongAnswer1 = request.body.wrongAnswer1.toString()
  let wrongAnswer2 = request.body.wrongAnswer2.toString()
  let wrongAnswer3 = request.body.wrongAnswer3.toString()
  let sessionID = request.session.id.toString()
  let userID = playingUsers[sessionID].user.userID

  userQuestions.createQuestion(
    questionContent,
    rightAnswer,
    wrongAnswer1,
    wrongAnswer2,
    wrongAnswer3,
    userID
  ).then((result) => {
    if (result) {
      response.sendStatus(200)
    } else {
      response.sendStatus(406)
    }
  })
})

/**
 * @desc Function notifies port number of the local server
 */
app.listen(port, () => {
  console.log(`Server is up on port 8080`)
})
