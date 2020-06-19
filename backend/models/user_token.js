module.exports = (sequelize, DataTypes) => {
    const user_token = sequelize.define('user_token', {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        token:{
            type:DataTypes.TEXT('long'),
            allowNull:false
        },
        login_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    }, {
        tableName:'user_token',
        createdAt:"created_at",
        updatedAt:"updated_at"
    })
    user_token.associate = (models) => {
        user_token.belongsTo(models.login, {
            foreignKey:'login_id',
            targetKey:'id'
        })
    }
    return user_token
}