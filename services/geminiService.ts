
import { GoogleGenAI, Type } from "@google/genai";
import { MixerData, GeneratedResponse, Platform } from "../types";
import { getSmartImages } from "../data/stockData";

// Helper to initialize AI safely
const getAI = () => {
  let key = '';
  try {
    key = process.env.API_KEY || '';
  } catch (e) {}
  
  if (!key) {
    try {
      // @ts-ignore
      key = import.meta.env.VITE_API_KEY || '';
    } catch (e) {}
  }

  if (!key) {
      console.warn("Gemini API Key is missing");
      return null; 
  }
  return new GoogleGenAI({ apiKey: key });
};

// Fallback Data Generator
export const getFallbackMixerData = (format: 'Post' | 'Reel' | 'Story'): MixerData => {
    const visuals = getSmartImages("spa");
    return {
        intent: "Promote New Service (Demo Mode)",
        format: format,
        visuals: visuals,
        captions: [
            { id: "1", text: "Glow up season is here! ✨ Book now.", tone: "Exciting" },
            { id: "2", text: "The secret to perfect skin? It's in the details. 🌿", tone: "Educational" },
            { id: "3", text: "Limited slots available this week! Link in bio.", tone: "Urgent" }
        ]
    };
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const ai = getAI();
    if (!ai) throw new Error("No API Key");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data");
  } catch (error) {
    console.error("Image Gen Error:", error);
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  }
};

