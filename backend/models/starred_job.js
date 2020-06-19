module.exports = (sequelize, DataTypes) => {
    const starred_job = sequelize.define(
        "starred_job",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            job_seeker_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            job_post_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
        },
        {
            tableName: "starred_job",
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    starred_job.associate = (models) => {
        starred_job.belongsTo(models.job_seeker, {
            foreignKey: "job_seeker_id",
            targetKey: "id",
        });
        starred_job.belongsTo(models.job_post, {
            foreignKey: "job_post_id",
            targetKey: "id",
        });
    };
    return starred_job;
};
