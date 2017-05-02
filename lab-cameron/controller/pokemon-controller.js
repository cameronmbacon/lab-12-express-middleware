'use strict';

const createError = require('http-errors');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), {suffix: 'Prom'});
const mkdirp = require('mkdirp-promise');
const del = require('del');

module.exports = exports = {};

exports.createPokemon = function(schema, pokemon) {
  if(!schema) return Promise.reject(createError(400, 'schema required'));
  if(!pokemon) return Promise.reject(createError(400, 'pokemon required'));

  return mkdirp(`./data/${schema}`)
  .then(() => {
    return fs.writeFileProm(`./data/${schema}/${pokemon.id}.json`, JSON.stringify(pokemon))
    .then(() => {
      return pokemon;
    })
    .catch(err => {
      return err;
    });
  })
  .catch(err => {
    return err;
  });
};

exports.fetchPokemon = function(schema, id) {
  if (!schema) return Promise.reject(createError(400, 'Schema required'));
  if (!id) return Promise.reject(createError(400, 'Id required.'));

  return fs.statProm(`./data/${schema}/${id}.json`)
  .catch(err => {
    return Promise.reject(err);
  })
  .then(() => {
    return fs.readFileProm(`./data/pokemon/${id}.json`);
  })
  .then(data => {
    return Promise.resolve(JSON.parse(data.toString()));
  });
};

exports.updatePokemon = function(schema, id, newPoke) {
  if (!schema) return Promise.reject(createError(400, 'Schema required'));
  if (!id) return Promise.reject(createError(400, 'Id required.'));

  return fs.readFileProm(`./data/${schema}/${id}.json`, 'utf-8')
  .then(pokemon => {
    pokemon = JSON.parse(pokemon);
    if (newPoke.name) pokemon.name = newPoke.name;
    if (newPoke.type) pokemon.type = newPoke.type;
    fs.writeFileProm(`./data/${schema}/${id}.json`, JSON.stringify(pokemon))
    .then(() => pokemon)
    .catch(err => Promise.reject(createError(500, err.message)));
  })
  .catch(err => Promise.reject(createError(500, err.message)));
};

exports.deletePokemon = function(schema, id) {
  if (!schema) return Promise.reject(new Error('Schema required'));
  if (!id) return Promise.reject(new Error('Id required.'));

  return fs.statProm(`./data/${schema}/${id}.json`)
  .catch(err => {
    return Promise.reject(err);
  })
  .then(() => {
    return del(`./data/${schema}/${id}.json`)
    .then(() => console.log('Pokemon deleted'));
  })
  .then(() => {
    return Promise.resolve();
  });
};
