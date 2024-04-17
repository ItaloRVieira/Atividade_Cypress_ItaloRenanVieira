Cypress.Commands.add('excluirUsuario', function(userid, tokenid) {
    cy.log('Excluir usuário');
    cy.request({
      method: 'DELETE',
      url: '/api/users/' + userid,
      headers: {
        Authorization: `Bearer ${tokenid}`
      }
    })
  });


Cypress.Commands.add('promoverAdmin', function(tokenid){
        cy.log('Promover para admin')
        cy.request({
        method: 'PATCH',
        url: '/api/users/admin',
        headers: {
            Authorization: `Bearer ${tokenid}`
        }
        })
});

Cypress.Commands.add('promoverCritico', function(tokenid){
    cy.log('Promover para crítico')
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