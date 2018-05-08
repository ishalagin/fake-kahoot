const {Client} = require('pg')

let executeQuery = (query) => {
  let client = new Client({
    connectionString: "postgres://postgres:20lipna1999@localhost:5432/kahoot_local"
  })
  return new Promise((resolve, reject) => {
    client.connect()
    client.query(query, (err, res) => {
      if (err) {
        console.log(err)
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
