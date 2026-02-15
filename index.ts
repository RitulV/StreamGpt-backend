import express from "express";
const app = express();
import searchRouter from "./routes/search";

app.use(express.json());

app.use("/search", searchRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
