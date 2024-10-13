const express = require('express');
const {UserGiveFeeback} = require('../controller/UserFeedback');
const router = express.Router();

router.post('/feedback/:assessmentId', UserGiveFeeback);

module.exports = router;
