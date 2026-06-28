require('dotenv').config();

const { Pool } = require('pg');

const db = new Pool({

host: process.env.DB_HOST,
port: process.env.DB_PORT,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,

ssl:{
rejectUnauthorized:false
}

});

db.connect()

.then(()=>{

console.log(
"Database Connected Successfully"
);

})

.catch(err=>{

console.log(
"Database Error:",
err
);

});

module.exports=db;