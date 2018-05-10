const userQuestions = require('../models/userQuestions')
const db = require('../models/database')

beforeAll(() => {
	db.executeQuery(`DELETE FROM public."QUESTIONS" WHERE "QUESTION_CONTENT" = 'What is my name?';`)
})

test ('Test if createQuestion works', async () => {
	await expect(userQuestions.createQuestion(
					'What is my name?',
					'Shanyu',
					'Pedram',
					'Maksym',
					'Derek'
		)).toEqual(true)
})
