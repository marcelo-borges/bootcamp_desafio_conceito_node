const express = require("express");
const cors = require("cors");

const { v4: uuidv4, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const{ id } = request.params;

  if (!isUuid(id)){
      return response.status(400).json({error: 'Invalid Repository ID.'});
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
    return response.status(201).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuidv4(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const { likes } = repositories.find(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found"});
  }

  const repository = { id, title, url, techs, likes };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found"});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found"});
  }

  const { title, url, techs, likes } = repositories.find(repository => repository.id === id);

  const incrementedLikes = likes + 1;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: incrementedLikes
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);

});

module.exports = app;
