const express=require('express');
const router=express.Router();
const path=require('path');
const db=require('../db');

const view=file=>
path.join(
__dirname,
'../views',
file
);


/* ======================
   Student Exams Page
====================== */

router.get(
'/student/exams',
(req,res)=>{

res.sendFile(
view(
'student-exams.html'
));

});


/* ======================
   Fetch Exam Data
====================== */

router.get(
'/student/exams/data',
(req,res)=>{

db.query(

'SELECT exam_id,exam_name,subject,duration,total_marks FROM exams',

(err,result)=>{

if(err){

console.log(err);

return res.json([]);

}

res.json(result);

});

});


/* ======================
   Open Exam Page
====================== */

router.get(
'/exam/:examId',
(req,res)=>{

res.sendFile(
view(
'exam.html'
));

});


/* ======================
   Load Questions
====================== */

router.get(
'/exam/:examId/questions',
(req,res)=>{

db.query(

'SELECT * FROM questions WHERE exam_id=$1',

[req.params.examId],

(err,result)=>{

if(err){

console.log(err);

return res.json([]);

}

res.json(result);

});

});


/* ======================
   Submit Exam
====================== */

router.post(
'/exam/:examId/submit',
(req,res)=>{

const examId=
req.params.examId;

const studentId=
req.session.studentId;

const answers=
req.body.answers || {};


/* Check Login */

if(!studentId){

return res.json({

score:0,
error:'Student not logged in'

});

}


/* Load Questions */

db.query(

'SELECT * FROM questions WHERE exam_id=$1',

[examId],

(err,questions)=>{

if(err){

console.log(err);

return res.json({

score:0,
error:'Question loading error'

});

}

let score=0;


/* Calculate Score */

questions.forEach(question=>{

const studentAnswer=

answers[
question.question_id
];

if(

studentAnswer &&
studentAnswer===question.correct_answer

){

if(

question.question_type==="MCQ"

){

score+=2;

}
else{

score+=5;

}

}

});


/* Save Result */

db.query(

'INSERT INTO results(student_id,exam_id,score) VALUES($1,$2,$3)',

[
studentId,
examId,
score
],

(err)=>{

if(err){

console.log(err);

return res.json({

score:0,
error:'Database insert error'

});

}

res.json({

score:score

});

});

});

});


/* ======================
   Exam Duration
====================== */

router.get(
'/exam/:examId/duration',
(req,res)=>{

db.query(

'SELECT duration FROM exams WHERE exam_id=$1',

[req.params.examId],

(err,result)=>{

if(
err ||
result.length===0
){

return res.json({

duration:10

});

}

res.json({

duration:
result[0].duration

});

});

});


module.exports=router;