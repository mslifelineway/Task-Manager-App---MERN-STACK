//init code
const router = require('express').Router();
const TaskModel = require('../models/task.model');

/**
 * URL: /lists/tasks
 * FIND ALL THE TASKS  
 */
router.get('/tasks', (req, res) => {
    TaskModel.find().then((tasks) => {
       return res.json({
            status: true,
            result: tasks,
            message: 'Tasks found!',
        });
    }).catch((e) => {
       return res.json({
            status: false,
            result: e,
            message: 'Error while fetching data from database!',
        });
    });
});

/**URL: /list/:listId/tasks
 * FIND ALL THE TASKS OF A LIST 
 * Required: listId
 */
router.get('/:listId/tasks', (req, res) => {
    console.log(req.params.listId);
    TaskModel.find({_listId: req.params.listId}).then((tasks) => {
       return res.json({
            status: true,
            result: tasks,
            message: 'Tasks found!',
        });
    }).catch((e) => {
       return res.json({
            status: false,
            result: e,
            message: 'Error while fetching data from database!',
        });
    });
});

/**URL: /list/:listId/tasks 
 * POST - METHOD
 * Add a Task to the database
 * required: listId, task title
 */
router.post('/:listId/tasks', (req, res) => {
    let newTask = new TaskModel({title: req.body.title, _listId: req.params.listId});
    newTask.save().then((taskData) => {
        return res.json({
            status: true,
            result: taskData,
            message: 'Task has been added successfully!',
        })
    }).catch((e) => {
        return res.json({
            status: false,
            result: e,
            message: 'Error while adding a task to the database!',
        });
    });
});

/**URL: /tasks/:taskId
 * FIND TASK BY ID
 * Required: taskId
 */
router.get('/:taskId', (req, res) => {
    TaskModel.find({_id: req.params.taskId}).then((taskData) => {
       return res.json({
            status: true,
            result: taskData,
            message: 'Tasks found!',
        });
    }).catch((e) => {
       return res.json({
            status: false,
            result: e,
            message: 'Error while fetching data from database!',
        });
    });
});

/** URL: /tasks/:taskId
 * Method PATCH
 * UPDATE A TASK BY ID
 * required:  task object which contains taskId,
 * if any document does not find then it returns status: true, but result: null,
 * but if document found and updated then returns status: true, but result: previous data not the new data
 */
router.patch('/', (req, res) => {
    TaskModel.findOneAndUpdate({_id: req.body.task._id}, {$set: req.body.task}).then((taskData) => {
        if(taskData == null) {
            return res.json({
                status: true,
                result: taskData,
                message: "Task couldn't find to update!",
            })
        }
        return res.json({
            status: true,
            result: taskData,
            message: 'Task has been updated successfully!',
        });
    }).catch((e) => {
        return res.json({
            status: false,
            result: e,
            message: 'Error while updating a task in the database!',
        });
    });
});

/** URL: /list/:listId/task/:taskId  
 * METHOD - DELETE
 *  Deleting data from database, and also delete all the corresponding tasks from the task model
 * required: taskId, listId
 * 
 */
router.delete('/:taskId', (req, res) => {
    TaskModel.findOneAndRemove({_id: req.params.taskId}).then((removedTask) => {
        if(removedTask == null) {
            return res.json({
                status: true,
                result: removedTask,
                message: "Task does not exists in the database!",
            });
        }
        return res.json({
            status: true,
            result: removedTask,
            message: 'Task has been deleted successfully!',
        });
    }).catch((e) => {
        return res.json({
            status: false,
            result: e,
            message: 'Error while deleting a task from database!',
        });
    });
});




//exports the router
module.exports = router;