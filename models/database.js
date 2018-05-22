const {Client} = require('pg')
/**
 * @module
 */

/**
 * @summary Helper that sends queries to the database
 * @function
 * @public
 *
 * @param query - postgresql SQL query
 * @param values - Array of values needed for query
 * @return {Promise<any>}
 *
 * @resolves true if query was sent to the database
 * @resolves Select statement results
 * @rejects Error message from database
 */
let executeQuery = (query, values) => {
  let client = new Client({
    connectionString: process.env.DATABASE_URL
  })
  return new Promise((resolve, reject) => {
    client.connect()
    client.query(query, values, (err, res) => {
      if (err) {
        reject(err)
      } else {
        if (res.command === 'SELECT') {
          let result = JSON.stringify(res.rows)
          client.end()
          resolve(result)
        } else {
          client.end()
          resolve(true)
        }
      }
    })
  })
}

module.exports = {
  executeQuery
}
