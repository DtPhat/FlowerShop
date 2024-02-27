const express = require('express')
const router = express.Router()
const {
  getOrchids,
  getOrchid,
  createOrchid,
  updateOrchid,
  deleteOrchid
} = require('../controllers/orchidController')

router.route('/').get(getOrchids).post(createOrchid)
router.route('/:id').get(getOrchid).put(updateOrchid).delete(deleteOrchid)

module.exports = router