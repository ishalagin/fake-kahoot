const request = require('request')
const _ = require('lodash')
/**
 * @module
 */

/**
 * @summary fetches question from the Open Trivia Database and
 * returns the results in a formatted object.
 * @function
 * @public
 *
 * @param amount Number of questions to be generated.
 * @param category Category of questions.
 * @param difficulty Questions difficulty. Could either be
 * 'easy', 'medium', or 'hard'.
 * @param questionType Type of questions. Could either be
 * 'multiple' or 'boolean'
 * @param sessionToken The clients session token to pass to the API
 *
 * @returns {Promise<object>} An object with information about questions
 * fetched from the API.
 * @resolves {Object} An array of objects that contain questions, choices, and
 * answers
 * @rejects Error - Cannot connect to Open Trivia Database
 * @rejects Error - No Results
 * @rejects Error - Invalid Parameter
 * @rejects Error - Token Not Found
 * @rejects Error - Token Empty
 */
let getQuestions = (
  sessionToken,
  amount = 10,
  category = 15,
  difficulty = 'easy',
  questionType = 'multiple'
) => {
  return new Promise((resolve, reject) => {
    request({
      url: `https://opentdb.com/api.php?` +
        `amount=${encodeURIComponent(amount)}` +
        `&token=${encodeURIComponent(sessionToken)}` +
        `&category=${encodeURIComponent(category)}` +
        `&difficulty=${encodeURIComponent(difficulty)}` +
        `&type=${encodeURIComponent(questionType)}`,
      json: true
    }, (error, response, body) => {
      let questionList = []
      if (error) {
        reject(new Error('Cannot connect to Open Trivia Database'))
      } else if (response.body.response_code === 0) {
        for (let i = 0; i < body.results.length; i++) {
          let answerArray = body.results[i].incorrect_answers.slice()
          answerArray.push(body.results[i].correct_answer)
          answerArray = _.shuffle(answerArray)
          questionList.push({
            'question': body.results[i].question,
            'option1': answerArray[0],
            'option2': answerArray[1],
            'option3': answerArray[2],
            'option4': answerArray[3],
            'answers': 1 + _.indexOf(
              answerArray,
              body.results[i].correct_answer
            )
          })
        }
        resolve(questionList)
      } else if (response.body.response_code === 1) {
        reject(new Error('No Results'))
      } else if (response.body.response_code === 2) {
        reject(new Error('Invalid Parameter'))
      } else if (response.body.response_code === 3) {
        reject(new Error('Token Not Found'))
      } else if (response.body.response_code === 4) {
        reject(new Error('Token Empty'))
      }
    })
  })
}

let retrieveToken = () => {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://opentdb.com/api_token.php?command=request',
      json: true
    }, (error, response, body) => {
      if (!error) {
        if (body.response_code === 0) {
          resolve(body.token)
        } else {
          reject(new Error('Retrieve Token Failed'))
        }
      } else {
        reject(new Error('API Call Failed'))
      }
    })
  })
}

let resetToken = (token) => {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://opentdb.com/api_token.php?command=reset&token=' + token,
      json: true
    }, (error, response, body) => {
      if (!error) {
        if (body.response_code === 0) {
          resolve(body.token)
        } else {
          reject(new Error('Reset Token Failed'))
        }
      } else {
        reject(new Error('API Call Failed'))
      }
    })
  })
}

/**
 * Export the promise
 * @type {{getQuestions: function(*=, *=, *=, *=): Promise<any>}}
 */
module.exports = {
  getQuestions,
  retrieveToken,
  resetToken
}
