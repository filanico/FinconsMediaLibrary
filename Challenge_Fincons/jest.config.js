const jestConfig = {
    verbose: true,
    testEnvironmentOptions: {
        url: "http://localhost:3000"
    },
    testMatch: ['**/tests/*.js'],
    bail: 1
}
module.exports = jestConfig