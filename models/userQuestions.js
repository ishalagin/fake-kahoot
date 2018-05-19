const db = require('./database')

let createQuestion = (Q, CA, WA1, WA2, WA3, userID) => {
  return new Promise((resolve, reject) => {
    if (Q !== '' && CA !== '' && WA1 !== '' && WA2 !== '' && WA3 !== '' && userID !== '' && CA !== WA1 && CA !== WA2 && CA !== WA3) {
      db.executeQuery(`INSERT INTO public."QUESTIONS"(
      "QUESTION_CONTENT",
      "RIGHT_ANSWER",
      "WRONG_ANSWER1",
      "WRONG_ANSWER2",
      "WRONG_ANSWER3",
      "ACCOUNT_ID"
      ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6
      );`,[Q, CA, WA1, WA2, WA3, userID]
      ).then((result) => {
        resolve(true)
      })
    } else {
      resolve(false)
    }
  })
}

let getRandomQuestions = (num = 1) => {
  return new Promise((resolve,reject) => {
    db.executeQuery(`SELECT * FROM "QUESTIONS" ORDER BY RANDOM() LIMIT ${num}`).then((result) => {
      resolve(result)
    })
  })
}

module.exports = {
  createQuestion,
  getRandomQuestions
}
