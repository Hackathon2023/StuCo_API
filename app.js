const {Firestore} = require('@google-cloud/firestore');
const db = new Firestore();

const express = require('express');
const app = express();

//class:
//    department (4str) : "COMP", "MOJO"
//    level (3int): 110, 440, 111

app.get('/', function (req, res) {
    res.redirect('/classes');
})

app.get('/classes', (req, res) => {
    res.send("Hello Word!");
})


app.get('/class/:deptnum', async (req, res) => {
    let deptnum = req.params.deptnum;
    let class_id = await db.collection('classes').doc(deptnum).get();
    if(!class_id.exists){
        res.status(404).send("Class not found");
    }
    res.send({question_ids: class_id.data().question_ids}).status(200).end();;
})

app.get('/question/:id', async (req, res) => {
    let id = req.params.id;
    let question = await db.collection('questions').doc(id).get();
    if(!question.exists){
        res.status(404).send("Question not found").end();
    }
    res.send({
        body: question.data().body,
        upvote: question.data().upvote,
        downvote: question.data().downvote,
        answer_ids: question.data().answer_ids
    }).status(200).end();

})

app.get('/answer/:id', async (req, res) => {
    let id = req.params.id;
    let answer = await db.collection('answers').doc(id).get();
    if(!answer.exists){
        res.status(404).send("Answer not found").end();
    }
    res.send({
        body: answer.data().body,
        upvote: answer.data().upvote,
        downvote: answer.data().downvote
    }).status(200).end();
})

app.get('/token/:username', async (req, res) => { 
    let username = req.params.username;
    req.send(username);
})


app.get('/', (req, res) =>{
    res.send("Pong");
})

app.get('/ask/:token/:class_id/:body', async (req, res) =>{
    let token = req.params.token;
    let class_id = req.params.class_id;
    let body = req.params.body;
    let the_class = await db.collection('classes').doc(class_id).get();
    if(!the_class.exists){
        res.status(404).send("Class not found").end();
    }else{
        await db.collection('questions').add({
            creator: token,
            body: body,
            upvote: 0,
            downvote: 0,
            answer_ids: []
        });
        await db.collection('classes').doc(class_id).update({
            question_ids: db.FieldValue.arrayUnion(question_id)
        });
        req.status(201).end();
    }
    
})

app.get('/answer/:token/:question_id/:body', async (req, res) =>{
    let token = req.params.token;
    let question_id = req.params.question_id;
    let body = req.params.body;
    let the_question = await db.collection('questions').doc(question_id).get()
    if(! the_question.exists){
        res.status(404).send("Question not found").end();
    }else{
        await db.collection('answers').add({
            creator: token,
            body: body,
            upvote: 0,
            downvote: 0
        });
        await db.collection('answer_ids').doc(question_id).update({
            answer_ids: db.FieldValue.arrayUnion(answer_id)
        });
        req.status(201).end();
    }

})

app.get('/put_class/:class_id', async (req,res) => {
    let class_id = req.params.class_id;
    await db.collection("classes").doc(class_id).set({
        question_ids : []
    })
    req.status(201).end();
})


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});



module.exports = app;
