require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const itemsRouter = require('./routes/items.route.js');
const orderItemsRouter = require('./routes/order-items.route.js');
const orderCustomersRouter = require('./routes/order-customers.route.js');
const optionsRouter = require('./routes/options.route.js');
const { myCache, cacheOptions } = require('./routeCache.js');

class ExpressApp {
  constructor() {
    this.app = express();
    this.setup();
  }

  setup() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use('/api', [itemsRouter, orderItemsRouter, orderCustomersRouter, optionsRouter]);
    this.app.get('/', (req, res) => {
      res.send('Hello, World!');
    });
    cacheOptions();
    this.app.get('/options', (req, res) => {
      const options = myCache.get(process.env.CACHE_KEY);
      res.json({ options });
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
