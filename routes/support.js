const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
  res.send(`<!doctype html>
<html>
<head>
  <title>Support • Cobra Freight Portal</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="navbar">
    <span class="brand">🟢 COBRA FREIGHT</span>
    <a href="/dashboard">Dashboard</a>
    <a href="/profile">Profile</a>
    <a href="/triplog">Trip Log</a>
    <a href="/dvir">DVIR</a>
    <a class="active" href="/support">Support</a>
    <a class="right" href="/logout">Logout</a>
  </div>
  <main>
    <h2>Driver Support</h2>
    <p>Submit issues or internal notes here. (Coming soon.)</p>
  </main>
</body>
</html>`);
});

module.exports = router;
