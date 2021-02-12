const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const response = {
    message: 'Hello World ! :D',
  };

  return res.status(200).json(response);
  //Vous pouvez aussi faire à la place de la ligne précedente : return res.status(200).json(response);
});

app.listen(8080, function() {
  console.log(`server listening on 8080`);
});