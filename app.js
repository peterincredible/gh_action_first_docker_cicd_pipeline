require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_name = process.env.DB_NAME;
//databae sequilize setup
const { Sequelize,DataTypes } = require('sequelize');
const sequelize = new Sequelize(db_name, db_user, db_pass, {
  host: db_host,
  dialect: 'mysql',/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  // port: 33070,
  // logging: false,
  // pool: {
  //     max: 5,
  //     min: 0,
  //     acquire: 30000,
  //     idle: 10000
  //   },
});
//'/var/lib/mysql/mysql.sock' -> '/var/run/mysqld/mysqld.sock'
const User = sequelize.define(
  'User',
  {
     id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    
  },
);
(async () => {
    try {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('Connection has been established successfully again.');
  console.error("sequelize config property",sequelize.config.port,sequelize.config.host,sequelize.config.database);
} catch (error) {
  console.error("sequelize config property",sequelize.config.port,sequelize.config.host,sequelize.config.database);
  console.error('Unable to connect to the database:2', error);
}
})();

//end of sequelize setup

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.json());

app.get('/', (req, res) => {
     res.render('index', { pageTitle: 'Home Page', message: 'Welcome to EJS!' });
//   res.send('Hello from Node.js and Express!');
});
app.post('/submit/user', (req, res) => {
    const user = User.build({ firstName: req.body.first, lastName: req.body.last });
    user.save().then(() => {
      console.log('User saved to database');
      res.send(user);
    }).catch((error) => {
      console.error('Error saving user to database:', error);
      
      res.send(null).status(400);
    });
    
    // res.send({message:"ok ok ok ok"})
  
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}-${db_host}-${db_user}-${db_pass}`);
});