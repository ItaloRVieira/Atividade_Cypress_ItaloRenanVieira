const { faker } = require('@faker-js/faker');

describe('Pesquisar por filmes com perfil admin', function () {
    let userid;
    let tokenid;
    let movieTitle;
    let notTitleMovie;

    before(function () {
        cy.criarUsuario()
            .then(function (response) {
                userid = response.body.id;
                cy.loginValido()
                    .then(function (response) {
                        tokenid = response.body.accessToken;
                        cy.promoverAdmin(tokenid);
                        cy.fixture('movies.json').then(function (newmovie) {
                            movieTitle = newmovie.movieValido.title, 
                            cy.request({
                                method: 'POST',
                                url: '/api/movies',
                                body: newmovie.movieValido,  
                                headers: {
                                    Authorization: `Bearer ${tokenid}`
                                },
                            })
                        });
                    });
            });
    });

    after(function () {
        cy.excluirUsuario(userid, tokenid);
    });

    it('Consultar filme válido deve retornar 200', function () {
        cy.request({
            method: 'GET',
            url: '/api/movies/search?title=' + movieTitle,
            headers: {
                Authorization: `Bearer ${tokenid}`
            }
        }).then(function (resposta) {
            expect(resposta.status).to.eq(200);
            expect(resposta.body).to.be.a("array");
            expect(resposta.body[0]).to.have.property("title");
            expect(resposta.body[0]).to.have.property("genre");
            expect(resposta.body[0]).to.have.property("durationInMinutes");
            expect(resposta.body[0]).to.have.property("id");
            expect(resposta.body[0]).to.have.property("description");

        })
    });

    it('Consulta filme não existente retorna 200', function () {
        cy.request({
            method: 'GET',
            url: '/api/movies',
        }).then(function (response) {

            const listarFilmes = response.body;
            const titleMovie = listarFilmes.map(filme => filme.title);

            do {
                notTitleMovie = faker.lorem.words();
            } while (titleMovie.includes(notTitleMovie));

            cy.request({
                method: 'GET',
                url: '/api/movies/search?title=' + notTitleMovie,
            }).then(function (responseMovie) {
                expect(responseMovie.status).to.eq(200);
                expect(responseMovie.body).to.be.empty;
            });
        });
    });
});