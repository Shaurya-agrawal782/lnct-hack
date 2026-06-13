const geminiReportAssistService = require('../services/geminiReportAssistService');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');

// @desc    Analyze a rough incident report draft using Gemini AI
// @route   POST /api/ai/report-assist
// @access  Private (citizen, admin)
const analyzeReportDraft = asyncHandler(async (req, res, next) => {
  const { text, location, coordinates } = req.body;

  // 1. Check if GEMINI_API_KEY is missing or AI_TRIAGE_ENABLED is false
  if (!env.GEMINI_API_KEY || !env.AI_TRIAGE_ENABLED) {
    return res.status(200).json({
      success: false,
      message: "AI report assistant is currently unavailable. You can continue manually."
    });
  }

  // 2. Validate input text
  if (!text) {
    return res.status(400).json({
      success: false,
      message: "Text field is required."
    });
  }

  if (typeof text !== 'string' || text.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: "Text must be at least 10 characters long."
    });
  }

  // 3. Call service
  const suggestions = await geminiReportAssistService.analyzeIncidentReportDraft({
    text: text.trim(),
    location,
    coordinates
  });

  if (!suggestions) {
    return res.status(200).json({
      success: false,
      message: "AI report assistant is currently unavailable. You can continue manually."
    });
  }

  // 4. Return successful suggestions
  return res.status(200).json({
    success: true,
    data: suggestions
  });
});

module.exports = {
  analyzeReportDraft
};
