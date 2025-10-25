const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  res.send('<h1>Driver Dashboard</h1><p>Loads, pay, links to DVIR & Trip Log will go here.</p>');
});
module.exports = router;
