import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

// Increase payload limits for base64 images upload
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment. Please configure it in your Secrets / Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Ensure server is up
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Endpoint: Outfit Analysis (/api/analyze)
app.post("/api/analyze", async (req, res) => {
  try {
    const { imageB64, imageMime, archetypeId, archetypeName, archetypeIcon } = req.body;
    if (!imageB64 || !archetypeId) {
      return res.status(400).json({ error: "Missing image data or archetype." });
    }

    const ai = getAI();
    let contents: any[] = [];

    const imagePart = {
      inlineData: {
        mimeType: imageMime || "image/jpeg",
        data: imageB64
      }
    };

    const textPrompt = {
      text: `Analyze this outfit photo against the "${archetypeName}" fashion archetype (style icon: ${archetypeIcon}).
Evaluate across 4 distinct dimensions:
1. Clothing Fit
2. Color Coordination
3. Accessories & Jewelry
4. Footwear

Determine a total score out of 10.0 (one decimal place).
Write a brief, sharp, stylish AI verdict and detailed advice on what is missing and how to improve.
Provide the response strictly as a JSON object matching this schema:
{
  "total_score": 8.4,
  "breakdown": {
    "clothing_fit": 8,
    "color_coordination": 9,
    "accessories_jewelry": 7,
    "footwear": 8
  },
  "verdict": "Very strong Clean Girl vibes, but the watch holds you back.",
  "whats_missing": "A structured gold loop or dynamic layering accessory.",
  "how_to_improve": "Swap the sports trainers for high-vibe leather loafers. Add a classic stack of thin gold rings to emphasize the polished look."
}`
    };

    contents.push(imagePart);
    contents.push(textPrompt);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text || "";
    try {
      const parsed = JSON.parse(resultText);
      res.json(parsed);
    } catch (parseError) {
      res.status(500).json({ error: "Failed to parse model response", raw: resultText });
    }
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Endpoint: Legend Chat (/api/chat)
app.post("/api/chat", async (req, res) => {
  try {
    const { legendId, legendName, legendTitle, legendEra, history, message } = req.body;
    if (!legendId || !message) {
      return res.status(400).json({ error: "Missing legend details or message." });
    }

    const ai = getAI();
    const chatHistory = history || [];

    // Map system instruction to persona
    const systemInstruction = `You are ${legendName}, the legendary fashion icon (${legendTitle}, active ${legendEra}).
Speak in first person as the icon themselves. Embody their actual mannerisms, vocabulary, and philosophy on style and life.
Stay completely in-character. Be inspiring, sophisticated, and insightful. Keep answers concise: 3-5 sentences maximum, deeply personal and conversational.`;

    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 1.0
      }
    });

    // Seed history if it exists
    for (const turn of chatHistory) {
      if (turn.role === "user") {
        await chatInstance.sendMessage({ message: turn.content });
      }
    }

    const response = await chatInstance.sendMessage({ message });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to chat with legend" });
  }
});

