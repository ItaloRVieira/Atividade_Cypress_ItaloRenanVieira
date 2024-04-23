let userid
let tokenid
let failOnStatusCode

describe('Cenarios de criação de filmes em perfis variados', function () {

    beforeEach(function () {
        cy.criarUsuario().then(function (response) {
            userid = response.body.id;

            cy.loginValido().then(function (response) {
                tokenid = response.body.accessToken;
            });
        });
    });
    afterEach(function () {
        cy.promoverAdmin(tokenid);
        cy.excluirUsuario(userid, tokenid);
    });


    it('Criar filme com perfil comum deve retornar 403', function () {
        cy.criarFilme(failOnStatusCode = false, tokenid)

            .then(function (resposta) {
                expect(resposta.status).to.eq(403);

            })
    });

    it('Criar filme com perfil crítico deve retornar 403', function () {
        cy.promoverCritico(tokenid);
        cy.criarFilme(failOnStatusCode = false, tokenid)

            .then(function (resposta) {
                expect(resposta.status).to.eq(403);

            })
    });

    it('Criar filme com perfil admin deve retornar 201', function () {

        cy.promoverAdmin(tokenid);
        cy.criarFilmeValido(tokenid)
            .then(function (responseMovie) {
                expect(responseMovie.status).to.eq(201);
            })

    });
});

describe('Criar filmes em cenários diversos', function () {

    beforeEach(function () {
        cy.criarUsuario().then(function (response) {
            userid = response.body.id;
            cy.loginValido().then(function (response) {
                tokenid = response.body.accessToken;
                cy.promoverAdmin(tokenid);
            });
        });
    });
    afterEach(function () {
        cy.excluirUsuario(userid, tokenid);
    });

    it('Criar filme com informação de duração negativa deve retornar 400', function () {
        cy.fixture('movies.json').then(function (novoFilme) {
            cy.request({
                method: 'POST',
                url: '/api/movies',
                body: novoFilme.movieTimeNegativo,
                headers: {
                    Authorization: `Bearer ${tokenid}`
                },
                failOnStatusCode: false
            }).then(function (respostaFilme) {
                expect(respostaFilme.status).to.eq(400);
            })
        })
    });

    it('Filme com ano de lançamento futuro deve retornar 400', function () {
        cy.fixture('movies.json').then(function (jsonFilmes) {
            cy.request({
                method: 'POST',
                url: '/api/movies',
                body: jsonFilmes.movieDataFutura,
                headers: {
                    Authorization: `Bearer ${tokenid}`
                },
                failOnStatusCode: false
            }).then(function (respFilme) {
                expect(respFilme.status).to.eq(400);
            })
        })
    });

    it('Filme com time zerado deve retornar 400', function () {
        cy.fixture('movies.json').then(function (filmeZerado) {
            cy.request({
                method: 'POST',
                url: '/api/movies',
                body: filmeZerado.movieTimeZerado,
                headers: {
                    Authorization: `Bearer ${tokenid}`
                },
                failOnStatusCode: false
            }).then(function (reqFilmeZerado) {
                expect(reqFilmeZerado.status).to.eq(400);
            })
        })
    });

    it('Filme com ano de lançamento 0 deve retornar 400', function () {
        cy.fixture('movies.json').then(function (movieAnoZero) {
            cy.request({
                method: 'POST',
                url: '/api/movies',
                body: movieAnoZero.movieTimeZerado,
                headers: {
                    Authorization: `Bearer ${tokenid}`
                },
                failOnStatusCode: false
            }).then(function (reqFilmeAnoZero) {
                expect(reqFilmeAnoZero.status).to.eq(400);
            })
        })
    });
});
