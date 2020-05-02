const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository ID."})
  }
  return next();

};

app.use('/repositories/:id', validateProjectId);
app.use('/repositories/:id/like', validateProjectId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  const repository = { 
    id: uuid(),
    title, 
    url, 
    techs, 
    likes: 0
  };

  repositories.push(repository);
  return response.json(repository);
  
});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const foundRepository = repositories.find(repository => repository.id === id);
  const repositoryIndex = repositories.indexOf(foundRepository);

  const repository = {
    ...foundRepository,
    title: title,
    url: url,
    techs: techs
  }

  repositories[repositoryIndex] = repository;
  return response.json(repository);

  // const repository = repositories.find(repository => repository.id === id);
  // const repositoryIndex = repositories.indexOf(repository);

  // repository.title = title;
  // repository.url = url;
  // repository.techs = techs;
  
  // repositories[repositoryIndex] = repository;
  // return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();

});

app.post("/repositories/:id/like", (request, response) => {

  const { id } =  request.params;
  const repository = repositories.find(repository => repository.id === id);
  repository.likes++;
  return response.json(repository);

});

module.exports = app;