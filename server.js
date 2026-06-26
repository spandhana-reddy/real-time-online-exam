const express=require('express');
const bodyParser=require('body-parser');
const session=require('express-session');
const path=require('path');

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.use(session({
secret:'onlineexamsecret',
resave:false,
saveUninitialized:true
}));

app.use(
express.static(
path.join(__dirname,'public')
)
);


// Routes

app.use(
require('./routes/student')
);

app.use(
require('./routes/admin')
);

app.use(
require('./routes/exam')
);

app.use(
require('./routes/result')
);


const PORT=3000;

app.listen(PORT,()=>{

console.log(
`Server running at http://localhost:${PORT}`
);

});