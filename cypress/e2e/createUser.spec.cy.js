let userid
let tokenid

describe('Criando usuário', function(){


    it('Criando usuário valido', function(){
        cy.criarUsuario()
        .then(function (response){
            expect(response.status).to.eq(201);
            userid = response.body.id;
            console.log(userid)
        })
    });

    after('Realizando login', function(){
        cy.loginValido()
        .then(function (response) {
            tokenid = response.body.accessToken;
            console.log(tokenid)
        })
    });

    after('Promover usuario', function(){
        if (!tokenid) {
            cy.log('Token de autenticação não foi obtido.');
            assert.fail('Token de autenticação não foi obtido.');
        }
        cy.promoverAdmin(tokenid)
    });

    after('Excluir usuário', function () {
        cy.excluirUsuario(userid, tokenid)
      });
})

describe('Criar usuários inválidos', function(){
    it('Criar usuário com email inválido', function(){
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
              method: 'POST',
              url: '/api/users',
              body: newuser.logEmailInvalido,
        failOnStatusCode: false
        }).then(function (response){
            expect(response.status).to.eq(400);

        })
        });
    });
    it('Criar usuário com senha < 6', function(){
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
              method: 'POST',
              url: '/api/users',
              body: newuser.logSenhamenos6,
        failOnStatusCode: false
        }).then(function (response){
            expect(response.status).to.eq(400);

        })
        });
    });
    it('Criar usuário com senha > 12', function(){
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
              method: 'POST',
              url: '/api/users',
              body: newuser.logSenhamais12,
        failOnStatusCode: false
        }).then(function (response){
            expect(response.status).to.eq(400);

        })
        });
    });
    it('Criar usuário sem preencher NAME', function(){
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
              method: 'POST',
              url: '/api/users',
              body: newuser.logSemName,
        failOnStatusCode: false
        }).then(function (response){
            expect(response.status).to.eq(400);

        })
        });
    });
    
    it('Criar usuário sem preencher EMAIL', function(){
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
              method: 'POST',
              url: '/api/users',
              body: newuser.logSememail,
        failOnStatusCode: false
        }).then(function (response){
            expect(response.status).to.eq(400);

        })
        });
    });

    it('Criar usuário sem preencher SENHA', function(){
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
              method: 'POST',
              url: '/api/users',
              body: newuser.logSemSenha,
        failOnStatusCode: false
        }).then(function (response){
            expect(response.status).to.eq(400);

        })
        });
    });
})
describe('Criando usuário com email existente', function(){


    it('Ao criar usuário com email já existente deve retornar 409', function(){
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
              method: 'POST',
              url: '/api/users',
              body: newuser.UserValido
        }).then(function (response){
            userid = response.body.id;
            console.log(userid)
        }).then(function(){
            cy.request({
                method: 'POST',
                url: '/api/users',
                body: newuser.UserValido,
                failOnStatusCode: false 
            }).then(function (response){
                expect(response.status).to.eq(409)
            })
        })
    }); 
    });
    after('Realizando login', function(){
        cy.loginValido()
        .then(function (response) {
            tokenid = response.body.accessToken;
            console.log(tokenid)
        }).then('Promover usuario', function(){
            if (!tokenid) {
                cy.log('Token de autenticação não foi obtido.');
                assert.fail('Token de autenticação não foi obtido.');
            }
            cy.promoverAdmin(tokenid)
            .then('Excluir usuário', function () {
                cy.excluirUsuario(userid, tokenid)
              });
        });
    });
})


