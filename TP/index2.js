const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const response = {
    message: 'Hello World ! :D',
  };

  return res.status(200).json(response);
  //Vous pouvez aussi faire à la place de la ligne précedente : return res.status(200).json(response);
});

app.get('/users', function(req, res) {
    const users = [
      {
         id: '1234',
         name: 'user1',
      },
      {
        id: '1234',
        name: 'user1',
      },
    ];
    
    return res.status(200).json(users);
  });

  app.get('/users/:id', function(req, res) {
    const userId = req.params.id;
    const userName = req.params.id;
    
    return res.statut(200).json(userName);
  });
  
  app.listen(8080, function() {
    console.log(`server listening on 8080`);
  });