const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

if (process.argv.length < 3) {
  console.log("provide password as arguement");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://dipjal5678:${password}@cluster0.cgpzzih.mongodb.net/phonebook-database?retryWrites=true&w=majority`;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("error conncecting to mongodb", error.message);
  });

const personSchema = new mongoose.Schema({
  Name: String,
  Number: Number,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
