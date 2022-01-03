const connectToMongo = require('./db')
const express = require('express')

connectToMongo()

const app = express()
const port = 5000

// so that we can get the data from req
// means for using req
app.use(express.json())

// Available routes
app.use('/api/auth', require("./routes/auth"))
app.use('/api/notes', require("./routes/notes"))

app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`)
})