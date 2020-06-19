module.exports = (sequelize, DataTypes) =>{
    const apply_jobs = sequelize.define('apply_jobs', {
        jobSeekerId:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        jobPostId:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    }, {
        tableName:'apply_jobs',
        createdAt:"created_at",
        updatedAt:"updated_at"
    })
    return apply_jobs
}