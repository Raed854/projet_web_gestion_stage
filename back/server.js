const express = require('express');
const sequelize = require('./db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(express.json());

// Allow CORS for localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use('/users', userRoutes);

sequelize.sync() // { force: true } to drop and recreate
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.error('Database sync error:', err));
