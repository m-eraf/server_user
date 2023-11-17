const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const teamRoutes = require('./routes/teamRoutes');
const userRoutes = require('./routes/userRoutes'); // Import the new user routes
const PORT = 8080;

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://KCCStoreDB:KCCStore123@cluster0.ilok18h.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dbConnection = mongoose.connection;
dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
dbConnection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use("/team", teamRoutes);
app.use("/api/users", userRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
