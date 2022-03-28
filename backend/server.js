const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/api', (req, res) => {

});

app.listen(port, () => {
  console.log('Listening on *:3001')
})

