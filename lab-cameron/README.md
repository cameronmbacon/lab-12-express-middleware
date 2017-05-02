![cf](https://i.imgur.com/7v5ASc8.png) lab 12 express middleware
======

# To Submit this Assignment
  * fork this repository
  * write all of your code in a directory named `lab-` + `<your name>` **e.g.** `lab-duncan`
  * push to your repository
  * submit a pull request to this repository
  * submit a link to your PR in canvas
  * write a question and observation on canvas

# Build Tool Instructions
* create a package.json that lists all dependencies and developer dependencies
* include an .eslintrc
* include a .gitignore
* include a readme with a project description
  * how to install
  * how to start the server
  * document the routes
* include any necessary NPM scripts
 * have a lint script for running eslint
 * have a test script for running mocha
 * have a default script for running the lint and mocha tasks


# Directions
* refactor your routes so that requests use parameters instead of query strings
* refactor your app so the error-handling middleware is its own module


# Test
* `GET` - request no longer have 400 test
* `PUT and POST` - test 400 for bad json  
* `DELETE` - test 404, for a DELETE request with an invalid or missing id
 * 404 for missing id because `DELETE /api/<simple-resource-name>/` is not a route
* `DELETE` - test 204, with an empty response body for DELETE request with a valid id
