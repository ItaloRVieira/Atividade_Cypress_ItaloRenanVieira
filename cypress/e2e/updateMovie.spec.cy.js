let userid;
let tokenid;
let idMovie;
let idMovies;
let newMovieCreatedId

describe('criação de review com usuário logado', function () {
    before(function () {
        cy.criarUsuario().then(function (response) {
            userid = response.body.id;
            cy.loginValido().then(function (response) {
                tokenid = response.body.accessToken;
                cy.promoverAdmin(tokenid);
                cy.criarFilmeValido(tokenid)
            })

            cy.request({
                method: 'GET',
                url: '/api/movies/search?title=' + 'TROIA',
                headers: {
                    Authorization: `Bearer ${tokenid}`
                }
            }).then(function (idFilme) {
                const titleid = idFilme.body;
                idMovie = titleid.map(movie => movie.id);

                for (let i = 0; i < idMovie.length; i++) {
                    if (idMovie[i] !== newMovieCreatedId) {
                        idMovies = idMovie[i];
                        break;
                    }
                }
                expect(idMovies).to.exist;
            });
        });
    });
    after(function () {
        cy.excluirUsuario(userid, tokenid);
    });
    it('Atualizar as informações de um filme com todas as informações completas deve retornar 204', function () {
        cy.fixture('updateMovie.json').then(function (updateMovie) {
            cy.request({
                method: 'PUT',
                url: '/api/movies/' + idMovies,
                body: updateMovie.updateValido,
                headers: {
                    Authorization: `Bearer ${tokenid}`
                }
            }).then(function (updated) {
                expect(updated.status).to.eq(204);
            });
        });
    });
    it('Atualizar a duração de um filme para um valor negativo deve retornar 400', function () {
        cy.fixture('updateMovie.json').then(function (updateMovie) {
            cy.request({
                method: 'PUT',
                url: '/api/movies/' + idMovies,
                body: updateMovie.updateDurationNegative,
                headers: {
                    Authorization: `Bearer ${tokenid}`
                },
                failOnStatusCode: false
            }).then(function (updated) {
                expect(updated.status).to.eq(400);
            });
        });
    });

    it('Atualizar o ano de lançamento de um filme para uma data futura deve retornar 400', function () {
        cy.fixture('updateMovie.json').then(function (updateMovie) {
            cy.request({
                method: 'PUT',
                url: '/api/movies/' + idMovies,
                body: updateMovie.updateReleaseFutura,
                headers: {
                    Authorization: `Bearer ${tokenid}`
                },
                failOnStatusCode: false
            }).then(function (updated) {
                expect(updated.status).to.eq(400);
            });
        });
    });
    it('Atualizar a duração de um filme para 0 deve retornar 400', function () {
        cy.fixture('updateMovie.json').then(function (updateMovie) {
            cy.request({
                method: 'PUT',
                url: '/api/movies/' + idMovies,
                body: updateMovie.updateDuracaoZero,
                headers: {
                    Authorization: `Bearer ${tokenid}`
                },
                failOnStatusCode: false
            }).then(function (updated) {
                expect(updated.status).to.eq(400);
            });
        });
    });
    it('Atualizar o ano de lançamento de um filme para 0 deve retornar 400', function () {
        cy.fixture('updateMovie.json').then(function (updateMovie) {
            cy.request({
                method: 'PUT',
                url: '/api/movies/' + idMovies,
                body: updateMovie.updateReleaseZero,
                headers: {
                    Authorization: `Bearer ${tokenid}`
                },
                failOnStatusCode: false
            }).then(function (updated) {
                expect(updated.status).to.eq(400);
            });
        });
    });
})
