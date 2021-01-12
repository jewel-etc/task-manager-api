const express = require('express');
const auth = require('../middleware/auth.js');
require('../db/mongoose.js');

const router = new express.Router();
const Task = require('../models/task.js');

//POST & GET FOR TASKS DATABASE

router.post('/tasks', auth, async (req, res) => {

    //const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);

    } catch (e) {
        res.status(400).send(e);
    }

})

//FILTERING
// GET /tasks?completed=true


//PAGINATION
//GET /tasks?limit=2&skip=2
//(limit=2&skip=0 shows first page of 2 elements)
//(limit=2&skip=2 shows second page of 2 elements)
//(limit=2&skip=4 shows third page of 2 elements)

//SORTING

//GET /tasks?sortBy=createdAt:asc

router.get('/tasks', auth, async (req, res) => {
    const match={};
    const sort={};
    if(req.query.completed){
        match.completed=req.query.completed==='true'
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':');
        sort[parts[0]]=parts[1]==='desc'? -1: 1
    }
    try {
       
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks);

    } catch (e) {
        res.status(500).send();

    }
})


router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {

        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) return res.status(404).send();
        res.send(task);
    } catch (e) {

        res.status(500).send(e);
    }

})

router.patch('/tasks/:id', auth, async (req, res) => {

    //CHECK FOR INVALID UPDATES
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save();



        res.send(task);

    } catch (e) {
        res.status(400).send(e);
    }
})


router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);

    } catch (e) {

        res.status(500).send(e);

    }
})

module.exports = router;
