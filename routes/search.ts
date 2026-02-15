import { Router } from "express";
import axios from "axios";
import { ollama } from "../utils/ollama";
import { type MovieDetails } from "./../utils/constants";
import { z } from "zod";
const router = Router();

router.get("/", async (req, res) => {
  if (!req.query.model && !req.query.query) {
    res.status(401).json({ msg: "Bad request" });
  } else {
    let modelUsed = z.string().safeParse(req.query.model);
    let queryUsed = z.string().safeParse(req.query.query);

    if (modelUsed.success && queryUsed.success) {
      let queryHelper =
        "Return a comma-separated short list of Movie names as per description. Do not include anything other than the names of movies in the answer";
      const response = await ollama.chat({
        model: modelUsed.data,
        messages: [
          {
            role: "user",
            content: `${queryHelper}: ${queryUsed.data}`,
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

      const responseList = response.message.content.split(",");

      const finalMovieList: MovieDetails[] = await Promise.all(
        responseList.map(async (el) => {
          el = el.trimStart();

          const moviesMatch = await axios.get(
            "https://api.themoviedb.org/3/search/movie",
            {
              params: {
                query: el,
                include_adult: false,
                language: "en-US",
                page: 1,
              },
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
              },
            },
          );

          return moviesMatch.data.results.length
            ? moviesMatch.data.results[0]
            : null;
        }),
      );

      res.json(finalMovieList.filter(Boolean));
    }
  }
});

export default router;
