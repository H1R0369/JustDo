import express from 'express';
import axios from 'axios';
import {v4} from 'uuid';

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());    
app.set('view engine', 'ejs');
app.use(express.static('public'));

let tasks = [
    {
        id: v4(),
        text: 'hello'
    }
];

app.get('/', (req, res) => {
    res.render('index', {tasks});
});

app.post('/tasks', (req, res) => {
    const id = req.body.taskID;
    const text = req.body.task;

    if (id) {
        const taskIdx = tasks.findIndex(t => t.id === id);
        tasks[taskIdx].text = text
    } else {
        const newTask = {
            id,
            text
        }
        tasks.unshift(newTask);
    }

    res.redirect('/');
})

app.post('/tasks/new', (req, res) => {
    tasks.push({
        id: v4(),
        text: 'Untitled'
    })

    res.redirect('/');
})

app.listen(port, () => {
    console.log("App listening at port", port);
})