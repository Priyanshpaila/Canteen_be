const mongoose = require("mongoose");

const excelExportLogSchema = new mongoose.Schema(
  {
    exportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exportType: {
      type: String,
      enum: ["monthly", "guest", "individual"],
      required: true,
    },
    periodStart: { type: Date },
    periodEnd: { type: Date },
    fileUrl: { type: String }, // if saved to S3 or local path
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExcelExportLog", excelExportLogSchema);
