const request = require('superagent');
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

app.use('/auth', authRoutes);

app.use('/api', ensureAuth);

app.get('/api/test', (req, res) => {
  res.json({
    message: `in this protected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/api/questions', async(req, res) => {
  const questionData = await request.get(`https://opentdb.com/api.php?${req.query.searchQuery}`);

  res.json(questionData.body);

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

app.delete('/api/favorites/:id', async(req, res) => {
  const favoriteToDelete = req.params.id;
  try {
    await client.query(`
    DELETE FROM favorites 
      WHERE favorites.id = $1 AND favorites.user_id = $2
      `, [favoriteToDelete, req.userId]);
    
    res.json({ success: true });
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});



app.use(require('./middleware/error'));

module.exports = app;
