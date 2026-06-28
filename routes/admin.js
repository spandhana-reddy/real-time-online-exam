const express=require('express');
const router=express.Router();
const path=require('path');
const bcrypt=require('bcrypt');
const db=require('../db');

const view=file=>
path.join(
__dirname,
'../views',
file
);


/* Admin Login Page */

router.get('/admin',(req,res)=>{

res.sendFile(
view('admin-login.html')
);

});


/* Admin Login */

router.post('/admin/login',async(req,res)=>{

try{

const{
username,
password
}=req.body;

const result=
await db.query(

'SELECT * FROM admin WHERE username=$1',

[username]

);

if(result.rows.length===0){

return res.send(
'Admin Not Found'
);

}

const admin=
result.rows[0];

const match=
await bcrypt.compare(
password,
admin.password
);

if(!match){

return res.send(
'Invalid Password'
);

}

req.session.adminId=
admin.admin_id;

res.redirect(
'/admin/dashboard'
);

}

catch(err){

console.log(err);

res.send(
'Database Error'
);

}

});


/* Dashboard */

router.get('/admin/dashboard',(req,res)=>{

res.sendFile(
view('admin-dashboard.html')
);

});


/* Create Exam Page */

router.get('/admin/create-exam',(req,res)=>{

res.sendFile(
view('create-exam.html')
);

});


/* Create Exam */

router.post('/admin/create-exam',async(req,res)=>{

try{

const{
exam_name,
subject,
duration,
total_marks
}=req.body;

await db.query(

`INSERT INTO exams
(exam_name,subject,duration,total_marks)

VALUES($1,$2,$3,$4)`,

[
exam_name,
subject,
duration,
total_marks
]

);

res.redirect(
'/admin/add-question'
);

}

catch(err){

console.log(err);

res.send(
'Error creating exam'
);

}

});


/* Add Question Page */

router.get('/admin/add-question',(req,res)=>{

res.sendFile(
view('add-question.html')
);

});


/* Add Question */

router.post('/admin/add-question',async(req,res)=>{

try{

const{

exam_id,
question_text,
question_type,
option1,
option2,
option3,
option4,
correct_answer

}=req.body;

await db.query(

`INSERT INTO questions
(exam_id,
question_text,
question_type,
option1,
option2,
option3,
option4,
correct_answer)

VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,

[
exam_id,
question_text,
question_type,
option1,
option2,
option3,
option4,
correct_answer
]

);

res.redirect(
'/admin/dashboard'
);

}

catch(err){

console.log(err);

res.send(
'Error Adding Question'
);

}

});


/* Delete Exam Page */

router.get('/admin/delete-exam',(req,res)=>{

res.sendFile(
view('delete-exam.html')
);

});


/* Exam Data */

router.get('/admin/delete-exam/data',async(req,res)=>{

try{

const result=
await db.query(

'SELECT exam_id,exam_name FROM exams'

);

res.json(
result.rows
);

}

catch(err){

console.log(err);

res.json([]);

}

});


/* Delete Exam */

router.post('/admin/delete-exam/:id',async(req,res)=>{

try{

await db.query(

'DELETE FROM exams WHERE exam_id=$1',

[req.params.id]

);

res.json({
success:true
});

}

catch(err){

console.log(err);

res.json({
success:false
});

}

});


/* Results Page */

router.get('/admin/results',(req,res)=>{

res.sendFile(
view('admin-results.html')
);

});


/* Results Data */

router.get('/admin/results/data',async(req,res)=>{

try{

const result=
await db.query(

`SELECT
students.name,
exams.exam_name,
results.score,
results.submitted_at

FROM results

JOIN students
ON students.student_id=
results.student_id

JOIN exams
ON exams.exam_id=
results.exam_id`

);

res.json(
result.rows
);

}

catch(err){

console.log(err);

res.json([]);

}

});


/* Logout */

router.get('/admin/logout',(req,res)=>{

req.session.destroy(()=>{

res.redirect('/');

});

});

module.exports=router;