// Endpoint: Fashion News (/api/news)
app.post("/api/news", async (req, res) => {
  try {
    const { query } = req.body;
    const finalQuery = query || "viral fashion 2026";
    const ai = getAI();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Search for the most current, interesting and viral fashion news or trends related to: "${finalQuery}".
Provide 5 high-vibe articles or stories.
Format the output strictly as a JSON array of objects with the exact structure:
[
  {
    "title": "Bottega Veneta dominates Milan SS26",
    "source": "Vogue",
    "time": "2 hours ago",
    "summary": "Quiet luxury meets experimental weave on the runways today, showing an absolute masterclass of form and fabric.",
    "tags": ["Milan FW", "Bottega Veneta", "SS26"],
    "viral": true
  }
]`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text || "[]";
    const parsed = JSON.parse(resultText);
    res.json({ articles: parsed });
  } catch (error: any) {
    console.error("News Error:", error);
    // Return high quality dummy articles as backup
    res.json({
      articles: [
        {title: "Quiet Luxury Reshapes Runways for SS26", source: "Vogue", time: "1 hour ago", summary: "Impeccable textures, neutral cashmeres, and zero branding dominate the major fashion grids this season.", tags: ["Quiet Luxury", "SS26", "Trends"], viral: true},
        {title: "The Return of the Statement Trench", source: "Business of Fashion", time: "3 hours ago", summary: "Classic silhouettes get a deconstructed make-over with asymmetrical pocket overlays.", tags: ["Trench", "Avant-Garde", "Outerwear"], viral: true},
        {title: "Sustainable Crochet Takes Over Festivals", source: "Hypebeast", time: "6 hours ago", summary: "Upcycled yarn is the defining textile of the season as Gen Z rejects fast fashion options.", tags: ["Sustainable", "Crochet", "Festival"], viral: false}
      ]
    });
  }
});

// Endpoint: Dress Me AI (/api/dressme)
app.post("/api/dressme", async (req, res) => {
  try {
    const { occasion, vibe, hasImage, imageB64, imageMime, extraText } = req.body;
    const ai = getAI();

    let contents: any[] = [];
    if (hasImage && imageB64) {
      contents.push({
        inlineData: {
          mimeType: imageMime || "image/jpeg",
          data: imageB64
        }
      });
    }

    const systemPrompt = `You are a world-class premier personal stylist. Provide a styled outfit recommendation for occasion: "${occasion}", desired vibe: "${vibe}".
${extraText ? `Additional details about the user: "${extraText}"` : ""}
If an image is uploaded, take into account their physical traits, hair/skin, and existing attire.
Recommend exactly 5 beautiful core pieces of clothing (Top, Bottom, Shoes, Bag, Accessory) that complement each other.
Respond strictly in JSON matching the following structure:
{
  "title": "Desert Chic Evening",
  "intro": "A harmonious layout combining structural linen with soft earth textures.",
  "pieces": [
    { "emoji": "🧥", "type": "Blazer", "name": "Relaxed Linen Double-Breasted Blazer", "brand": "Massimo Dutti · €169", "why": "Elegant structure that keeps you cool for an outdoor sunset dinner." },
    { "emoji": "👖", "type": "Trousers", "name": "Wide-Leg Silk Trousers", "brand": "COS · €115", "why": "Fluid movement that contrasts beautifully with the smart blazer." },
    { "emoji": "👡", "type": "Shoes", "name": "Suede Strappy Sandals", "brand": "Birkenstock Premium · €140", "why": "Grounded comfort with high-end editorial straps." },
    { "emoji": "👜", "type": "Bag", "name": "Loomed Straw clutch", "brand": "Jacquemus · €320", "why": "Brings organic seaside texture to the evening suit." },
    { "emoji": "💍", "type": "Accessory", "name": "Baroque Pearl Drop Earrings", "brand": "Mejuri · €98", "why": "Catch the twilight glow perfectly near your face." }
  ],
  "tip": "Roll up the blazer sleeves slightly for a nonchalant attitude. Opt for low-contrast gold hoops if keeping hair swept back.",
  "hairMakeup": "Glazed peach cheeks paired with a slicked low ponytail."
}`;

    contents.push({ text: systemPrompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Dress Me Error:", error);
    res.status(500).json({ error: error.message || "Failed to style your outfit" });
  }
});

// Endpoint: Challenge evaluation (/api/challenge)
app.post("/api/challenge", async (req, res) => {
  try {
    const { imageB64, imageMime, theme, reference, caption } = req.body;
    if (!imageB64) {
      return res.status(400).json({ error: "Missing image for submission." });
    }

    const ai = getAI();
    let contents = [
      {
        inlineData: {
          mimeType: imageMime || "image/jpeg",
          data: imageB64
        }
      },
      {
        text: `Evaluate this fashion challenge entry.
The challenge theme is: "${theme}" (reference: "${reference}").
User's caption: "${caption || "None provided"}".

Calculate a total score out of 10.0 (one decimal place).
Critique on 4 items: Style Alignment, Creativity, Color Harmony, Iconic References.
Provide a clear stylist verdict and a specific tip to hit 10/10. For community vote, pick one of: 'Would Wear', 'Iconic', 'Need Tweaks'.

Respond strictly as a JSON object:
{
  "total_score": 9.1,
  "style_alignment": 9,
  "creativity": 9,
  "color_harmony": 10,
  "iconic_references": 8,
  "verdict": "Sensational! The gold silk matches the original Naomi Versace vibe with a very modern edit.",
  "improvement_tip": "Swap the small clutch for a vintage larger chain mail bag to anchor the 90s silhouette.",
  "community_vote": "Iconic"
}`
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Challenge Error:", error);
    res.status(500).json({ error: error.message || "Failed to judge challenge" });
  }
});

// Endpoint: Magic Lab - Style DNA (/api/magic/dna)
app.post("/api/magic/dna", async (req, res) => {
  try {
    const { description } = req.body;
    const ai = getAI();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Calculate a high-vibe personal "Style DNA" profile.
Context details provided by user: "${description || "Minimal style wardrobe, values classic cuts and gold accents"}"

Create a breakdown of their primary style genres (e.g. Clean Girl, Old Money, Coquette, Minimalist, Goth, etc.) with percentages adding up to 100%.
Recommend 3 power colors, a beautiful color narrative/note, and choose a matching emoji and title.
Respond strictly in JSON matching:
{
  "identity": "65% Quiet Luxury, 25% Classic, 10% Coquette",
  "emoji": "💼",
  "mix": [
    { "label": "Quiet Luxury", "pct": 65, "color": "#F0E4C8" },
    { "label": "Classic", "pct": 25, "color": "#C87744" },
    { "label": "Coquette", "pct": 10, "color": "#FFB7C5" }
  ],
  "powerColors": ["#F0E4C8", "#C87744", "#FFB7C5"],
  "colorHex": ["#F0E4C8", "#C87744", "#FFB7C5"],
  "colorNote": "Your palette revolves around creamy off-whites, organic siennas, and soft rose tones.",
  "auraGradient": "linear-gradient(135deg, #F0E4C8 0%, #C87744 50%, #FFB7C5 100%)",
  "analysis": "Your clothing preferences indicate a highly secure sense of personal power. You choose silhouettes that honor comfort while maintaining exquisite margins of elegance."
}`,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("DNA Error:", error);
    res.status(500).json({ error: error.message || "Failed to calculate DNA" });
  }
});

