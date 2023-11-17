const express = require('express');
const router = express.Router();
const Team = require('../models/Team'); // You need to define your Team model

// Route to create a new team
router.post('/api/team', async (req, res) => {
    try {
        const { teamName, selectedUsers } = req.body;
            const team = new Team({
          teamName,
          members: selectedUsers.map(user => ({
            user: user.first_name,
            domain: user.domain,
            availability: user.availability,
          })),
        });
        const savedTeam = await team.save();
    
        res.json(savedTeam);
      } catch (error) {
        console.error('Error creating team', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    router.get('/api/teams', async (req, res) => {
        try {
          const teams = await Team.find();
          res.json(teams);
        } catch (error) {
          console.error('Error fetching teams', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
// Route to get team details by ID
router.get('/api/teams/:id', async (req, res) => {
    try {
      const teamId = req.params.id;
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
  
      const members = await User.find({ team: teamId });
      const teamDetails = {
        _id: team._id,
        teamName: team.teamName,
        members: members,
      };
  
      res.json(teamDetails);
    } catch (error) {
      console.error('Error fetching team details', error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
