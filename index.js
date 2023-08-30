const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const Person = require("./models/person");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../part2/phonebook/build")));
app.use(morgan("tiny"));
app.use(cors());

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
  Person.countDocuments({})
    .then((count) => {
      const responseMessage = `<p>Phonebook has info of ${count} people</p>
      <p>${new Date().toString()}</p>`;
      response.send(responseMessage);
    })
    .catch((error) => {
      console.error("Error fetching count:", error);
      response.status(500).end();
    });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.error("Error fetching person:", error);
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      console.log("successfully deleted");
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