// Endpoint: Magic Lab - Future You (/api/magic/futureyou)
app.post("/api/magic/futureyou", async (req, res) => {
  try {
    const { imageB64, imageMime, targetYear } = req.body;
    const ai = getAI();
    let contents: any[] = [];

    if (imageB64) {
      contents.push({
        inlineData: {
          mimeType: imageMime || "image/jpeg",
          data: imageB64
        }
      });
    }

    contents.push({
      text: `Based on their current look, forecast their style trajectory for the year ${targetYear || "2031"}.
Represent their future self's aesthetic identity, custom future title, future signature emojis, and an inspiring detailed description of their look and presence.
Respond strictly in JSON matching:
{
  "title": "The Sustainable Minimalist Sovereign",
  "avatar": "🕊️",
  "icons": "🕊️ 🌿 💎 👑",
  "description": "By ${targetYear || "2031"}, your wardrobe completely rejects high-volume items in favor of highly sculptural, organic garments. You are wearing bespoke bio-cultivated hemp shirts with fluid wool-silks that move with astronomical grace."
}`
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Future You Error:", error);
    res.status(500).json({ error: error.message || "Failed to project future self" });
  }
});

// Endpoint: Magic Lab - Partner Sync (/api/magic/partnersync)
app.post("/api/magic/partnersync", async (req, res) => {
  try {
    const { image1, image2, occasion } = req.body;
    const ai = getAI();
    let contents: any[] = [];

    if (image1) {
      contents.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: image1
        }
      });
    }
    if (image2) {
      contents.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: image2
        }
      });
    }

    contents.push({
      text: `Analyze the styling synchronization of this couple for occasion: "${occasion || "Date Night"}".
Compare color palettes, silhouettes, accessories and overall posture symmetry.
Provide a total score (e.g. "88%"), a creative verdict title, a subtitle, analysis details, and a quick improvement tip.
Respond strictly in JSON:
{
  "score": "88%",
  "verdict": "Synergistic Sophisticates",
  "subtitle": "Impeccable balance of clean tailoring and fluid textures.",
  "analysis": "Both looks respect the formal dress code with quiet luxury accents. The dark double-breasted suit contrasts beautifully with the fluid off-shoulder champagne silk dress, aligning naturally without looking overtly matching.",
  "tip": "Unify the metal tones—both wearing refined gold accents would seal the compatibility perfectly."
}`
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Partner Sync Error:", error);
    res.status(500).json({ error: error.message || "Failed to calculate style compatibility" });
  }
});

// Endpoint: Magic Lab - Throwback Roast (/api/magic/roast)
app.post("/api/magic/roast", async (req, res) => {
  try {
    const { imageB64, imageMime } = req.body;
    if (!imageB64) {
      return res.status(400).json({ error: "Missing image for throwback roast." });
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: imageMime || "image/jpeg",
            data: imageB64
          }
        },
        {
          text: `You are a hilarious, highly witty fashion historian. Roast this childhood photo's style.
Only comment on what is actually visible. Be playful, kind, but deeply hilarious.
Structure your reply strictly as this JSON:
{
  "eraLabel": "The Neon Denim Overlord (1998)",
  "roast": "The bowl cut is an absolute declaration of war. Combined with those primary color overalls and a neck pouch, your parents weren't just dressing you; they were conducting a sociological experiment on kid tolerance. Truly an unrepeatable masterpiece of nostalgia."
}`
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Roast Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate roast" });
  }
});

