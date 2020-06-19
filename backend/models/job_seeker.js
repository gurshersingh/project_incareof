module.exports = (sequelize, DataTypes) =>{
    const job_seeker = sequelize.define('job_seeker', {
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
    },{
        tableName:'job_seeker',
        createdAt:'created_at',
        updatedAt:'updated_at'
    })
    job_seeker.associate = (models) => {
        job_seeker.belongsTo(models.login, {
            foreignKey:"user_id",
            targetKey:"id"
        })
        job_seeker.belongsToMany(models.job_post, {through:'apply_jobs'})
    }
    return job_seeker
}