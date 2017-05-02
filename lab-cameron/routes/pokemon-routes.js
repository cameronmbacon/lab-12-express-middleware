'use strict';

const createError = require('http-errors');
const Pokemon = require('../model/pokemon');
const pokemonCtrl = require('../controller/pokemon-controller');

module.exports = function(router) {
  router.post('/api/pokemon', (req, res) => {
    if (!req.body.name || !req.body.type) Promise.reject(createError(400, 'name or type required'));
    let pokemon = new Pokemon(req.body.name, req.body.type);
    pokemonCtrl.createPokemon('pokemon', pokemon)
    .then(pokemon => {
      return res.status(200).json(JSON.stringify(pokemon));
    })
    .catch(err => {
      console.error(err);
      res.status(400).send(err.message);
    });
  });

  router.get('/api/pokemon/:id', (req, res) => {
    pokemonCtrl.fetchPokemon('pokemon', req.params.id)
    .then(data => res.json(JSON.stringify(data.toString())))
    .catch(err => res.status(404).send(err.message));
  });

  router.put('/api/pokemon/:id', (req, res) => {
    pokemonCtrl.updatePokemon('pokemon', req.params.id, req.body)
    .then(pokemon => {
      res.json(JSON.stringify(pokemon));
    })
    .catch(err => res.status(404).send(err.message));
  });

  router.delete('/api/pokemon/:id', (req, res) => {
    pokemonCtrl.deletePokemon('pokemon', req.params.id)
    .then(() => res.send('Pokemon deleted'))
    .catch(err => res.send(err));
  });
};
