module.exports = (sequelize, DataTypes) => {
    const employer =  sequelize.define('employer', {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        title:{
            type:DataTypes.STRING,
            allowNull:true
        },
        first_name:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        last_name:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        phone_number:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        company_name:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        city:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        image:{
            type:DataTypes.TEXT('long'),
            allowNull:true
        },
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    }, {
        tableName:'employer',
        createdAt:'created_at',
        updatedAt:'updated_at'
    })
    employer.associate = (models) => {
        employer.belongsTo(models.login, {
            foreignKey:"user_id",
            targetKey:"id"
        })
    }
    return employer
}