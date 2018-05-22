const request = require('request')

/**
 * @summary Gets questions from qriusity by category
 * @module
 * @deprecated use getQuestionByCategory instead of this
 * @param categoryID
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
let getQuestionByCategory = (categoryID, page = 0, limit = 10) => {
  if (page <= 0) {
    page = String(Math.floor((Math.random() * 50) + 1))
  }

  return new Promise((resolve, reject) => {
    request({
      url: `https://qriusity.com/v1/categories/
      ${encodeURIComponent(categoryID.toString())}/questions?
      page=${encodeURIComponent(page.toString())}&
      limit=${encodeURIComponent(limit.toString())}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        reject(new Error('Cannot connect to TMDB.'))
      } else if (body.code === 400) {
        reject(new Error('Invalid query.'))
      } else {
        resolve(body)
      }
    })
  })
}

/**
 * @deprecated use getQuestionByCategory in opentdb.js instead of this
 * @param questionAmount
 * @param categoryType
 * @returns {Promise<any>}
 */
let getQuestionsNewApi = (questionAmount, categoryType) => {
  return new Promise((resolve, reject) => {
    request({
      url: `https://opentdb.com/api.php?
      amount=${encodeURIComponent(questionAmount)}&
      category=${encodeURIComponent(categoryType)}&
      type=multiple`,
      json: true
    }, (error, response, body) => {
      if (error) {
        reject(new Error(`can't connect`))
      } else {
        resolve(body)
      }
    })
  })
}

/**
 * Exports modules
 * @type {{getQuestionByCategory: function(*, *=, *=): Promise<any>,
 * getQuestionsNewApi: function(*=, *=): Promise<any>}}
 */
module.exports = {
  getQuestionByCategory,
  getQuestionsNewApi
}
