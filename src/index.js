const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

let users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(user => user.username === username);

  if(user.length == 0) {
    return response.status(404).json({ error: 'Usuário não encontrado'});
  }

  request.user = user;

  return next();

}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  if(name && username) {
    const userAlreadyExists = users.some(
      (user) => user.name === name
    );

    if(userAlreadyExists) {
      return response.status(400).json({ error: 'Já existe um usuário criado com este nome!'})
    }

    const user = {
      id: uuidv4(),
      name,
      username,
      todos: []
    };
    
    users.push(user)

    return response.status(201).json(user);

  } else {
    response.status(400).json({ error: 'Preencha todos os dados!'})
  }
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  if(user.todos.length > 0) {
    response.status(200).json(user.todos)
  } else {
    response.status(401).json({ error: 'Usuário não possui tarefas!'})
  }
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(), 
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;