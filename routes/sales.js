var express = require('express');
var router = express.Router();
var sales = require('../controller/sales.controller');
var communication = require('../controller/communication.controller');
var comment = require('../controller/comment.controller');


/* user */
router.post('/user/signup',sales.addUser);
router.post('/user/login',sales.logIn);
router.get('/user/all', sales.getAllUser);

/* sales */
router.post('/client/add', sales.addClient);
router.put('/client/update-status/:clientId', sales.updateClientStatus);
router.put('/client/update/:clientId', sales.updateClientById);
router.get('/client/all', sales.getAllClient);
router.get('/client/:clientId', sales.getClientByClientId);
router.get('/client/get-by-coordinator', sales.getClientByCoordinatorId);
router.delete('/client/:clientId', sales.deleteClientById);
router.delete('/client/multiple', sales.deleteClientByMultipleId);

/* communication */
router.post('/communication/add', communication.addCommunication);
router.put('/communication/verify', communication.verifyCommunication);
router.get('/communication/all', communication.getAll);
router.get('/communication/all/verified', communication.getAllVerified);
router.get('/communication/all/un-verified', communication.getAllUnVerified);
router.delete('/communication/delete', communication.deleteCommunication);


/* comments */
router.post('/comment/add-comment',comment.addComment);
router.get('/comment/all/:clientId',comment.getAllComment);
router.get('/comment/salesId',comment.getCommentByUserId);
router.get('/comment/:id',comment.getCommentByCommentId);
router.delete('/comment/:id',comment.deleteCommentByUserId);
router.put('/comment/:id',comment.updateCommentByCommentId);

module.exports = router;
