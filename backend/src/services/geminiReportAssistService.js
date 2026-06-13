const { GoogleGenAI } = require('@google/genai');
const env = require('../config/env');

let aiClient = null;

if (env.AI_TRIAGE_ENABLED && env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
}

/**
 * Analyzes a rough natural language description of an incident and suggests structured fields.
 * @param {Object} params
 * @param {string} params.text
 * @param {string} [params.location]
 * @param {Object} [params.coordinates]
 * @returns {Promise<Object|null>}
 */
const analyzeIncidentReportDraft = async ({ text, location, coordinates }) => {
  if (!env.AI_TRIAGE_ENABLED || !env.GEMINI_API_KEY || !aiClient) {
    console.log('[AI Report Assist] Service is disabled or GEMINI_API_KEY is missing.');
    return null;
  }

  try {
    const locStr = location ? `Location: ${location}` : '';
    const coordsStr = coordinates ? `Coordinates: ${JSON.stringify(coordinates)}` : '';

    const prompt = `You are an emergency response AI assistant. Your task is to analyze a citizen's rough, natural language description of an incident and suggest structured reporting fields.

Citizen Draft:
"${text}"
${locStr}
${coordsStr}

Provide suggestions in strict JSON format matching the schema details below.

Requirements:
1. suggestedTitle: Create a short, descriptive title (under 10 words).
2. suggestedType: Must be exactly one of the following enums: 'fire', 'flood', 'medical', 'accident', 'crowd', 'rescue', 'other'. Pick the most appropriate.
3. suggestedSeverity: Must be exactly one of the following enums: 'low', 'medium', 'high', 'critical'. Pick the most appropriate.
4. improvedDescription: Reword the draft to be clear, objective, and professional for responders, while preserving all key details.
5. missingQuestions: A list of 1-3 specific follow-up questions to ask the citizen to clarify critical missing details (e.g. number of victims, active hazards).
6. citizenSafetyTips: A list of 1-3 immediate, actionable safety tips for the citizen to stay safe on site. Do not include panic language.
7. confidence: The confidence in these suggestions. Must be one of: 'low', 'medium', 'high'.
8. disclaimer: Must be exactly: "AI suggestions are advisory. Please verify details before submitting."

Strict rules:
- No medical diagnosis.
- No panic language.
- Do not claim certainty.
- Keep suggestions short, helpful, and practical.`;

    const responseSchema = {
      type: 'object',
      properties: {
        suggestedTitle: { type: 'string' },
        suggestedType: {
          type: 'string',
          enum: ['fire', 'flood', 'medical', 'accident', 'crowd', 'rescue', 'other']
        },
        suggestedSeverity: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical']
        },
        improvedDescription: { type: 'string' },
        missingQuestions: {
          type: 'array',
          items: { type: 'string' }
        },
        citizenSafetyTips: {
          type: 'array',
          items: { type: 'string' }
        },
        confidence: {
          type: 'string',
          enum: ['low', 'medium', 'high']
        },
        disclaimer: { type: 'string' }
      },
      required: [
        'suggestedTitle',
        'suggestedType',
        'suggestedSeverity',
        'improvedDescription',
        'missingQuestions',
        'citizenSafetyTips',
        'confidence',
        'disclaimer'
      ]
    };

    let response;
    let attempts = 0;
    const maxAttempts = 3;
    let delay = 1000;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema
          }
        });
        break;
      } catch (err) {
        console.warn(`[AI Report Assist] Attempt ${attempts} failed: ${err.message}`);
        if (attempts >= maxAttempts) {
          throw err;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response text from Gemini API');
    }

    const suggestions = JSON.parse(responseText);

    // Enforce disclaimer exactly as required
    suggestions.disclaimer = "AI suggestions are advisory. Please verify details before submitting.";

    return suggestions;
  } catch (error) {
    console.error('[AI Report Assist Error] Failed to generate suggestions:', error.message);
    return null;
  }
};

module.exports = {
  analyzeIncidentReportDraft
};
