require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const path = require("path");
const Person = require("./models/person");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../part2/phonebook/build")));
app.use(morgan("tiny"));
app.use(cors());

const currentTime = new Date().toString();

// const entries = persons.length;

app.post("/api/persons", (request, response) => {
  console.log("recieved post request to api/persons");
  const { name, number } = request.body;
  console.log("request body", request.body);

  if (!name || !number) {
    return response
      .status(400)
      .json({ error: "Name and number are required." });
  }

  const newPerson = new Person({
    name: name,
    number: number,
  });
  console.log("creating new person", newPerson);

  // persons.push(newPerson);

  // response.status(201).json(newPerson);
  newPerson.save().then((result) => {
    console.log("person saved", result);
    response.json(result);
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  const responseMessage = `<p>Phonebook has info of ${entries} people</p>
      <p>${currentTime}</p>`;

  response.send(responseMessage);
});

app.post("/api/persons/:id", (request, response) => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;

  const person = request.body;
  person.id = maxId + 1;

  persons = persons.concat(person);

  response.json(person);
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
