import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log({ name: "hello", salary: 20000000 });
  res.json({ name: "hello", salary: 20000000 });
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.json({ succes: "true" });
});

app.listen(8080);
