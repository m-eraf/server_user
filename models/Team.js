const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
  },
  members: [
    {
      user: {
        type: String,
      },
      domain: {
        type: String,
      },
      availability: {
        type: Boolean,
      },
    },
  ],
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
