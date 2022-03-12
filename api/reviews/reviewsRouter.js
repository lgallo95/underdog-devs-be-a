const express = require('express');
const Review = require('./reviewsModel');
const Profiles = require('../profile/profileModel');
const router = express.Router();
const { adminRequired } = require('../middleware/permissionsRequired');
const authRequired = require('../middleware/authRequired');

//Get all reviews

router.get('/', authRequired, adminRequired, (req, res) => {
  Review.findAll()
    .then((reviews) => {
      res.status(200).json(reviews);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

//Get all reviews by mentor's id

router.get('/mentor/:id', authRequired, validProfileID, (req, res) => {
  const id = req.params.id;
  Review.findByMentorId(id)
    .then((reviews) => {
      if (reviews) {
        res.status(200).json(reviews);
      } else {
        res.status(404).json({ error: 'Reviews Not Found, Check mentor ID' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

//get all mentee reviews by mentee_id

router.get('/mentee/:id', authRequired, validProfileID, (req, res) => {
  const id = req.params.id;
  Review.findByMenteeId(id)
    .then((reviews) => {
      if (reviews) {
        res.status(200).json(reviews);
      } else {
        res.status(404).json({ error: 'Reviews Not Found, Check mentor ID' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

////////////////MIDDLEWARE////////////////

// Validate profile id

function validProfileID(req, res, next) {
  Profiles.findById(req.params.id)
    .then((profile) => {
      if (profile) {
        req.profile = profile;
        next();
      } else {
        res.status(400).json({
          message: 'Invalid ID',
        });
      }
    })
    .catch(next);
}

module.exports = router;
