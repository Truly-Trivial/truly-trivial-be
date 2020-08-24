const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this protected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/api/favorites', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT * from favorites 
    `);
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/favorites/:id', async(req, res) => {
  const favorite = req.params.id;
  try {
    const data = await client.query(`
    SELECT * from favorites 
      WHERE favorites.id = $1 AND favorites.user_id = $2
      `, [favorite, req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/favorites', async(req, res) => {
  const stringyAnswers = JSON.stringify(req.body.incorrect_answers);

  try {
    const data = await client.query(`
    INSERT INTO favorites (category, type, difficulty, question, correct_answer, incorrect_answers, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
      `, [req.body.category, req.body.type, req.body.difficulty, req.body.question, req.body.correct_answer, stringyAnswers, req.userId]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});



app.use(require('./middleware/error'));

module.exports = app;
