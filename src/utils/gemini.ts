import doActionSchema from '../../schemas/doAction.schema.json';
import sayActionSchema from '../../schemas/sayAction.schema.json';

// In a Vite/Next.js project, get the key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("VITE_GEMINI_API_KEY is not defined. Please set it in your .env.local file.");
}

export async function callGeminiApi(promptText: string) {
    if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    // FIX 1: Use a valid and current model name
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    console.log(doActionSchema);

    const responseSchema = {
        anyOf: [
            { ...doActionSchema },
            { ...sayActionSchema },
        ]
    };

    const requestBody = {
        contents: [
            {
                parts: [
                    { text: promptText }
                ]
            }
        ],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();

        if (!response.ok) {
            // Log the full error response from the API for better debugging
            console.error("Gemini API Error Response:", responseData);
            throw new Error(`API error: ${response.status} - ${responseData.error?.message || 'Unknown error'}`);
        }

        console.log("Raw Gemini response:", responseData);

        if (responseData.candidates?.[0]?.content?.parts?.[0]?.text) {
            const responseText = responseData.candidates[0].content.parts[0].text;

            // FIX 2: The JSON is always in the 'text' field as a string. Parse it.
            try {
                return JSON.parse(responseText);
            } catch (parseError) {
                console.error("Failed to parse JSON from response text:", responseText, parseError);
                throw new Error("Gemini response was not valid JSON.");
            }
        }

        throw new Error("No valid content found in Gemini response.");

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}
