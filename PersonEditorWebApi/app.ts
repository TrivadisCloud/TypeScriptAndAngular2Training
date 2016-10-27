import express = require("express");
import fs = require("fs");
import bodyParser = require("body-parser");
import { Person } from "./person";

let app = express();
const port = 8180;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let persons: Array<Person> = [
    { id: 1, firstname: "Max", lastname: "Payne" },
    { id: 2, firstname: "Lara", lastname: "Croft" },
    { id: 3, firstname: "Thomas", lastname: "Huber", githubusername: "thomasclaudiushuber" },
    { id: 4, firstname: "Duke", lastname: "Nukem" },
    { id: 5, firstname: "Thomas", lastname: "Gassmann" },
    { id: 6, firstname: "Thomas", lastname: "Bandixen", githubusername: "tbandixen" },
];

let personRouter = express.Router();

personRouter.route("/persons")
    .post((request: express.Request, response: express.Response) => {
        let person = <Person>request.body;

        person.id = getNextId();
        persons.push(person);

        response.send(JSON.stringify(person));
    })
    .put((request: express.Request, response: express.Response) => {
        let person = <Person>request.body;
        let filteredPersons = persons.filter(p => p.id == person.id);

        if (filteredPersons.length != 1) {
            response.sendStatus(404);
        } else {
            let personToUpdate = filteredPersons[0];
            personToUpdate.firstname = person.firstname;
            personToUpdate.lastname = person.lastname;
            response.sendStatus(200);
        }
    })
    .get((request: express.Request, response: express.Response) => {
        response.send(JSON.stringify(persons));
    });

personRouter.route("/persons/:id")
    .get((request: express.Request, response: express.Response) => {
        let id = request.params.id;
        let filteredPersons = persons.filter(p => p.id == id);

        if (filteredPersons.length != 1) {
            response.sendStatus(404);
        } else {
            response.send(JSON.stringify(filteredPersons[0]));
        }
    });

function getNextId(): number {
    let maxId = 1;
    persons.forEach(p => {
        maxId = Math.max(p.id, maxId);
    });
    return maxId + 1;
}
app.use("/api", personRouter);

app.listen(port, () => {
    console.log("Started listening on port " + port);
});