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


/* Results Page */

router.get(
'/student/results',
(req,res)=>{

res.sendFile(
view('results.html')
);

});


/* Results Data */

router.get(
'/student/results/data',
(req,res)=>{

db.query(

`SELECT
exam_id,
score,
submitted_at
FROM results
WHERE student_id=?`,

[req.session.studentId],

(err,result)=>{

res.json(
err?[]:result
);

});

});


/* Study Plan Page */

router.get(
'/student/study-plan',
(req,res)=>{

res.sendFile(
view(
'study-plan.html'
));

});


/* Study Plan Data */

router.get(
'/student/study-plan/data',
(req,res)=>{

db.query(

'SELECT AVG(score) AS average FROM results WHERE student_id=$1',

[req.session.studentId],

(err,result)=>{

if(err){

return res.json({

average:0,
message:'Unable to generate study plan'

});

}

const avg=Math.round(
result[0].average||0
);

let message='';

if(avg>=80){

message=
'Excellent performance! Continue practicing regularly.';

}

else if(avg>=50){

message=
'Good performance. Revise difficult topics and solve more MCQs.';

}

else{

message=
'Needs Improvement. Study for at least 2 hours daily and focus on weak subjects.';

}

res.json({

average:avg,
message

});

});

});

module.exports=router;