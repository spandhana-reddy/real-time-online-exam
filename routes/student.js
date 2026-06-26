const express=require('express');
const router=express.Router();
const path=require('path');
const db=require('../db');
const bcrypt=require('bcrypt');

const view=file=>
path.join(
__dirname,
'../views',
file
);

const checkStudent=(req,res,next)=>{

if(!req.session.studentId)
return res.redirect('/');

next();

};


router.get('/',
(req,res)=>{

res.sendFile(
view('login.html')
);

});

router.get(
'/register',
(req,res)=>{

res.sendFile(
view('register.html')
);

});


router.post(
'/register',
async(req,res)=>{

const {
name,
email,
password
}=req.body;

const hash=
await bcrypt.hash(
password,
10
);

db.query(

'INSERT INTO students(name,email,password) VALUES(?,?,?)',

[name,email,hash],

()=>{

res.sendFile(
view('registration-success.html')
);

});

});


router.post(
'/login',
(req,res)=>{

const{
email,
password
}=req.body;

db.query(

'SELECT * FROM students WHERE email=?',

[email],

async(err,result)=>{

if(result.length===0)
return res.send(
'User not found'
);

const student=
result[0];

const match=
await bcrypt.compare(
password,
student.password
);

if(!match)
return res.send(
'Invalid Password'
);

req.session.studentId=
student.student_id;

res.redirect(
'/dashboard'
);

});

});


router.get(
'/dashboard',
checkStudent,
(req,res)=>{

res.sendFile(
view(
'dashboard.html'
));

});

router.get(
'/logout',
(req,res)=>{

req.session.destroy(
()=>res.redirect('/')
);

});

module.exports=router;