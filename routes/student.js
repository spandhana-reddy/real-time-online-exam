const express=require('express');
const router=express.Router();
const path=require('path');
const db=require('../db');
const bcrypt=require('bcrypt');

const view=file=>
path.join(__dirname,'../views',file);

const checkStudent=(req,res,next)=>{

if(!req.session.studentId){

return res.redirect('/');

}

next();

};


/* Home */

router.get('/',(req,res)=>{

res.sendFile(
view('login.html')
);

});


/* Register Page */

router.get('/register',(req,res)=>{

res.sendFile(
view('register.html')
);

});


/* Register */

router.post('/register',async(req,res)=>{

try{

const {name,email,password}=req.body;

const hash=await bcrypt.hash(
password,
10
);

await db.query(

'INSERT INTO students(name,email,password) VALUES($1,$2,$3)',

[name,email,hash]

);

res.sendFile(
view('registration-success.html')
);

}

catch(err){

console.log(err);
res.send("Registration Failed");

}

});


/* Login */

router.post('/login',async(req,res)=>{

try{

const {email,password}=req.body;

const result=await db.query(

'SELECT * FROM students WHERE email=$1',

[email]

);

if(result.rows.length===0){

return res.send(
'User not found'
);

}

const student=result.rows[0];

const match=await bcrypt.compare(
password,
student.password
);

if(!match){

return res.send(
'Invalid Password'
);

}

req.session.studentId=
student.student_id;

res.redirect('/dashboard');

}

catch(err){

console.log(err);

res.send(
'Database Error'
);

}

});


/* Dashboard */

router.get(
'/dashboard',
checkStudent,
(req,res)=>{

res.sendFile(
view('dashboard.html')
);

});


/* Logout */

router.get('/logout',(req,res)=>{

req.session.destroy(()=>{

res.redirect('/');

});

});

module.exports=router;