const { expect } = require('@jest/globals');
const { configurations } = require('../Configurations');
const { default: axios } = require('axios');
const { startServer, stopServer, app } = require('../Server');
const request = require('supertest');
const { Record } = require('../Record');

let httpClient = null;

beforeAll((done) => {
  httpClient = axios.create({
    baseURL: "http://localhost:" + configurations.serverPort,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  startServer(() => {
    console.log("Server is ready !");
    done()
  });
})

afterAll((done) => { stopServer(done) })

function test_repository_is_empty(repositoryUri) {
  test(repositoryUri, () => {
    httpClient.get(repositoryUri)
      .then(_response => {
        expect(_response._data.length).toBe(0)
        done()
      })
      .catch(error => {
        // console.log(error);
      })
  }, 1000)
}

function test_repository_has_at_least_one_item(repositoryUri) {
  test(repositoryUri, () => {
    httpClient.post(repositoryUri, { title: "Fake title for " + repositoryUri })
      .then(_response => {
        expect(_response._data.length).toBeGreaterThan(10)
        done()
      })
      .catch(error => {
        // console.log(error);
      })
  }, 1000)
}



let repositoriesUris = ['/series', '/movies', '/tv-shows', '/episodes', '/seasons']
let uri = repositoriesUris[0];

describe("GET - endpoints are working", () => {
  repositoriesUris.forEach(uri => {
    test(uri, (done) => {
      request(app)
        .get(uri)
        .expect(200)
        .end(done)
    }, 1000)
  })
})

describe("POST - endpoints can create mediaItems", () => {
  let idCounter = Record.ID;
  repositoriesUris.forEach(uri => {
    test(uri, (done) => {
      let response = request(app)
        .post(uri)
        .set('Content-Type', 'application/json')
        .send({ title: "Fake title for " + uri })
        .expect(200)
        .end((err, response) => {
          let jsonArray = response.body;
          done();
          jsonArray.forEach(json => expect(json.id).toBe(idCounter++))
        })
        ;
    }, 1000)
  })
})


describe("POST - endpoints can delete mediaItems", () => {
  let idCounter = Record.ID;
  repositoriesUris.forEach(uri => {
    test(uri, (done) => {
      request(app)
        .delete(uri + '/' + idCounter++)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).toBe(200)
          done();
        })
        ;
    }, 1000)
  })
})

function get_media_ids() {
  request(app)
    .get("/series")
    .end((err, res) => {
      let arr = res.body
      arr = arr.map(item => item.id)
    })
}
describe("POST - endpoints can update mediaItems", () => {
  let idCounter = Record.ID;
  get_media_ids();
  repositoriesUris.forEach(uri => {
    test(uri, (done) => {
      request(app)
        .put(uri + '/' + idCounter++)
        .send({ title: "title changed " })
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          let json = res.body;
          expect(res.status).toBe(200)
          done();
        })
        ;
    }, 1000)
  })
})




// test("test one", () => {
//   httpClient.post(uri, { title: "Fake title for " + uri })
//     .then(_response => {
//       expect(_response._data.length).toBeGreaterThan(10)
//       done()
//     })
//     .catch(error => {
//       // console.log(error);
//     })
// });
// describe('repositories are initially empty', () => {
//   repositoriesUris.forEach(repositoryUri => test_repository_is_empty(repositoryUri))
// });


// describe('repositories are filled after post request', () => {
//   repositoriesUris.forEach(repositoryUri => test_repository_has_at_least_one_item(repositoryUri))
// });