// NEW: Generate captions from an existing image OR video (Vision)
export const generateCaptionsFromImage = async (base64DataString: string, format: 'Post' | 'Reel' | 'Story'): Promise<MixerData> => {
    try {
        const ai = getAI();
        
        // Parse MimeType and Data from the Data URL
        // Format: data:[<mediatype>][;base64],<data>
        const matches = base64DataString.match(/^data:(.+);base64,(.+)$/);
        let mimeType = "image/jpeg"; // default
        let rawData = base64DataString;
        
        if (matches && matches.length === 3) {
            mimeType = matches[1];
            rawData = matches[2];
        } else {
            // Fallback if regex fails (though it shouldn't for valid FileReader output)
            rawData = base64DataString.split(',')[1] || base64DataString;
        }

        // Construct the User Visual object immediately
        const userVisual = {
            id: `user-${Date.now()}`,
            prompt: "User Media",
            url: base64DataString
        };

        if (!ai) {
            const fb = getFallbackMixerData(format);
            fb.visuals = [userVisual];
            return fb;
        }

        const promptText = `Analyze this media (image or video frame). You are a social media manager for a small business.
        Create 3 engaging captions for this content.
        Format: ${format}.
        Return JSON:
        - intent: A short 3-word summary of the content.
        - captions: The caption options.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { inlineData: { mimeType: mimeType, data: rawData } },
                    { text: promptText }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        intent: { type: Type.STRING },
                        captions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: { id: { type: Type.STRING }, text: { type: Type.STRING }, tone: { type: Type.STRING } },
                                required: ["id", "text", "tone"]
                            }
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response");
        const data = JSON.parse(text);

        return {
            intent: data.intent,
            format,
            visuals: [userVisual],
            captions: data.captions.map((c: any, index: number) => ({ ...c, id: index.toString() }))
        };

    } catch (error) {
        console.error("Vision Gen Error:", error);
        const fb = getFallbackMixerData(format);
        fb.visuals = [{
            id: `user-${Date.now()}`,
            prompt: "User Media",
            url: base64DataString
        }];
        return fb;
    }
};

export const generatePostIngredients = async (input: string, isAudio: boolean, format: 'Post' | 'Reel' | 'Story', mimeType?: string): Promise<MixerData> => {
  const generatePromise = async () => {
    try {
      const ai = getAI();
      
      // 1. Handle Text Input Strategy (The Reliable Path)
      // VoiceHome now tries to send text via Speech Recognition first.
      if (!isAudio) {
          let smartVisuals = getSmartImages(input);
          
          // HYBRID STRATEGY: Add Dynamic Options
          if (input.length > 2) {
             const dynamic1 = {
                 id: `dyn-${Date.now()}-1`,
                 prompt: `${input} aesthetic high quality`,
                 url: `https://image.pollinations.ai/prompt/${encodeURIComponent(input + ' aesthetic high quality')}?width=800&height=800&nobreak=true&seed=${Math.random()}`
             };
             const dynamic2 = {
                 id: `dyn-${Date.now()}-2`,
                 prompt: `${input} professional photography`,
                 url: `https://image.pollinations.ai/prompt/${encodeURIComponent(input + ' professional photography')}?width=800&height=800&nobreak=true&seed=${Math.random()}`
             };
             smartVisuals = [...smartVisuals, dynamic1, dynamic2];
          }

          if (!ai) {
             const fb = getFallbackMixerData(format);
             fb.visuals = smartVisuals;
             fb.intent = input; 
             return fb;
          }
      }

      if (!ai) return getFallbackMixerData(format);

      // 2. Construct Prompt
      const parts: any[] = [];
      let formatContext = "The user wants to create a Photo Post. Provide 3 caption options (short, medium, long).";
      
      if (format === 'Reel') {
          formatContext = "The user wants to create a Video Reel. Provide 3 short script hooks or captions.";
      } else if (format === 'Story') {
          formatContext = "The user wants to create an Instagram Story. Provide 3 punchy, short text overlays.";
      }

      let promptText = "";
      if (isAudio) {
          promptText = `Analyze the audio. User context: Salon/Small Business.
          ${formatContext}
          Return JSON:
          - intent: Keywords describing the visual subject (e.g. 'barber', 'nails', 'hair').
          - captions: The creative text options.`;
          
          parts.push({ inlineData: { mimeType: mimeType || "audio/webm", data: input } });
          parts.push({ text: promptText });
      } else {
          promptText = `User input: "${input}". ${formatContext} Return JSON with 'intent' (visual keywords) and 'captions'.`;
          parts.push({ text: promptText });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intent: { type: Type.STRING },
              captions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { id: { type: Type.STRING }, text: { type: Type.STRING }, tone: { type: Type.STRING } },
                  required: ["id", "text", "tone"]
                }
              }
            }
          }
        }
      });

      const text = response.text;
      if (!text) return getFallbackMixerData(format);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        // SALVAGE: If JSON fails, try to use the raw text to guess intent
        console.warn("JSON Parse failed, salvaging text...");
        const rawIntent = text.slice(0, 100); // First 100 chars usually have intent
        data = {
            intent: rawIntent,
            captions: [{ id: "1", text: "Check out our latest update!", tone: "General" }]
        };
      }
      
      // 3. Select Images
      let queryForImages = isAudio ? data.intent : input;
      let smartVisuals = getSmartImages(queryForImages);
      
      // Hybrid: Add dynamic images for variety if intent is clear
      if (queryForImages && queryForImages.length > 2) {
         const cleanQuery = queryForImages.split(',')[0].trim();
         const dynamic1 = {
             id: `dyn-ai-1`,
             prompt: `${cleanQuery} high quality photography`,
             url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanQuery + ' beauty salon photography')}?width=800&height=800&nobreak=true&seed=${Math.random()}`
         };
         smartVisuals = [...smartVisuals, dynamic1];
      }
      
      // Deep Search Backup: Check the captions for keywords if the intent failed
      const firstCaption = data.captions?.[0]?.text || "";
      // If we got generic images, double check the caption
      if (smartVisuals[0].id.startsWith('g') && firstCaption) {
          const improvedVisuals = getSmartImages(firstCaption);
          // If caption gave us better images (e.g. not generic), use them
          if (!improvedVisuals[0].id.startsWith('g')) {
              smartVisuals = improvedVisuals;
          }
      }
      
      return {
        intent: data.intent || "Content Creation",
        format,
        visuals: smartVisuals, 
        captions: data.captions.map((c: any, index: number) => ({ ...c, id: index.toString() }))
      } as MixerData;

    } catch (error) {
      console.error("Error generating ingredients:", error);
      const safeFallback = getFallbackMixerData(format);
      if (!isAudio) {
          safeFallback.visuals = getSmartImages(input); 
      }
      return safeFallback;
    }
  };

  const timeoutPromise = new Promise<MixerData>((resolve) => {
      setTimeout(() => {
          const fallback = getFallbackMixerData(format);
          if (!isAudio) {
             fallback.visuals = getSmartImages(input); 
          }
          resolve(fallback);
      }, 15000);
  });

  return Promise.race([generatePromise(), timeoutPromise]);
};

export const generatePostTemplates = async (input: string, isAudio: boolean, format: string): Promise<GeneratedResponse> => {
    return { intent: "Legacy", templates: [] };
};