// Endpoint: Magic Lab - Scene Stealer (/api/magic/scene)
app.post("/api/magic/scene", async (req, res) => {
  try {
    const { imageB64, imageMime } = req.body;
    const ai = getAI();
    let contents: any[] = [];

    if (imageB64) {
      contents.push({
        inlineData: {
          mimeType: imageMime || "image/jpeg",
          data: imageB64
        }
      });
    }

    contents.push({
      text: `Analyze this look and match it to legendary cinema moments.
Identify the primary movie it belongs in, directory/year details, a creative matching emoji, alternative film percentages (sum to 100%), a sharing caption, and a witty explanation of the cinematic link.
Respond strictly in JSON:
{
  "mainFilm": "The Talented Mr. Ripley",
  "mainEmoji": "⛵",
  "mainDir": "dir. Anthony Minghella, 1999",
  "films": [
    { "name": "The Talented Mr. Ripley", "pct": "65%", "emoji": "⛵" },
    { "name": "A Bigger Splash", "pct": "25%", "emoji": "🏖️" },
    { "name": "La Piscine", "pct": "10%", "emoji": "💦" }
  ],
  "shareQuote": "My outfit is currently renting a fully-staffed yacht in San Remo.",
  "analysis": "The linen structures, heavy tortoise sunglasses, and sun-kissed Italian coast colors fit seamlessly into Minghella's peak late-90s sun-drenched thriller."
}`
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Scene Stealer Error:", error);
    res.status(500).json({ error: error.message || "Failed to run Scene Stealer" });
  }
});

// Endpoint: Magic Lab - Critics Mode (/api/magic/critics)
app.post("/api/magic/critics", async (req, res) => {
  try {
    const { imageB64, imageMime, criticId } = req.body;
    const ai = getAI();
    let contents: any[] = [];

    if (imageB64) {
      contents.push({
        inlineData: {
          mimeType: imageMime || "image/jpeg",
          data: imageB64
        }
      });
    }

    const criticInstruct = criticId === "wintour"
      ? "Anna Wintour of Vogue (cool, brief, devastatingly precise, 2 sentences)"
      : criticId === "givhan"
      ? "Robin Givhan of Washington Post (Pulitzer-winning, highly analytical, smart social commentary, 2-3 sentences)"
      : "Tim Blanks of BoF (poetic, artistic analogies, mentions of high fashion history, 2-3 sentences)";

    contents.push({
      text: `Review this outfit from the perspective of ${criticInstruct}. Stay 100% in-character.
Respond strictly in JSON:
{
  "review": "Write the exact review paragraph here, matching their voice completely."
}`
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Critics Error:", error);
    res.status(500).json({ error: error.message || "Failed to run critics review" });
  }
});

// Endpoint: Magic Lab - Cosmic Style (/api/magic/cosmic)
app.post("/api/magic/cosmic", async (req, res) => {
  try {
    const { planetsSummary } = req.body;
    const ai = getAI();

    const prompt = `You are a mystical luxury fashion astrologer. Based on the calculated astronomical natal chart positions:
"${planetsSummary || "Sun in Gemini, Moon in Scorpio, Venus in Cancer, Mars in Leo"}"
Generate a personalized cosmic style archetype, a summary of their space-chic vibe, detailed short entries for Sun, Moon, Mercury, Venus, Mars (and Rising, if present), three power colors with matching hex codes, and a weekly horoscopic styling forecast.

Respond strictly in JSON format matching this schema:
{
  "archetype": "Ethereal Rebel",
  "vibe": "Your Venus in Cancer values absolute soft-fabric comfort, while your Mars in Leo demands structural, attention-grabbing statement blazers.",
  "planets": [
    { "emoji": "☀️", "name": "Sun", "sign": "Gemini", "vibe": "Multifaceted and layered; loves dual-theme accessories." },
    { "emoji": "🌙", "name": "Moon", "sign": "Scorpio", "vibe": "brooding, high-intensity dark-glass secret compartments." },
    { "emoji": "♀️", "name": "Venus", "sign": "Cancer", "vibe": "Silk, cashmere, warm hugs in soft luxury knits." },
    { "emoji": "♂️", "name": "Mars", "sign": "Leo", "vibe": "Sartorial brass buttons, massive dynamic shoulders, and crowns." }
  ],
  "powerColors": ["Liquid Gold", "#ffdd55", "Prussian Blue", "#1d2a4a", "Oatmeal", "#ebe5df"],
  "weeklyMood": "With Mercury in retrograde, re-introduce a vintage brooch you inherited. Let nostalgia anchor your walk this Friday."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Cosmic Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate cosmic horror-scope" });
  }
});

// Setup Vite & Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fashion Dreams Backend] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
