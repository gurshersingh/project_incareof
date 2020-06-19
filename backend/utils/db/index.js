const sequelize = require('sequelize')

const database = {
    "database":"incareof",
    "options": {
        "logging": true,
        "dialect": "mysql",
        "underscored": "true",
        "freezeTableName": "true",
        "port": 3306,
        "pool": {
            "max": 50,
            "min": 0,
            "idle": 500
        },
        "replication": {
            "write": {
                "username": "root",
                "password": "password",
                "host": "127.0.0.1",
                "port": 3306
            },
            "read": [
                {
                    "username": "root",
                    "password": "password",
                    "host": "127.0.0.1",
                    "port": 3306
                }
            ]
        }
    }
}
 module.exports =  {
     sequelize: new sequelize(database.database, database.username, database.password, database.options)
 }