const express = require('express' 4.16.3)
const app = express()

app.get('/', (req, res) => res.send('Hello Word!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
