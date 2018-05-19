const {Client} = require('pg')

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
