const express = require('express');
const Database = require('./models');
const database = new Database();
database.connect();

class ExpressApp {
  constructor() {
    this.app = express();
    this.setup();
  }

  setup() {
    this.app.get('/', (req, res) => {
      res.send('Hello, World!');
    });
  }

  start(port) {
    this.app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
}

const myApp = new ExpressApp();
myApp.start(3000);
