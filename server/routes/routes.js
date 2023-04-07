const { Router } = require('express');
const controller  = require('../controllers/controllers')
const router = Router()

router.post("/converter",controller.converter_post)
router.post("/fetch-banks",controller.fetchBanks_post)
router.post("/resolve-bank",controller.resolvebank_post)

module.exports = router