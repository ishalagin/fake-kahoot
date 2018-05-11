const db = require('./database')

let createQuestion = (Q,CA,WA1,WA2,WA3,user_id) => {
	return new Promise((resolve, reject) => {
		if (Q != '' && CA != '' && WA1 != '' && WA2 != '' && WA3 != '' && user_id != ''){
			db.executeQuery(`INSERT INTO public."QUESTIONS"("QUESTION_CONTENT", "RIGHT_ANSWER", "WRONG_ANSWER1", "WRONG_ANSWER2", "WRONG_ANSWER3", "ACCOUNT_ID") VALUES ('${Q}','${CA}','${WA1}','${WA2}','${WA3}',${user_id});`).then((result) => {
				resolve(true)
			})
		} else {
			resolve(false)
		}
	})
}

module.exports = {
  createQuestion
}
