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

router.post('/admin/login',(req,res)=>{

const{
username,
password
}=req.body;

db.query(

'SELECT * FROM admin WHERE username=?',

[username],

async(err,result)=>{

if(err){

console.log(err);

return res.send(
'Database Error'
);

}

if(result.length===0){

return res.send(
'Admin Not Found'
);

}

const admin=
result[0];

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

});

});


/* Admin Dashboard */

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


/* Save Exam */

router.post(
'/admin/create-exam',
(req,res)=>{

const{
exam_name,
subject,
duration,
total_marks
}=req.body;

db.query(

`INSERT INTO exams
(exam_name,subject,duration,total_marks)
VALUES(?,?,?,?)`,

[
exam_name,
subject,
duration,
total_marks
],

(err)=>{

if(err){

console.log(err);

return res.send(
'Error creating exam'
);

}

res.redirect(
'/admin/add-question'
);

});

});


/* Add Question Page */

router.get(
'/admin/add-question',
(req,res)=>{

res.sendFile(
view(
'add-question.html'
));

});


/* Save Question */

router.post(
'/admin/add-question',
(req,res)=>{

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

db.query(

`INSERT INTO questions
(exam_id,question_text,
question_type,
option1,option2,
option3,option4,
correct_answer)

VALUES(?,?,?,?,?,?,?,?)`,

[
exam_id,
question_text,
question_type,
option1,
option2,
option3,
option4,
correct_answer
],

(err)=>{

if(err){

console.log(err);

return res.send(
'Error Adding Question'
);

}

res.redirect(
'/admin/dashboard'
);

});

});


/* Delete Exam Page */

router.get(
'/admin/delete-exam',
(req,res)=>{

res.sendFile(
view(
'delete-exam.html'
));

});


/* Exam List */

router.get(
'/admin/delete-exam/data',
(req,res)=>{

db.query(

'SELECT exam_id,exam_name FROM exams',

(err,result)=>{

if(err){

console.log(err);

return res.json([]);

}

res.json(result);

});

});


/* Delete Exam */

router.post(
'/admin/delete-exam/:id',
(req,res)=>{

db.query(

'DELETE FROM exams WHERE exam_id=?',

[req.params.id],

(err)=>{

if(err){

console.log(err);

return res.json({
success:false
});

}

res.json({
success:true
});

});

});


/* Student Results Page */

router.get(
'/admin/results',
(req,res)=>{

res.sendFile(
view(
'admin-results.html'
));

});


/* Student Results Data */

router.get(
'/admin/results/data',
(req,res)=>{

db.query(

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
results.exam_id`,

(err,result)=>{

if(err){

console.log(err);

return res.json([]);

}

res.json(result);

});

});


/* Admin Logout */

router.get(
'/admin/logout',
(req,res)=>{

req.session.destroy(()=>{

res.redirect('/');

});

});

module.exports=router;