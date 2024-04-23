let userid
let tokenid
let idUsuarios
let generateId
let otherUserId
let newUserCreatedId
let userViewID

describe('Pesquisas de usuários', function () {

    beforeEach(function () {
        cy.criarUsuario().then(function (response) {
            userid = response.body.id;
        }).then(function () {
            cy.fixture('login.json',).then(function (login) {
                cy.request({
                    method: 'POST',
                    url: '/api/auth/login',
                    body: login.valido
                }).then(function (response) {
                    tokenid = response.body.accessToken;
                })
            });
        });
    })

    it('Pesquisar ID de outro usuario com perfil Crítico deve retornar 403', function () {
        cy.promoverAdmin(tokenid)
        cy.request({
            method: 'GET',
            url: '/api/users',
            headers: {
                Authorization: `Bearer ${tokenid}`
            }
        }).then(function (getUsersResponse) {
            const users = getUsersResponse.body;
            const userIds = users.map(user => user.id);

            for (let i = 0; i < userIds.length; i++) {
                if (userIds[i] !== newUserCreatedId) {
                    otherUserId = userIds[i];
                    break;
                }
            }
            cy.promoverCritico(tokenid)
                .then(function () {
                    cy.request({
                        method: 'GET',
                        url: '/api/users/' + otherUserId,
                        headers: {
                            Authorization: `Bearer ${tokenid}`,
                        },
                        failOnStatusCode: false
                    }).then(function (getResponse) {
                        expect(getResponse.status).to.eq(403);
                    });
                });
        });
    });

    it('Pesquisar ID de outro usuario com perfil Comum deve retornar 403', function () {

        cy.request({
            method: 'GET',
            url: '/api/users/' + otherUserId,
            headers: {
                Authorization: `Bearer ${tokenid}`,

            },
            failOnStatusCode: false,
        }).then(function (resposta) {
            expect(resposta.status).to.eq(403);
        })
        cy.request({
            method: 'GET',
            url: '/api/users/' + userid,
            headers: {
                Authorization: `Bearer ${tokenid}`,

            }
        })
    });

    it('Pesquisar ID de outro usuario com perfil Admin deve retornar 200', function () {
        cy.promoverAdmin(tokenid)
        cy.request({
            method: 'GET',
            url: '/api/users/' + otherUserId,
            headers: {
                Authorization: `Bearer ${tokenid}`,
            },
        }).then(function (resposta) {
            expect(resposta.status).to.eq(200);
            userViewID = resposta.body.id;
        })
    });

    it('Pesquisar usuário sem estar logado deve retornar 401', function () {
        cy.request({
            method: 'GET',
            url: '/api/users/' + userid,
            failOnStatusCode: false
        }).then(function (resposta) {
            expect(resposta.status).to.eq(401);
        })
    });

    it('Pesquisar ID de usuario inexistente deve retornar 200 e body vazio', function () {
        cy.promoverAdmin(tokenid);
        cy.request({
            method: 'GET',
            url: '/api/users',
            headers: {
                Authorization: `Bearer ${tokenid}`
            }
        }).then(function (response) {
            const idUsuarios = response.body.map(user => user.id);

            do {
                generateId = Math.floor(Math.random() * 1000);
            } while (idUsuarios.includes(generateId));

            Cypress.env('generatedId', generateId);

            cy.then(function () {
                const generatedId = Cypress.env('generatedId');
                return cy.request({
                    method: 'GET',
                    url: '/api/users/' + generatedId,
                    headers: {
                        Authorization: `Bearer ${tokenid}`,
                    },
                    failOnStatusCode: false
                }).then(function (resposta) {
                    expect(resposta.status).to.eq(200);
                    expect(resposta.body).to.be.empty
                });
            });
        });
    })
    afterEach('Excluir usuário', function () {
        cy.promoverAdmin(tokenid);
        cy.excluirUsuario(userid, tokenid)
    })
});
