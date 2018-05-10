const account = require('./models/account.js')

/**
 * @desc Import cookie-session module and assign cookieSession as constant
 * @type {Object}
 */
const cookieSession = require('cookie-session')
/**
 * @desc Import express module and assign express as constant.
 * @type {*|createApplication}
 */
const express = require('express')
/**
 * @desc Import hbs module and assign hbs as constant.
 * @type {Instance}
 */
const hbs = require('hbs')
/**
 * @desc Import bodyparser module to create middleware.
 * @type {Parsers|*}
 */
const bodyParser = require('body-parser')
/**
 * @desc Import lodash library and assign _ as constant.
 * @type {function(*): Object}
 * @private
 */
const _ = require('lodash')
/**
 * @desc Import user library and assign users as constant.
 * @type {{Users: Users, User: User}}
 */
const users = require('./models/users')
/**
 * @desc Import Question library and assign questions as constant.
 * @type {{Questions: Questions}}
 */
const questions = require('./controllers/questions')
/**
 * @desc Import environment variable port module and assign port equal to 8080.
 * @type {*|number}
 */
const port = process.env.PORT || 8080

let app = express()

let playingUsers = {}

hbs.registerPartials(`${__dirname}/views/partials`)

app.set('views', `${__dirname}/views`)
app.set('view engine', 'hbs')

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
 * @desc Check if session is established
 */
app.use((request, response, next) => {
  if (request.session.id === undefined) {
    let date = new Date()
    request.session.id = date.getTime().toString()
  }
  next()
})

app.get('/', (request, response) => {
  response.render('index.hbs')
})

/**
 * @desc Function sends post request to the server to store user, responds with message indicating success or failure
 * @param {Object} request - Node.js request object contains session data
 * @param {Object} response - Node.js response object, responds with message indicating success or failure
 */
app.post('/storeuser', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    let userList = new users.Users()
    let userObject = playingUsers[sessionID].user
    userList.storeUser(userObject)
    delete playingUsers[sessionID]
    console.log(playingUsers)
    response.send('Quiz result stored successfully!')
  } else {
    response.send('Unable to store quiz result!')
  }
})

app.post('/playWithoutAccount', (request, response) => {
  let sessionID = request.session.id.toString()
  let newUser = new account.Account(request.body.username)
  // let newUser = new users.User(request.body.username)
  playingUsers[sessionID] = {}
  playingUsers[sessionID].user = newUser
  response.send(newUser.toJSON())
})

/**
 * @desc Function sends get request to render leaderboards.hbs page, successful response renders the page
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.get('/leaderboard', (request, response) => {
  let userList = new users.Users()
  response.render('leaderboard.hbs', {
    list_of_user_data: userList.displayTopUsers()
  })
})

/**
 * @desc Function sends post request for the next question, responds with question object or a number indicating reason for a failure
 * @param {Object} request - Node.js request object contains session data
 * @param {Object} response - Node.js response object, responds with question object or a number indicating reason for a failure
 */
app.post('/getnextquestion', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    if (playingUsers[sessionID].questions !== undefined) {
      if (playingUsers[sessionID].questions.currentQuestion < 9) {
        playingUsers[sessionID].questions.currentQuestion++
        response.send(playingUsers[sessionID].questions.minimalquestionsList[playingUsers[sessionID].questions.currentQuestion])
      } else {
        delete playingUsers[sessionID].questions
        delete playingUsers[sessionID].user
        response.sendStatus(204)
      }
    }
  } else {
    response.sendStatus(500)
  }
})

app.post('/starttrivia', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    let newQuestions = new questions.Questions()
    playingUsers[sessionID].questions = newQuestions
    newQuestions.getQuestions().then((result) => {
      response.send(playingUsers[sessionID].questions.minimalquestionsList[playingUsers[sessionID].questions.currentQuestion])
    })
  } else {
    response.sendStatus(500)
  }
})

/**
 * @desc Function sends post request to the server, if user has session ID responds with result object, else responds with 400 to indicate that an error occured
 * @param {Object} request - Node.js request object contains session data
 * @param {Object} response - Node.js response object, responds with questionObject, or with 400 if error occured
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
    response.send(result)
  } else {
    response.send(400)
  }
})
/**
 * @desc Function sends get request to render about.hbs page, successful responce renders the page
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

/**
 * @desc If requested page is not found function renders 404 error page
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.get('*', (request, response) => {
  response.render('404.hbs')
})

/**
 * @desc Functions sends post request to the server containing username, if username is valid responds with true, else responds with false
 * @param {Object} request - Node.js request object, contains username
 * @param {Object} response - Node.js response object, responds with true if username is valid, else false
 */
app.post('/validateusername', (request, response) => {
  let userAccount = new account.Account()
  userAccount.validateUsername(request.body.USERNAME.toString()).then((result) => {
    if (result) {
      response.send(true)
    } else {
      response.send(false)
    }
  })
})

app.post('/validatepassword', (request, response) => {
  let userAccount = new account.Account()
  let result = userAccount.validatePassword(request.body.PASSWORD.toString())
  if (result) {
    response.send(true)
  } else {
    response.send(false)
  }
})

/**
 * @desc Function sends post request to register user, responds with true for success, else with false
 * @param {Object} request - Node.js request object contains account data
 * @param {Object} response - Node.js response object, responds with true for success, else with false
 */
app.post('/register', (request, response) => {
  let USERNAME = request.body.USERNAME.toString()
  let PASSWORD = request.body.PASSWORD.toString()
  let CPASSWORD = request.body.CPASSWORD.toString()
  let userAccount = new account.Account()

  userAccount.validateUsername(USERNAME).then((result) => {
    if (result && userAccount.validatePassword(PASSWORD) && PASSWORD === CPASSWORD) {
      console.log('validation passed')
      userAccount.register(USERNAME, PASSWORD).then((finalResult) => {
        response.send(finalResult)
      })
    } else {
      response.send(false)
    }
  })
})

/**
 * @desc Sends request to log user in
 * @param {Object} request - Node.js request object contains username and password
 * @param {Object} response - Node.js response object contains user account data
 */
app.post('/login', (request, response) => {
  let username = request.body.username
  let password = request.body.password
  let userAccount = new account.Account()
  userAccount.login(username, password).then((result) => {
    console.log(result)
    if (result) {
      let sessionID = request.session.id.toString()
      playingUsers[sessionID] = {}
      playingUsers[sessionID].user = userAccount
      response.send({
        'userObject': userAccount
      })
    }
  })
})

/**
 * @desc Function notifies port number of the local server
 */
app.listen(port, () => {
  console.log(`Server is up on port 8080`)
})
