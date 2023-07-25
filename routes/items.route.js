const express = require('express');
const router = express.Router();

router.post('/items', () => {
  console.log('item router');
});

module.exports = router;
