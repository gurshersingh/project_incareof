const cors = require('cors')
const bodyParser = require('body-parser')

module.exports = (app, express) => {

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());
    
}