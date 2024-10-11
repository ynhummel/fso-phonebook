import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import Person from "./models/person.js";
const app = express();

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

morgan.token("post-body", (req, resp) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-body",
  ),
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => res.json(people));
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((p) => res.json(p))
    .catch((error) => {
      res.status(404).end();
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const toRemove = persons.find((p) => p.id === id);
  if (!toRemove) {
    res.status(404).end();
  }

  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((saved) => res.json(saved));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
