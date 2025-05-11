const express = require('express');
const sequelize = require('./db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const stageRoutes = require('./routes/stageRoutes');
const messageRoutes = require('./routes/messageRoutes');
const compteRenduRoutes = require('./routes/compteRenduRoutes');
const commentaireRoutes = require('./routes/commentaireRoutes');
const tacheRoutes = require('./routes/tacheRoutes');

const app = express();
const PORT = 5000;

app.use(express.json());

// Allow CORS for localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
}));

// Middleware to log API calls and 404s
function logApiCall(req, res, next) {
  console.log(`[API] ${req.method} ${req.originalUrl} called`);
  next();
}

// Log all API calls
app.use(logApiCall);

app.use('/users', userRoutes);
app.use('/stages', stageRoutes);
app.use('/messages', messageRoutes);
app.use('/compteRendus', compteRenduRoutes);
app.use('/commentaires', commentaireRoutes);
app.use('/taches', tacheRoutes);

// 404 handler for API
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/users') || req.originalUrl.startsWith('/stages') || req.originalUrl.startsWith('/messages') || req.originalUrl.startsWith('/compteRendus') || req.originalUrl.startsWith('/commentaires') || req.originalUrl.startsWith('/taches')) {
    console.log(`[API 404] ${req.method} ${req.originalUrl} not found`);
  }
  next();
});

sequelize.sync() // { force: true } to drop and recreate
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.error('Database sync error:', err));

module.exports = app;
