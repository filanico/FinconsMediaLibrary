const { Episode } = require('./MediaItems');
const { EpisodesRepository } = require('./Repositories');

test('Repository manages class reference', () => {
    let episodes = new EpisodesRepository();
    let episode = episodes.create({title:"Episode title"})
    expect( episode instanceof Episode )
  expect(1+2).toBe(3);
});