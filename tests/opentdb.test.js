/* eslint-env jest */
const opentdb = require.requireActual('../models/opentdb')

beforeAll(() => {
  return undefined
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

describe('Data Structure', () => {
  let testStructure = {
    question: expect.anything(),
    option1: expect.anything(),
    option2: expect.anything(),
    option3: expect.anything(),
    option4: expect.anything(),
    answers: expect.anything()
  }

  test('Check data structure', async () => {
    await opentdb.retrieveToken().then(async token => {
      await opentdb.getQuestions(
        token,
        10,
        11,
        'easy',
        'multiple'
      ).then(data => {
        expect(data[0]).toEqual(testStructure)
      })
    })
  })
})
describe('Invalid Parameter', () => {
  test('should catch "Invalid Parameter" error message', async () => {
    await opentdb.getQuestions(
      'asd',
      numberOfQuestions = 1,
      category = 1,
      difficulty = 1,
      questionType = 2
    ).catch(error => {
      expect(error.message).toBe('Invalid Parameter')
    })
  })
})

describe('Retrieve/Reset Tokens', () => {
  it('should retrieve token', async () => {
    await opentdb.retrieveToken().then(token => {
      expect(token).toBeTruthy()
    })
  })

  it('should reset token', async () => {
    await opentdb.retrieveToken().then(async token => {
      expect(token).toBeTruthy()
      await opentdb.resetToken(token).then(resetToken => {
        expect(resetToken).toBeTruthy()
      })
    })
  })
})