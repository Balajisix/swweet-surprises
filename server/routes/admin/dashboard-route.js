const express = require("express");
const router = express.Router();
const { getAdminDashboardStats } = require("../../controllers/admin/dashboard-controller");

router.get("/dashboard-stats", getAdminDashboardStats);

module.exports = router;
