const { GoogleGenAI } = require('@google/genai');
const env = require('../config/env');

let aiClient = null;

if (env.AI_TRIAGE_ENABLED && env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
}

/**
 * Generates an advisory triage report for a given incident.
 * @param {Object} incident - The incident object from MongoDB.
 * @returns {Promise<Object|null>} - The triage result object or null if failed.
 */
const generateIncidentTriage = async (incident) => {
  if (!env.AI_TRIAGE_ENABLED || !env.GEMINI_API_KEY || !aiClient) {
    console.log('[AI Triage] Triage service is disabled or GEMINI_API_KEY is missing.');
    return null;
  }

  try {
    const { title, description, type, severity, location } = incident;
    const address = location?.address || 'N/A';
    const coordinates = location?.coordinates ? JSON.stringify(location.coordinates) : 'N/A';

    const prompt = `You are an expert emergency services dispatcher and incident triage AI.
Analyze the following emergency incident report:
Title: ${title}
Type: ${type}
Severity: ${severity}
Description: ${description}
Location: ${address} (${coordinates})

Evaluate the report and provide an advisory triage assessment in JSON format.
Requirements:
1. "shortSummary": A concise summary (1-2 sentences) of the situation.
2. "riskScore": An integer from 1 to 100 representing the severity and hazard level.
3. "recommendedPriority": Advisory priority recommendation. Must be one of: 'low', 'medium', 'high', 'critical'.
4. "likelyRisks": An array of potential secondary hazards or risks that responders should prepare for.
5. "immediateActions": An array of immediate actions for the command center or emergency dispatchers.
6. "responderChecklist": A tactical checklist (array of strings) for the first responders on the scene.
7. "citizenSafetyNote": A simple and safe safety note/advice for nearby citizens. Keep it practical and warn them to stay clear.
8. "confidence": AI confidence level in this triage. Must be one of: 'low', 'medium', 'high'.
9. "disclaimer": Must be exactly: "AI suggestions are advisory. Final action should be verified by authorized responders."

Do not include any medical diagnosis or panic language. Keep suggestions practical and aimed at command teams and responders. Mention human verification where appropriate.`;

    const responseSchema = {
      type: 'object',
      properties: {
        shortSummary: { type: 'string' },
        riskScore: { type: 'integer' },
        recommendedPriority: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical']
        },
        likelyRisks: {
          type: 'array',
          items: { type: 'string' }
        },
        immediateActions: {
          type: 'array',
          items: { type: 'string' }
        },
        responderChecklist: {
          type: 'array',
          items: { type: 'string' }
        },
        citizenSafetyNote: { type: 'string' },
        confidence: {
          type: 'string',
          enum: ['low', 'medium', 'high']
        },
        disclaimer: { type: 'string' }
      },
      required: [
        'shortSummary',
        'riskScore',
        'recommendedPriority',
        'likelyRisks',
        'immediateActions',
        'responderChecklist',
        'citizenSafetyNote',
        'confidence',
        'disclaimer'
      ]
    };

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response text from Gemini API');
    }

    const triageData = JSON.parse(responseText);

    // Enforce disclaimer is exactly as required
    triageData.disclaimer = "AI suggestions are advisory. Final action should be verified by authorized responders.";
    triageData.generatedAt = new Date();
    triageData.provider = 'Gemini';

    return triageData;
  } catch (error) {
    console.error('[AI Triage Error] Failed to generate triage analysis:', error.message);
    return null;
  }
};

module.exports = {
  generateIncidentTriage
};
