module.exports = {
    development: {
        driver:   'mongodb',
        url:      'mongodb://localhost/aboutus-dev'
    },
    test: {
        driver:   'mongodb',
        url:      'mongodb://localhost/aboutus-test'
    },
    production: {
        driver:   'mongodb',
        url:      'mongodb://localhost/aboutus'
    }
};
