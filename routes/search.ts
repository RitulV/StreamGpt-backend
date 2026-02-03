import { Router } from "express";
import { ollama } from "../utils/ollama";
const router = Router();

router.post("/", async (req, res) => {
  const response = await ollama.chat({
    model: "gpt-oss:120b",
    messages: [
      {
        role: "user",
        content: `Explain briefly in with no emojis and special characters: ${req.body.query}`,
      },
    ],
    format: {
      type: "object",
      properties: {
        description: { type: "string" },
        length: { type: "number" },
      },
      required: ["description", "length"],
    },
  });

  const resp = response.message.content;

  res.json({ message: resp });
});

export default router;
