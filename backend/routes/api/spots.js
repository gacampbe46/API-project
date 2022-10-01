const express = require('express');
const{ query, check } = require('express-validator');
const router = express.Router();

const { requireAuth, requireAuthRole } = require('../../utils/auth');
const { User, SpotImages, Spot, Reviews, ReviewImages, Bookings } = require('../../db/models')


module.exports = router;
