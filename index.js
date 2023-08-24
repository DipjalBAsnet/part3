const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const path = require("path");
app.use(express.static(path.join(__dirname, "../part2/phonebook/build")));
app.use(morgan("tiny"));
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
const currentTime = new Date().toString();

const entries = persons.length;

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const responseMessage = `<p>Phonebook has info of ${entries} people</p>
      <p>${currentTime}</p>`;

  response.send(responseMessage);
});

app.post("api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(404).json({ error: "name and number are requird" });
  }
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  console.log("seperate id");
  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: "person not found" });
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  console.log("deleted");

  response.status(204).end();
});

app.post("/api/persons/:id", (request, response) => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;

  const person = request.body;
  person.id = maxId + 1;

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`server running on port ${PORT}`);
