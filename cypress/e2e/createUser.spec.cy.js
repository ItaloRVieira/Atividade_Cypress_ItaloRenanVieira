let userid
let tokenid

describe('Criando usuário válido', function () {


    it('Criar usuário seguindo as regras de negócio deve retornar 201', function () {
        cy.criarUsuario()
            .then(function (response) {
                expect(response.status).to.eq(201);
                userid = response.body.id;
            })
    });

    after(function () {
        cy.loginValido()
            .then(function (response) {
                tokenid = response.body.accessToken;
                cy.promoverAdmin(tokenid);
                cy.excluirUsuario(userid, tokenid)
            });
    })
})

describe('Criar usuários inválidos', function () {
    it('Criar usuário com email inválido deve retornar 400', function () {
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
                method: 'POST',
                url: '/api/users',
                body: newuser.logEmailInvalido,
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);

            })
        });
    });
    it('Criar usuário com senha < 6 caracteres deve retornar 400', function () {
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
                method: 'POST',
                url: '/api/users',
                body: newuser.logSenhamenos6,
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);

            })
        });
    });
    it('Criar usuário com senha > 12 caracteres deve retornar 400', function () {
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
                method: 'POST',
                url: '/api/users',
                body: newuser.logSenhamais12,
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);

            })
        });
    });
    it('Criar usuário sem preencher NAME deve retornar 400', function () {
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
                method: 'POST',
                url: '/api/users',
                body: newuser.logSemName,
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);

            })
        });
    });

    it('Criar usuário sem preencher EMAIL deve retornar 400', function () {
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
                method: 'POST',
                url: '/api/users',
                body: newuser.logSememail,
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);

            })
        });
    });

    it('Criar usuário sem preencher SENHA deve retornar 400', function () {
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
                method: 'POST',
                url: '/api/users',
                body: newuser.logSemSenha,
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);

            })
        });
    });
})
describe('Criando usuário com email existente', function () {


    it('Ao criar usuário com email já existente deve retornar 409', function () {
        cy.fixture('createuser.json').then(function (newuser) {
            cy.request({
                method: 'POST',
                url: '/api/users',
                body: newuser.UserValido
            }).then(function (response) {
                userid = response.body.id;
            }).then(function () {
                cy.request({
                    method: 'POST',
                    url: '/api/users',
                    body: newuser.UserValido,
                    failOnStatusCode: false
                }).then(function (response) {
                    expect(response.status).to.eq(409)
                })
            })
        });
    });
    after(function () {
        cy.loginValido()
            .then(function (response) {
                tokenid = response.body.accessToken;
                cy.promoverAdmin(tokenid);
                cy.excluirUsuario(userid, tokenid)
            });
    });
})


