Cypress.Commands.add('excluirUsuario', function(userid, tokenid) {
    cy.request({
      method: 'DELETE',
      url: '/api/users/' + userid,
      headers: {
        Authorization: `Bearer ${tokenid}`
      }
    })
  });


Cypress.Commands.add('promoverAdmin', function(tokenid){
        cy.request({
        method: 'PATCH',
        url: '/api/users/admin',
        headers: {
            Authorization: `Bearer ${tokenid}`
        }
        })
});

Cypress.Commands.add('promoverCritico', function(tokenid){
    cy.request({
    method: 'PATCH',
    url: '/api/users/apply',
    headers: {
        Authorization: `Bearer ${tokenid}`
    }
    })
});

Cypress.Commands.add('criarUsuario', function () {
    cy.fixture('createuser.json').then((newuser) => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: newuser.UserValido
      })
    });
  });

  Cypress.Commands.add('loginValido', function () {
    cy.fixture('login.json').then(function (login) {
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: login.valido
      })
    })
  });    

  Cypress.Commands.add('criarFilme', function (failOnStatusCode = false, tokenid){
    cy.fixture('movies.json').then(function(newmovie){
      cy.request({
          method: 'POST',
          url: '/api/movies',
          body: newmovie.movieValido,
          headers: {
            Authorization: `Bearer ${tokenid}`
          },
          failOnStatusCode: failOnStatusCode
      })
    })
  });

  Cypress.Commands.add('criarFilmeValido', function (tokenid){
    cy.fixture('movies.json').then(function(newmovie){
      cy.request({
          method: 'POST',
          url: '/api/movies',
          body: newmovie.movieValido,
          headers: {
            Authorization: `Bearer ${tokenid}`
          },
          
      })
    })
  }); 

  Cypress.Commands.add('consultarFilme', function (tokenid) {
    cy.fixture('movies.json').then(function(newmovie){ 
    cy.request({
      method: 'GET',
      url: '/api/movies/search?title=' + newmovie.movieValido.title,
      headers: {
          Authorization: `Bearer ${tokenid}`
      }
    });
    })
  });

  Cypress.Commands.add('listarFilmes', function () {
    cy.request({
      method: "GET",
      url: "/api/movies"
  })
  });

  Cypress.Commands.add('criarReviewValida', function (){
    cy.request({
      method: "POST",
      url: "api/users/review",
      body: {
          "movieId": idMovies,
          "score": 5,
          "reviewText": "Filme muito bom"
      },
      headers: {
          Authorization: `Bearer ${tokenid}`
      }
    })
  });