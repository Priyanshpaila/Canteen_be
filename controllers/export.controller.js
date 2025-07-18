const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const Meal = require('../models/Meal');
const ExcelExportLog = require('../models/ExcelExportLog');
const User = require('../models/User');

exports.exportMonthlyMealReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    // Fetch meals in date range
    const meals = await Meal.find({ date: { $gte: start, $lte: end } })
      .populate('user', 'fullName division department designation')
      .sort({ 'user.fullName': 1, date: 1 });

    const users = await User.find().select('fullName division department designation');

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Monthly Meal Report');

    // Create date headers
    const daysInMonth = new Date(year, month, 0).getDate();
    const dateHeaders = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);

    sheet.columns = [
      { header: 'Name', key: 'fullName', width: 20 },
      { header: 'Division', key: 'division', width: 15 },
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Designation', key: 'designation', width: 15 },
      ...dateHeaders.map(d => ({ header: d, key: `d${d}`, width: 4 })),
      { header: 'Total Meals', key: 'totalMeals', width: 12 },
      { header: 'Total Amount', key: 'totalAmount', width: 12 },
    ];

    // Map user meals
    for (const user of users) {
      const row = {
        fullName: user.fullName,
        division: user.division || '',
        department: user.department || '',
        designation: user.designation || '',
        totalMeals: 0,
        totalAmount: 0,
      };

      for (let i = 1; i <= daysInMonth; i++) {
        const day = new Date(year, month - 1, i);
        const meal = meals.find(
          m =>
            m.user?._id.toString() === user._id.toString() &&
            new Date(m.date).getDate() === i
        );

        if (meal) {
          if (meal.status === 'ate') {
            row[`d${i}`] = '✅';
            row.totalMeals += 1;
            row.totalAmount += meal.price || 0;
          } else if (meal.status === 'missed') {
            row[`d${i}`] = '❌';
          } else {
            row[`d${i}`] = '🟨';
          }
        } else {
          row[`d${i}`] = '🟨';
        }
      }

      sheet.addRow(row);
    }

    const fileName = `monthly_meal_report_${year}_${month}_${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, '..', 'exports', fileName);

    // Ensure export directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    await workbook.xlsx.writeFile(filePath);

    // Save log
    await ExcelExportLog.create({
      exportedBy: req.user._id,
      exportType: 'monthly-meals',
      periodStart: start,
      periodEnd: end,
      fileUrl: `/exports/${fileName}`,
    });

    res.download(filePath, fileName);
  } catch (err) {
    res.status(500).json({ message: 'Export failed', error: err.message });
  }
};
