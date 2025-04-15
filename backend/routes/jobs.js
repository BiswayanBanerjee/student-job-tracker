const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

router.post('/', createJob);
router.get('/', getJobs);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
