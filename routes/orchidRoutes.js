const express = require('express')
const router = express.Router()
const {
  getOrchids,
  getOrchid,
  createOrchid,
  updateOrchid,
  deleteOrchid
} = require('../controllers/orchidController')
const authenticate = require('../authenticate');

router.route('/')
  .get(getOrchids)
  .post(authenticate.verifyUser, createOrchid)
router.route('/:id')
  .get(authenticate.verifyUser, getOrchid)
  .put(authenticate.verifyUser, updateOrchid)
  .delete(authenticate.verifyUser, deleteOrchid)

module.exports = router