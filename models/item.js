
module.exports = function (sequelize, DataTypes) {
    var Item = sequelize.define("Item", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        categories: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        discription: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        },
        price: {
            type: DataTypes.DECIMAL(50,2),
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });

    // Item.associate = function (models) {
    //     // Link user to his item using foreign key constraint
    //     Item.belongsTo(models.User, {
    //         foreignKey: {
    //             allowNull: false
    //         }
    //     });
    // };

    return Item;
};