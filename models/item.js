
module.exports = function (sequelize, DataTypes) {
    var Item = sequelize.define("Item", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1]
            }
        },
        categories: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1]
            }
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            len: [1]
        },
        price: {
            type: DataTypes.DECIMAL(50,2),
            allowNull: true,
            validate: {
                len: [1]
            }
        },
        sellerContact: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1]
            }
        }
    });

    Item.associate = function (models) {
        // Link user to his item using foreign key constraint
        Item.belongsTo(models.users, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Item;
};