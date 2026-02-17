import express from "express";
import cors from "cors";
const app = express();
import searchRouter from "./routes/search";

app.use(express.json());
var corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Vercel-Auth"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/search", searchRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
