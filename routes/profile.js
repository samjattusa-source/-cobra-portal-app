const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
  res.send(`<!doctype html>
<html>
<head>
  <title>Profile • Cobra Freight Portal</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="navbar">
    <span class="brand">🟢 COBRA FREIGHT</span>
    <a href="/dashboard">Dashboard</a>
    <a class="active" href="/profile">Profile</a>
    <a href="/triplog">Trip Log</a>
    <a href="/dvir">DVIR</a>
    <a href="/support">Support</a>
    <a class="right" href="/logout">Logout</a>
  </div>
  <main>
    <h2>Driver Profile</h2>
    <p><strong>Name:</strong> Sam Deol</p>
    <p><strong>Phone:</strong> (562) 294-9516</p>
    <p><strong>Email:</strong> cobrafreight@yahoo.com</p>
    <p><strong>Home Terminal:</strong> Phoenix, AZ</p>
  </main>
</body>
</html>`);
});

module.exports = router;
