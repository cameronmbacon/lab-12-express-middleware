'use strict';

const server = require('../server.js');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), {suffix: 'Prom'});
const chai = require('chai');
const http = require('chai-http');
const expect = chai.expect;

chai.use(http);

describe('Server module', function() {
  let app;
  before(done => {
    app = server.listen(6660);
    done();
  });
  after(done => {
    app.close();
    done();
  });
  describe.only('POST method', function() {
    describe('/api/pokemon endpoint', function() {
      it('Should respond with status 201 on a proper request', done => {
        chai.request(server)
        .post('/api/pokemon')
        .send({name: 'pikachu', type: 'electric'})
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.equal(201);
          done();
        });
      });
      it('Should respond with status 400 on a bad request', done => {
        console.log('inside the it block');
        chai.request(server)
        .post('/api/pokemon')
        .send({name: 'pikachu'})
        .end((err, res) => {
          console.error('this is the error', err);
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('GET method', function() {
    describe('/api/pokemon/:id endpoint', function() {
      it('Should respond with status 200 on a proper request', done => {
        chai.request(server)
        .get('/api/pokemon/')
        .send({name: 'pikachu', type: 'electric'})
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.equal(200);
          done();
        });
      });
      it('Should respond with status 404 not found', done => {
        chai.request(server)
        .get('/wrong')
        .send({name: 'pikachu', type: 'electric'})
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe.only('#PUT', function() {
    let pokemons = [];
    before(done => {
      chai.request(server)
      .post('/api/pokemon')
      .send({name: 'charmander', type: 'fire'})
      .end((err, res) => {
        let pokemon = JSON.parse(res.text);
        pokemons.push(pokemon);
        done();
      });
    });
    after(done => {
      pokemons.forEach(pokemon=> {
        fs.unlinkProm(`${__dirname}/../data/pokemon/${pokemon.id}.json`);
      });
      done();
    });
    describe('requests made to /api/pokemon', function() {
      it('Should respond with status 200', done => {
        chai.request(server)
        .put('/api/pokemon')
        .send({name: pokemons[0].name, type: pokemons[0].type, id: pokemons[0].id})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
      });
      it('Should respond with status 404 given no id', done => {
        chai.request(server)
        .put('/wrong')
        .send({name: 'pikachu', type: 'electric'})
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.equal(400);
          done();
        });
      });
      it('modify a specific record given the correct inputs', done => {
        chai.request(server)
        .put('/api/pokemon')
        .send({name: 'pikachu', type: 'electric'})
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.equal(202);
          done();
        });
      });
      it('Should respond with status 404 given bad inputs', done => {
        chai.request(server)
        .put('/api/pokemon')
        .send({name: 'pikachu', type: 'electric'})
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.equal(202);
          done();
        });
      });
    });
  });

  describe('DELETE method', function() {
    describe('/api/pokemon endpoint', function() {
      it('Should respond with status 204 on a proper request', done => {
        chai.request(server)
        .get('/api/pokemon')
        .send({name: 'pikachu', type: 'electric'})
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.equal(204);
          done();
        });
      });
      it('Should respond with status 404 on a bad request', done => {
        chai.request(server)
        .get('/wrong')
        .send({name: 'pikachu', type: 'electric'})
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
