module.exports = (sequelize, DataTypes) => {
    const employer_membership_plans = sequelize.define('employer_membership_plans', {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        membership_type:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        job_post_credit:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        candidates_info:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        price:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        employer_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        active:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        }
    },{
        tableName:'employer_membership_plans',
        createdAt:"created_at",
        updatedAt:"updated_at"
    })
    employer_membership_plans.associate = (models) => {
        employer_membership_plans.belongsTo(models.employer, {
            foreignKey:'employer_id',
            targetKey:'id'
        })
    }
    return employer_membership_plans
}