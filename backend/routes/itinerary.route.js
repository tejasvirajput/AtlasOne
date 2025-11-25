// backend/routes/itinerary.route.js
import express from "express";
import isAuth from "../middleware/isAuth.js";
import Itinerary from "../model/itinerary.model.js";
import { callLLM } from "../utils/llm.js";

const router = express.Router();

/**
 * POST /api/itinerary
 * Create trip plan (React will call this)
 */
router.post("/", isAuth, async (req, res) => {
  try {
    const { destination, days, budget, interests } = req.body;

    if (!destination || !days || !budget) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const interestsText = Array.isArray(interests)
      ? interests.join(", ")
      : interests || "General";

    const prompt = `
You are an AI travel planner.

Create a ${days}-day itinerary for ${destination}, India.
Budget: ${budget}.
Interests: ${interestsText}.

STRICT FORMAT (do NOT output anything else):

Day 1: <one line summary>
<multiple lines of bullet points>

Day 2: <one line summary>
<multiple lines of bullet points>

Day 3: <one line summary>
<multiple lines of bullet points>

Rules:
- NO headings
- NO ### markdown
- NO bold text
- DO NOT add extra sections
- Only plain text in the format shown above.
`.trim();

    const planText = await callLLM(prompt);

    const dayWise = [];
    const lines = planText.split("\n").map(l => l.trim()).filter(Boolean);

    let currentDay = null;

    for (const line of lines) {
  const match = line.match(/^Day\s*(\d+)\s*:\s*(.*)$/i);

  if (match) {
    currentDay = {
      day: Number(match[1]),
      content: match[2] || ""
    };
    dayWise.push(currentDay);
  } else if (currentDay) {
    currentDay.content += "\n" + line;
  }
}

    const itineraryDoc = await Itinerary.create({
      user: req.userId,
      destination,
      days,
      budget,
      interests: Array.isArray(interests) ? interests : [interests],
      rawText: planText,
      dayWise,
    });

    return res.json({ success: true, itinerary: itineraryDoc });
  } catch (err) {
    console.error("Itinerary creation error:", err);
    return res.status(500).json({ message: "Trip planner error" });
  }
});

/**
 * GET /api/itinerary/:id
 */
router.get("/:id", isAuth, async (req, res) => {
  const doc = await Itinerary.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({ success: true, itinerary: doc });
});

/**
 * GET /api/itinerary
 */
router.get("/", isAuth, async (req, res) => {
  const docs = await Itinerary.find({ user: req.userId });
  res.json({ success: true, itineraries: docs });
});

export default router;
