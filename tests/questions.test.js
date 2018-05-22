/* eslint-env jest */
const usersM = require.requireActual('../models/users')
const questions = require.requireActual('../controllers/questions')
const account = require.requireActual('../models/account')
let instanceQuestions
let instanceUser
let instanceUsers
beforeAll(() => {
  instanceQuestions = new questions.Questions()
  instanceUser = new account.Account()
  instanceUser = new account.Account()
})

afterAll(() => {
  return undefined
})

beforeEach(() => {
  return undefined
})

afterEach(() => {
  return undefined
})

describe('Testing methods in Question Class', () => {
  test('Testing assessQuestionResult; Answer True', () => {
    instanceQuestions.getQuestions().then(data => {
      instanceQuestions.questionsList[1].answers = 1
      expect(instanceQuestions.assessQuestionResult(instanceUser, 1, 1))
        .toEqual({
          answer: instanceQuestions.questionsList[1][`option${1}`],
          result: true,
          currentUser: instanceUser
        })
    })
  })

  test('Testing assessQuestionResult; Answer False', () => {
    instanceQuestions.getQuestions().then(data => {
      instanceQuestions.questionsList[1].answers = 1
      expect(instanceQuestions.assessQuestionResult(instanceUser, 1, 2))
        .toEqual({
          answer: instanceQuestions.questionsList[1][`option${1}`],
          result: false,
          currentUser: instanceUser
        })
    })
  })

  test('test double the user score if the answer to bonus question is correct',
    async () => {
      instanceQuestions.getQuestions().then(data => {
        instanceQuestions.questionsList[10] = {
          'question': 'Hello',
          'option1': 'World',
          'option2': 'Hello',
          'option3': 'Again',
          'option4': '!',
          'answers': 1
        }
        instanceUser.currentScore.userScore = 500
        instanceQuestions.assessQuestionResult(instanceUser, 10, 1)
        expect(instanceUser.currentScore.userScore === 1000).toBe(true)
      })
    })
  test('test storeQuizResult', async () => {
    expect(typeof instanceQuestions.storeQuizResult(instanceUsers))
      .toBe('string')
  })
})

test('test getQuestions', async () => {
  let testStructure = {
    index: expect.anything(),
    question: expect.anything(),
    option1: expect.anything(),
    option2: expect.anything(),
    option3: expect.anything(),
    option4: expect.anything()
  }
  await instanceQuestions.getQuestions().then(data => {
    expect(data[0]).toEqual(testStructure)
  })
})
