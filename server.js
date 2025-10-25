require('dotenv').config();
const express = require('express');
const session = require('express-session');
const dashboard = require('./routes/dashboard');
const dvir = require('./routes/dvir');
const triplog = require('./routes/triplog');
const support = require('./routes/support');
const profile = require('./routes/profile');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Demo/admin creds (override with env)
const ADMIN_USER = process.env.ADMIN_USER || process.env.DEMO_USER || 'sam';
const ADMIN_PASS = process.env.ADMIN_PASS || process.env.DEMO_PASS || 'a-strong-password-here';

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'cobra-demo-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));
app.use(express.static(path.join(__dirname, 'public')));

function requireAuth(req, res, next) {
if (req.session && req.session.authed) return next();
  return res.redirect('/login?msg=Please%20log%20in');
}

const baseCss = `
  :root{
    --bg:#0b1220; --card:#101a31; --muted:#99a7c9; --border:#1f2a44;
    --text:#e7eefc; --brand:#3b82f6; --brand2:#22d3ee; --good:#22c55e;
  }
  *{box-sizing:border-box} body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:var(--text);background:var(--bg)}
  .wrap{max-width:980px;margin:24px auto;padding:0 18px}
  .card{background:var(--card);border:1px solid var(--border);border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.35)}
  .btn{display:inline-block;color:#fff;background:linear-gradient(90deg,var(--brand),var(--brand2));padding:10px 14px;border-radius:10px;text-decoration:none;border:0;cursor:pointer}
  .muted{color:var(--muted)} .field{width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--border);background:#0e1730;color:var(--text)}
  table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden}
  th,td{padding:12px 14px;border-bottom:1px solid var(--border);text-align:left} th{color:#aabbdf} tr:last-child td{border-bottom:none}
  header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:#0e1730;border-bottom:1px solid var(--border)}
  .brand{display:flex;gap:12px;align-items:center}
  .brand img{height:34px}
  .title{font-weight:800;letter-spacing:.5px}
`;

app.get('/', (req,res)=> res.redirect((req.session && req.session.authed) ? '/dashboard' : '/login'));

app.get('/login', (req, res) => {
  const msg = req.query.msg ? decodeURIComponent(req.query.msg) : '';
  res.send(`<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Cobra Portal • Login</title>
<style>${baseCss}
  main{min-height:100vh;display:grid;place-items:center;padding:24px}
  .login{max-width:420px;width:92%;padding:26px}
  .logo{display:flex;justify-content:center;margin-bottom:12px}
</style>
</head>
<body>
  <main>
    <div class="card login">
      <div class="logo"><img src="/logo.svg" alt="Cobra Freight"></div>
      <h1 class="title" style="text-align:center;margin:6px 0 14px;">Cobra Freight Portal</h1>
      <p class="muted" style="text-align:center;margin-top:0;">Sign in to continue</p>
      ${msg ? `<p style="color:#ff9b9b;text-align:center;margin:8px 0">${msg}</p>` : ''}
      <form method="POST" action="/login">
        <label>Username</label>
        <input class="field" name="username" autocomplete="username" required />
        <div style="height:10px"></div>
        <label>Password</label>
        <input class="field" type="password" name="password" autocomplete="current-password" required />
        <div style="height:16px"></div>
        <button class="btn" style="width:100%;">Sign In</button>
      </form>
      <p class="muted" style="text-align:center;margin:10px 0 0">Demo: <code>${ADMIN_USER}</code> / <code>${ADMIN_PASS}</code></p>
    </div>
  </main>
</body></html>`);
});

app.post('/login', (req,res)=>{
  const {username, password} = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASS){
    req.session.authed = true; req.session.user = { username };
    return res.redirect('/dashboard');
  }
  return res.redirect('/login?msg=Invalid%20credentials');
});

app.get('/logout', (req,res)=> req.session.destroy(()=> res.redirect('/login?msg=Signed%20out')));

app.get('/dashboard', requireAuth, (req, res) => {
  const rows = [
    { id: 'D-1001', name: 'Alex R.', status: 'On Duty', last: 'PHX → LV' },
    { id: 'D-1002', name: 'Jamie C.', status: 'Off Duty', last: 'LA → SF' },
    { id: 'D-1003', name: 'Sam K.', status: 'On Route', last: 'DAL → ABQ' },
  ].map(r=>`<tr><td>${r.id}</td><td>${r.name}</td><td>${r.status}</td><td>${r.last}</td></tr>`).join('');
  res.send(`<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Cobra Portal • Dashboard</title>
<style>${baseCss}</style>
</head>
<body>
<header>
  <div class="brand">
    <img src="/logo.svg" alt="Cobra Freight"/>
    <div class="title">Cobra Freight Portal</div>
  </div>
  <nav><a class="btn" href="/logout">Logout</a></nav>
</header>
<main class="wrap">
  <h2 style="margin:18px 0">Drivers</h2>
  <div class="card">
    <table>
      <thead><tr><th>ID</th><th>Name</th><th>Status</th><th>Last Load</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</main>
</body></html>`);
});
app.use('/dashboard', requireAuth, require('./routes/dashboard'));
app.use('/profile',   requireAuth, require('./routes/profile'));
app.use('/support',   requireAuth, require('./routes/support'));
app.use('/dvir',      requireAuth, require('./routes/dvir'));
app.use('/triplog',   requireAuth, require('./routes/triplog'));

app.listen(PORT, ()=> console.log('Cobra Portal running on :'+PORT));
app.get("/health", (_req,res)=>res.send("ok"));
