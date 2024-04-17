let userid
let tokenid
let idUsuarios
let generateId
let otherUserId
let newUserCreatedId
let userViewID

describe('Pesquisas de usuários', function () {

    before('Criando usuário', function () {
        cy.criarUsuario().then(function (response) {
                userid = response.body.id;
            }).then('Realizando login válido', function () {
                cy.fixture('login.json',).then(function (login) {
                    cy.log(login);
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

    it('Pesquisar ID de outro usuario com perfil Crítico', function () {
        cy.promoverAdmin(tokenid)
        .then(function (patchResponse) {
            expect(patchResponse.status).to.eq(204);
            cy.request({
                method: 'GET',
                url: '/api/users',
                headers: {
                    Authorization: `Bearer ${tokenid}`
                }
            }).then(function (getUsersResponse) {
                expect(getUsersResponse.status).to.eq(200);

                const users = getUsersResponse.body;

                const userIds = users.map(user => user.id);

                for (let i = 0; i < userIds.length; i++) {
                    if (userIds[i] !== newUserCreatedId) {
                        otherUserId = userIds[i];
                        break;
                    }
                }

                expect(otherUserId).to.exist;
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
    });

    it('Pesquisando ID de outro usuario com perfil Comum', function () {
        cy.request({
            method: 'GET',
            url: '/api/users/' + otherUserId,
            headers: {
                Authorization: `Bearer ${tokenid}`,

            },
            failOnStatusCode: false
        }).then(function (resposta) {
            if (resposta.status == 200) {
                cy.log('BUG, sucesso está sendo retornado pela API, erro 404 deveria ser apresentado, usuario pesquisado não existe.');
                assert.fail('BUG, sucesso está sendo retornado pela API, erro 404 deveria ser apresentado, usuario pesquisado não existe.');
            }
            expect(resposta.status).to.eq(403);
        })
    });

    it('Pesquisando ID de outro usuario com perfil Admin', function () {
        cy.promoverAdmin(tokenid)
        .then(function (resposta) {
            expect(resposta.status).to.eq(204);
        })
        cy.request({
            method: 'GET',
            url: '/api/users/' + otherUserId,
            headers: {
                Authorization: `Bearer ${tokenid}`,
            },
            failOnStatusCode: false
        }).then(function (resposta) {
            expect(resposta.status).to.eq(200);
            userViewID = resposta.body.id;
            if (userViewID == null) {
                cy.log('BUG, sucesso está sendo retornado pela API, erro 404 deveria ser apresentado, usuario pesquisado não existe.');
                assert.fail('BUG, sucesso está sendo retornado pela API, erro 404 deveria ser apresentado, usuario pesquisado não existe.');
            }
        })
    });

    it('Pesquisar usuário sem estar logado', function () {
        cy.request({
            method: 'GET',
            url: '/api/users/' + userid,
            failOnStatusCode: false
        }).then(function (resposta) {
            expect(resposta.status).to.eq(401);
        })
    });

    it('Pesquisar ID de usuario inexistente', function () {
        cy.promoverAdmin(tokenid)
        .then(function(patchResponse) {
            expect(patchResponse.status).to.eq(204);

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

                cy.then(function() {
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
                    });
                });
            });
        });
    })
    after('Excluir usuário', function () {
        cy.excluirUsuario(userid, tokenid)
      })
});
