module.exports = (sequelize, DataTypes) => {
    const service = sequelize.define('service', {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        service_name:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        status:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:1
        }
    },{
        tableName:'service',
        createdAt:'created_at',
        updatedAt:'updated_at'
    })
    service.associate = (models) => {

    }
    return service
}