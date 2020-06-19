module.exports = (sequelize, DataTypes) => {
    const login = sequelize.define('login', {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        email:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        password:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        verified_email:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },
        type:{
            type:DataTypes.ENUM('EMPLOYER', 'JOB_SEEKER'),
            allowNull:false
        }
    }, {
        tableName:"login",
        createdAt:'created_at',
        updatedAt:'updated_at'
    })
    login.associate = (models) =>{
        login.hasMany(models.job_seeker, {
            targetKey:"id",
            foreignKey:"user_id"
        })
        login.hasMany(models.employer, {
            targetKey:"id",
            foreignKey:"user_id"
        })
    }
    return login
}