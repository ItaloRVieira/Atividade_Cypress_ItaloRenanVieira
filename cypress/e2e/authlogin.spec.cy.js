let userid
let tokenid

describe('Cenarios de login', function () {

    before('Criando usuário', function () {
        cy.criarUsuario().then(function (response) {
            userid = response.body.id;
        });
    });

    it('Realizar login válido deve retornar 200', function () {
        ;
        cy.loginValido().then(function (response) {
            expect(response.status).to.eq(200);
            tokenid = response.body.accessToken;
        })
    });
});

after('Promover usuario', function () {
    cy.promoverAdmin(tokenid);
            cy.excluirUsuario(userid, tokenid)
});
describe('Logins incorretos', function () {
    it('Realizar login sem preencher email deve retornar 400', function () {
        cy.fixture('login.json',).then(function (login) {
            cy.request({
                method: 'POST',
                url: '/api/auth/login',
                body: login.sememail,
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);

            })
        });
    });
    it('Realizar login sem preencher a senha deve retornar 400', function () {
        cy.fixture('login.json',).then(function (login) {
            cy.request({
                method: 'POST',
                url: '/api/auth/login',
                body: login.semsenha,
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(400);
            })
        });
    });
    it('Realizar login com senha incorreta deve retornar 401', function () {
        cy.fixture('login.json',).then(function (login) {
            cy.request({
                method: 'POST',
                url: '/api/auth/login',
                body: login.senhaincorreta,
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eq(401);

            })
        });
    });
})
