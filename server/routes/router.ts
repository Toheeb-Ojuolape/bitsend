import { converter_post } from "../controllers/converter";
import { fetchBanks_post } from "../controllers/fetchBanks";
import { generateInvoice_post } from "../controllers/generateInvoice";
import { resolvebank_post } from "../controllers/resolveBank";
import { sendemail_post } from "../controllers/sendNotification";
const { Router } = require('express');

const router = Router();

router.post("/converter", converter_post);
router.post("/fetch-banks",fetchBanks_post);
router.post("/resolve-bank", resolvebank_post);
router.post("/generate-invoice", generateInvoice_post);
router.post("/send-email",sendemail_post)

module.exports = router