//init code
const router = require('express').Router();
const ListModel = require('../models/list.model');
const TaskModel = require('../models/task.model');

/**
 * FIND ALL THE LISTS
 */
router.get('/', (req, res) => {
    ListModel.find().then((lists) => {
       return res.json({
            status: true,
            result: lists,
            message: 'List found!',
        });
    }).catch((e) => {
       return res.json({
            status: false,
            result: e,
            message: 'Error while fetching data from database!',
        });
    });
});

/**
 * FIND a list by id
 */
router.get('/:listId', (req, res) => {
    console.log('list id ' + req.params.listId);
    ListModel.find({_id: req.params.listId}).then((listDoc) => {
       return res.json({
            status: true,
            result: listDoc,
            message: 'List found!',
        });
    }).catch((e) => {
       return res.json({
            status: false,
            result: e,
            message: 'Error while fetching data from database!',
        });
    });
});


/** POST - METHOD
 * Add a List to the database
 */
router.post('/', (req, res) => {
    let listTitle = req.body.title;
    let newList = new ListModel({title: listTitle});
    newList.save().then((listData) => {
        return res.json({
            status: true,
            result: listData,
            message: 'List has been added successfully!',
        })
    }).catch((e) => {
        return res.json({
            status: false,
            result: e,
            message: "Error while adding a list to the database!",
        });
    });
});

/**Method PATCH
 * UPDATE A LIST BY ID
 * required:  listId,
 * if any document does not find then it returns status: true, but result: null,
 * but if document found and updated then returns status: true, but result: previous data not the new data
 */
router.patch('/:listId', (req, res) => {
    ListModel.findOneAndUpdate({_id: req.params.listId}, {$set: req.body.list}).then((listData) => {
        if(listData == null) {
            return res.json({
                status: true,
                result: listData,
                message: "Record couldn't find to update!",
            })
        }
        return res.json({
            status: true,
            result: listData,
            message: 'List has been updated successfully!',
        });
    }).catch((e) => {
        return res.json({
            status: false,
            result: e,
            message: 'Error while updating data in the database!',
        });
    });
});

/** METHOD - DELETE
 *  Deleting data from database, and also delete all the corresponding tasks from the task model
 * required: listId
 * 
 */
router.delete('/:listId', (req, res) => {
    ListModel.findOneAndRemove({_id: req.params.listId}).then((removedList) => {
        if(removedList == null) {
            return res.json({
                status: true,
                result: removedList,
                message: "List does not exists in the database!",
            });
        }

        //check for tasks of the specified list and delete them
        TaskModel.deleteMany({_listId: req.params.listId}).then((removedTasks)=>{
            return res.json({
                status: true,
                result: removedList,
                remodedTasks: removedTasks,
                message: 'List with tasks has been deleted successfully!',
            });
        }).catch((e) => {

        });
        return res.json({
            status: true,
            result: removedList,
            message: 'List has been deleted successfully!',
        });
    }).catch((e) => {
        return res.json({
            status: false,
            result: e,
            message: 'Error while deleting data from database!',
        });
    });
});


//exports the router
module.exports = router;