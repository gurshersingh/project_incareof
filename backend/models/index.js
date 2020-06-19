let fs = require('fs')
let path = require('path')
let _ = require('underscore')

module.exports = function (sequelize, wagner) {
    this.sequelize = sequelize;
    this.wagner = wagner;
    this.models = {};
    
    const excludeFiles = [
        "index.js"
    ]
    fs
        .readdirSync(__dirname)
        .filter(file => {
            return (file.indexOf(".") !== 0) && (excludeFiles.indexOf(file) < 0);
        }).forEach(file => {
        try {
            
            const model = this.sequelize.import(path.join(__dirname, file));
            return this.models[model.name] = model;
        }
        catch (err) {
            console.log(err)
        }
    })
    Object.keys(this.models).forEach(modelName => {
        if ('associate' in this.models[modelName]) {
            return this.models[modelName].associate(this.models);
        }
    })

    // To ensure DRY-ness, register factories in a loop
    _.each(this.models, (value, key) => {
        return this.wagner.factory(key, () => {
            return value
        })
    })
    
    return this.models
}
