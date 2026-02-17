import express from "express";
import cors from "cors";
const app = express();
import searchRouter from "./routes/search";

app.use(express.json());
app.use(cors());

app.use("/search", searchRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
