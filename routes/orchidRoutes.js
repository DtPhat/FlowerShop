const express = require('express')
const router = express.Router()
const {
  getOrchids,
  getOrchid,
  createOrchid,
  updateOrchid,
  deleteOrchid,
} = require('../controllers/orchidController')
const { ensureAuthenticated, verifyAdmin } = require('../config/auth')

router.route('/')
  .get(ensureAuthenticated, verifyAdmin, getOrchids)
  .post(ensureAuthenticated, verifyAdmin, createOrchid)
router.route('/:id')
  .get(ensureAuthenticated, verifyAdmin, getOrchid)
  .put(ensureAuthenticated, verifyAdmin, updateOrchid)
  .delete(ensureAuthenticated, verifyAdmin, deleteOrchid)


module.exports = router