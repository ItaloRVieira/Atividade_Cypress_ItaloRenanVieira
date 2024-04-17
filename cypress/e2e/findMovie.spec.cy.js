const { expect } = require("chai")
const { faker } = require('@faker-js/faker');

describe('Pesquisar por filmes com perfil admin', function() {
    let userid;
    let tokenid;
    let movietitle;
    let notTitleMovie;

    before('Criando usuário válido, realizando login, promovendo para admin e criando filme', function() {
        cy.criarUsuario()
        .then(function(response) {
                expect(response.status).to.eq(201);
                userid = response.body.id;
                console.log(userid);

                cy.loginValido()
                    .then(function(response) {
                        tokenid = response.body.accessToken;
                        console.log(tokenid);
                        cy.promoverAdmin(tokenid);
                        cy.fixture('movies.json').then(function(newmovie) {
                            cy.request({
                                method: 'POST',
                                url: '/api/movies',
                                body: newmovie.movieValido,
                                headers: {
                                    Authorization: `Bearer ${tokenid}`
                                }
                            }).then(function(responseMovie) {
                                console.log(responseMovie);
                                expect(responseMovie.status).to.eq(201);
                            });
                    });
            });
        });
    });

    after('Excluir usuário', function() {
        cy.excluirUsuario(userid, tokenid);
    });

    it('Consultando filme válido', function() {
        cy.request({
            method: 'GET',
            url: '/api/movies/search?title=' + movietitle,
            headers: {
                Authorization: `Bearer ${tokenid}`
            }
        });
    });

    it('Consultando filme não existente', function() {
        cy.request({
            method: 'GET',
            url: '/api/movies',
        }).then(function(response) {
            expect(response.status).to.eq(200);

            const listarFilmes = response.body;
            const titleMovie = listarFilmes.map(filme => filme.title);

            do {
                notTitleMovie = faker.lorem.words();
            } while (titleMovie.includes(notTitleMovie));

            cy.request({
                method: 'GET',
                url: '/api/movies/search?title=' + notTitleMovie
            }).then(function(response) {
                expect(response.status).to.eq(200);
            });
        });
    });
});