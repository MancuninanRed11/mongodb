const express = require('express');
const bodyParser = require('body-parser');
const Board = require('./models/board.model');
const Task = require('./models/task.model');
const User = require('./models/user.model');
const router = express.Router();
const path = require('path');

const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(express.static('static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let db;

const url = 'mongodb://localhost:27017/';

MongoClient.connect(url, (error, client) => {
    if (error) {
        return console.log(error);
    }

    db = client.db('room_db');

    app.listen(8080, () => {
        console.log('Listening in 8080');
    });
});

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/static/room.html');
});

app.get('/registration', (request, response) => {
    response.sendFile(__dirname + '/static/registration.html');
});

app.post('/create-board', (req, res) => {
    const board = new Board({id: req.body.id, title: req.body.title});
    console.log("-----", req);
    db.collection('boards').save(board, (error) => {
        if (error) {
            return console.log(error);
        }
        console.log('Board added to db');
        res.sendStatus(201);
    });
});

app.get('/boards', (request, response) => {
    db.collection('boards').find().toArray((error, result) => {
        if (error) {
            return console.log(error);
        }
        response.send(result);
    });
});

app.post('/create-task', (req, res) => {
    const task = new Task({id: req.body.id, title: req.body.title});
    console.log("-----", req);
    //db.collection('boards').find({id: req.body.id})
    db.collection('tasks').save(task, (error) => {
        if (error) {
            return console.log(error);
        }
        console.log('Task added to db');
        res.sendStatus(201);
    });
});

app.get('/tasks', (request, response) => {
    db.collection('tasks').find().toArray((error, result) => {
        if (error) {
            return console.log(error);
        }
        response.send(result);
    });
});

app.post('/register-new-user', (req, res) => {
    const user = new User({name: req.body.name, surname: req.body.surname, email: req.body.email});
    console.log("-----", user);
    db.collection('users').save(user, (error) => {
        if (error) {
            return console.log(error);
        }
        console.log('User added to db');
        res.sendStatus(201);
    });
});

app.get('/users', (request, response) => {
    db.collection('users').find().toArray((error, result) => {
        if (error) {
            return console.log(error);
        }
        response.send(result);
    });
});
