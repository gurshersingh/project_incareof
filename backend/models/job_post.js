module.exports = (sequelize, DataTypes) => {
    const job_post = sequelize.define('job_post', {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        job_title:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        job_description:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        start_date:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        end_date:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        wager_offered:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        job_service_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        employer_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        selected_user:{
            type:DataTypes.INTEGER,
            allowNull:true
        }
    }, {
        tableName:'job_post',
        createdAt:'created_at',
        updatedAt:'updated_at'
    })
    job_post.associate = (models) => {
        job_post.belongsTo(models.employer, {
            foreignKey:"employer_id",
            targetKey:"id"
        })
        job_post.belongsTo(models.service, {
            foreignKey:'job_service_id',
            targetKey:'id'
        })
        job_post.belongsTo(models.login, {
            foreignKey:'selected_user',
            targetKey:'id'
        })
        job_post.belongsToMany(models.job_seeker, {through:'apply_jobs'})
        // job_post.hasMany(models.starred_job, {
        //     foreignKey:'job_post_id',
        //     targetKey:'id'
        // })
    }
    return job_post
}