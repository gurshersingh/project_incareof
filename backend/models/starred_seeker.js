
module.exports = (sequelize, DataTypes) =>{
    const starred_seeker = sequelize.define('starred_seeker', {
        id:{
            type:DataTypes.INTEGER, 
            autoIncrement:true,
            primaryKey:true
        },
        employer_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        job_seeker_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        status:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:1
        }
    }, {
        tableName:'starred_employer',
        createdAt:'created_at',
        updatedAt:'updated_at'
    })
    starred_seeker.associate = (models) => {
        starred_seeker.belongsTo(models.job_seeker, {
            foreignKey:'job_seeker_id',
            targetKey:'id'
        })
        starred_seeker.belongsTo(models.employer, {
            foreignKey:'employer_id', 
            targetKey:'id'
        })
    }
    return starred_seeker
}