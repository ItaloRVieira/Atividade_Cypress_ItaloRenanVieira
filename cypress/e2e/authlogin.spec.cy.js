let userid
let tokenid

describe('Cenarios de login', function(){

    before('Criando usuário', function(){
        cy.criarUsuario().then(function (response){
            userid = response.body.id;
            console.log(userid)
        });
    });

    it('Realizando login válido', function(){
        cy.fixture('login.json',).then(function (login) {
            cy.log(login);
            cy.request({
                method: 'POST',
                url: '/api/auth/login',
                body: login.valido
            }).then(function (response) {
                expect(response.status).to.eq(200);
                tokenid = response.body.accessToken;
                console.log(tokenid)
            })
        });
    });

    after('Promover usuario', function(){
        cy.promoverAdmin(tokenid)
        .then('Excluir usuário', function () {
            cy.excluirUsuario(userid, tokenid)
          });
      
    });
})
describe('Logins incorretos', function(){
    it('Realizando login sem preencher email', function(){
        cy.fixture('login.json',).then(function (login) {
            cy.log(login);
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
    it('Realizando login sem preencher a senha', function(){
        cy.fixture('login.json',).then(function (login) {
            cy.log(login);
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
    it('Realizando login com senha incorreta', function(){
        cy.fixture('login.json',).then(function (login) {
            cy.log(login);
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
