const express = require('express');
const cookieParser = require('cookie-parser');
const itemsRouter = require('./routes/items.route.js');

class ExpressApp {
  constructor() {
    this.app = express();
    this.setup();
  }

  setup() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use('/api', [itemsRouter]);
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
