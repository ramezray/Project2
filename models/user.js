var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');


module.exports = function(sequelize, DataTypes) {
  // setup User model and its fields.
var User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

User.associate = function(models) {
  // Associating Author with Posts
  // When an Author is deleted, also delete any associated Posts
  User.hasMany(models.Item, {
    onDelete: "cascade"
  });
};

User.beforeCreate((user, options) => {
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(user.password, salt);
});


User.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// create all the defined tables in the specified database.
sequelize.sync()
  .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
  .catch(error => console.log('This error occured', error));

  return User;
};
