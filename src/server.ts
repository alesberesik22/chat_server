import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "../routes/auth";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(urlencoded());
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/auth", authRoutes);

app.listen(port, () => {
  return console.log(
    `Express is listening at address http://localhost:${port}`
  );
});
