const db = require('./database')

let createQuestion = (
  questionContent,
  correctAnswer,
  wrongAnswer1,
  wrongAnswer2,
  wrongAnswer3,
  userID,
  date
) => {
  return new Promise((resolve, reject) => {
    if (
      questionContent !== '' &&
      correctAnswer !== '' &&
      wrongAnswer1 !== '' &&
      wrongAnswer2 !== '' &&
      wrongAnswer3 !== '' &&
      userID !== '' &&
      correctAnswer !== wrongAnswer1 &&
      correctAnswer !== wrongAnswer2 &&
      correctAnswer !== wrongAnswer3
    ) {
      db.executeQuery(`INSERT INTO public."QUESTIONS"(
      "QUESTION_CONTENT",
      "RIGHT_ANSWER",
      "WRONG_ANSWER1",
      "WRONG_ANSWER2",
      "WRONG_ANSWER3",
      "ACCOUNT_ID",
      "CREATED_DATE"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7);`, [
        questionContent,
        correctAnswer,
        wrongAnswer1,
        wrongAnswer2,
        wrongAnswer3,
        userID,
        date]
      ).then((result) => {
        resolve(true)
      })
    } else {
      resolve(false)
    }
  })
}

let getRandomQuestions = (num = 1) => {
  return new Promise((resolve, reject) => {
    db.executeQuery(`SELECT * FROM "QUESTIONS" ORDER BY RANDOM() LIMIT ${num}`)
      .then((result) => {
        resolve(result)
      })
  })
}

module.exports = {
  createQuestion,
  getRandomQuestions
}
