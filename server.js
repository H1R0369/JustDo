import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());    
app.use(express.static('public'));

let tasks = [
    {
        id: crypto.randomUUID(),
        text: 'hello'
    },
    {
        id: crypto.randomUUID(),
        text: 'bye'
    }
];

let finishedTasks = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.get('/tasks', (req, res) => {
    res.status(200).json({tasks, finishedTasks});
});

app.post('/save', (req, res) => {
    const taskArr = req.body.tasks;
    const finishedTaskArr = req.body.finishedTasks;
    tasks = taskArr;
    finishedTasks = finishedTaskArr;
})

app.listen(port, () => {
    console.log("App listening at port", port);
});