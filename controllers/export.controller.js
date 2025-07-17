const ExcelExportLog = require('../models/ExcelExportLog');

exports.getExportLogs = async (req, res) => {
  const logs = await ExcelExportLog.find()
    .populate('exportedBy')
    .sort({ createdAt: -1 });
  res.json(logs);
};
