module.exports = (sequelize, DataTypes) => {
    const employer_payment = sequelize.define('employer_payment', {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        membership_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        employer_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        transaction_id:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        transaction_status:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        transaction_token:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        price:{
            type:DataTypes.STRING(255),
            allowNull:false
        }
    }, {
        tableName:'employer_payment',
        createdAt:"created_at",
        updatedAt:"updated_at"
    })
    employer_payment.associate = (models) => {
        employer_payment.belongsTo(models.employer, {
            foreignKey:"employer_id",
            targetKey:"id"
        })
        employer_payment.belongsTo(models.employer_membership_plans, {
            targetKey:"membership_id",
            targetKey:"id"
        })
    }
    return employer_payment
}