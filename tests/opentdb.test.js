/* eslint-env jest */
const opentdb = require.requireActual('../models/opentdb')

beforeAll(() => {
  return undefined
})

afterAll(() => {
  return undefined
})

/**
 * If beforeEach is inside a describe block, it runs for each test in the describe block.
 */
beforeEach(() => {
  return undefined
})

/**
 * If afterEach is inside a describe block, it runs for each test in the describe block.
 */
afterEach(() => {
  return undefined
})

describe('Testing the Open Trivia Database API', () => {
  let testStructure = {
    question: expect.anything(),
    option1: expect.anything(),
    option2: expect.anything(),
    option3: expect.anything(),
    option4: expect.anything(),
    answers: expect.anything()
  }

  test('Check data structure', async () => {
    await opentdb.getQuestions().then(data => {
      expect(data[0]).toEqual(testStructure)
    }).catch(error => {
      expect(error.message).toBe('Invalid Parameter')
    })
  })

  test('should catch "Invalid Parameter" error message', async () => {
    await opentdb.getQuestions(
      numberofQuestions = 1,
      category = 1,
      difficulty = 1,
      questionType = 2
    ).catch(error => {
      expect(error.message).toBe('Invalid Parameter')
    })
  })
})
