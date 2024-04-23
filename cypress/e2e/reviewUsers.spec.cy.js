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
        cy.promoverAdmin(tokenid);
        cy.excluirUsuario(userid, tokenid);
    });
    it('Criar review com perfil Admin deve retornar 201', function () {
        cy.promoverAdmin(tokenid);
        cy.request({
            method: "POST",
            url: "api/users/review",
            body: {
                "movieId": idMovies,
                "score": 5,
                "reviewText": "Filme muito bom"
            },
            headers: {
                Authorization: `Bearer ${tokenid}`
            }
        }).then(function (review) {
            expect(review.status).to.eq(201)
        });
    });
    it('Criar review com nota > 5 deve retornar 400', function () {
        cy.request({
            method: "POST",
            url: "api/users/review",
            body: {
                "movieId": idMovies,
                "score": 6,
                "reviewText": "Filme muito bom"
            },
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${tokenid}`
            }
        }).then(function (review) {
            expect(review.status).to.eq(400)
        });
    });
    it('Criar review com nota < 1 deve retornar 400', function () {
        cy.request({
            method: "POST",
            url: "api/users/review",
            body: {
                "movieId": idMovies,
                "score": 0,
                "reviewText": "Filme muito ruim"
            },
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${tokenid}`
            }
        }).then(function (review) {
            expect(review.status).to.eq(400)
        });
    });
    it('Criar review preenchendo campo "score" com string deve retornar 400', function () {
        cy.request({
            method: "POST",
            url: "api/users/review",
            body: {
                "movieId": idMovies,
                "score": "um",
                "reviewText": "Filme muito ruim"
            },
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${tokenid}`
            }
        }).then(function (review) {
            expect(review.status).to.eq(400)
        });
    });
    it('Criar review com perfil Crítico deve retornar 201', function () {
        cy.promoverCritico(tokenid);
        cy.request({
            method: "POST",
            url: "api/users/review",
            body: {
                "movieId": idMovies,
                "score": 5,
                "reviewText": "Filme muito bom"
            },
            headers: {
                Authorization: `Bearer ${tokenid}`
            }
        }).then(function (review) {
            expect(review.status).to.eq(201)
        });
    });

});




describe('Criação de review com usuario comum e usuario não logado', function () {
    it('Usuário não logado ao tentar criar review deve retornar 401', function () {
        cy.request({
            method: "POST",
            url: "/api/users/review",
            failOnStatusCode: false
        })
            .then(function (response) {
                expect(response.status).to.eq(401);
            })
    });
    it('Usuário comum ao criar review deve retornar 201', function () {
        cy.criarUsuario().then(function (response) {
            userid = response.body.id;
            cy.loginValido().then(function (response) {
                tokenid = response.body.accessToken;
                cy.request({
                    method: "POST",
                    url: "api/users/review",
                    body: {
                        "movieId": idMovies,
                        "score": 5,
                        "reviewText": "Filme muito bom"
                    },
                    headers: {
                        Authorization: `Bearer ${tokenid}`
                    }
                }).then(function (review) {
                    expect(review.status).to.eq(201)
                });

            });
        })
    });
    after(function () {
        cy.promoverAdmin(tokenid);
        cy.excluirUsuario(userid, tokenid);
    });
});

describe('Consultar reviews existentes', function () {
    it('Buscar todas as reviews sem estar logado deve retornar 401', function () {
        cy.request({
            url: '/api/users/review/all',
            failOnStatusCode: false
        }).then(function (review) {
            expect(review.status).to.eq(401)
        });
    });
    it('Buscar todas as reviews com perfil comum deve retornar 200', function () {
        cy.criarUsuario().then(function (response) {
            userid = response.body.id;
            cy.loginValido().then(function (response) {
                tokenid = response.body.accessToken;
                cy.request({
                    url: '/api/users/review/all',
                    headers: {
                        Authorization: `Bearer ${tokenid}`
                    },
                }).then(function (review) {
                    expect(review.status).to.eq(200)
                });
            })
        })
    });
    it('Buscar todas as reviews com perfil crítico deve retornar 200', function () {
        cy.promoverCritico(tokenid);
        cy.request({
            url: '/api/users/review/all',
            headers: {
                Authorization: `Bearer ${tokenid}`
            },
        }).then(function (review) {
            expect(review.status).to.eq(200)
        })
    });
    it('Buscar todas as reviews com perfil Admin deve retornar 200', function () {
        cy.promoverAdmin(tokenid);
        cy.request({
            url: '/api/users/review/all',
            headers: {
                Authorization: `Bearer ${tokenid}`
            },
        }).then(function (review) {
            expect(review.status).to.eq(200)
        })
    });
    after(function () {
        cy.promoverAdmin(tokenid);
        cy.excluirUsuario(userid, tokenid);
    });
});


