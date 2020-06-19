module.exports = (sequelize, DataTypes) => {
    const forget_password = sequelize.define('forget_password', {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        otp:{
            type:DataTypes.INTEGER(10),
            allowNull:false
        },
        is_valid:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },
        login_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    }, {
        tableName:'forget_password',
        createdAt:'created_at',
        updatedAt:'updated_at'
    })
    forget_password.associate = (models) => {
        forget_password.belongsTo(models.login, {
            foreignKey:'login_id',
            targetKey:'id'
        })
    }
    return forget_password
}