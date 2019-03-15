var salesModel = require('../model/sales.model');
var clientModel = require('../model/client.model');
communicationModel = require('../model/communication.model');
var path = require('path');
var jwt = require('jsonwebtoken');
var salesController = {};

salesController.addClient = function(req, res){
	console.log(req.body);
	
	communicationModel
	.findOne({ name: req.body.communication_medium })
	.exec((error, resp)=>{
		if(error) res.status(500).send(err);
		else if(resp){
			req.body.communication_medium = resp._id;
			var newClient = new clientModel(req.body);
			newClient.save((err, savedClient)=>{
				if(err) res.status(500).send(err);
				var uploadPath = path.join(__dirname, "../uploads/client/");
				req.file('fileUpload').upload({
					maxBytes: 50000000,
					dirname: uploadPath
				}, function(err, files){
					if (err) {
						console.log(err);
						res.status(500).send(err);
					}else{
						console.log("files==========>",files)
						for(var i=0;i<files.length;i++){
							var logo = files[i].fd.split('/uploads/').reverse()[0];
						}
						savedClient['logo'] = logo;
						clientModel.findOneAndUpdate({_id: savedClient._id}, {$set: { logo:logo }}, {upsert:true, new:true}).exec((error,client)=>{
							if (error) res.status(500).send(error);
							res.status(200).send(client);
						})
					}
				})
			})
		}else {
			var com = new communicationModel({name: req.body.communication_medium})
			com.save((error1, respo)=>{
				if(error1) res.status(500).send(err);
				else {
					req.body.communication_medium = respo._id;
					var newClient = new clientModel(req.body);
					newClient.save((err, savedClient)=>{
						if(err) res.status(500).send(err);
						var uploadPath = path.join(__dirname, "../uploads/client/");
						req.file('fileUpload').upload({
							maxBytes: 50000000,
							dirname: uploadPath
						}, function(err, files){
							if (err) {
								console.log(err);
								res.status(500).send(err);
							}else{
								console.log("files==========>",files)
								for(var i=0;i<files.length;i++){
									var logo = files[i].fd.split('/uploads/').reverse()[0];
								}
								savedClient['logo'] = logo;
								clientModel.findOneAndUpdate({_id: savedClient._id}, {$set: { logo:logo }}, {upsert:true, new:true}).exec((error,client)=>{
									if (error) res.status(500).send(error);
									res.status(200).send(client);
								})
							}
						})
					})
				}
			})
		}
	})
}

salesController.updateClientStatus = (req,res)=>{
	var clientId = req.params.clientId;
	clientModel.findOne({_id: clientId}).exec((err, client)=>{
		if (err) res.status(500).send(err);
		else if(client){
			var timelog = client.timelog;
			timelog.push({
				operation: "shifted to "+req.body.status+" from "+client.status,
				dateTime: Date.now(),
				operatedBy: req.body.operatorId
			})
			clientModel.findOneAndUpdate({_id:clientId},{$set:{status: req.body.status, timelog: timelog }},{upsert:true, new:true},function(err,Updatedclient){
				if (err) res.status(500).send(err);
				else if(Updatedclient) res.status(200).send(Updatedclient);
				else res.status(404).send("Not Found");
			})
		}
		else res.status(404).send("Not Found");
	})
}

salesController.updateClientById = (req, res)=>{
	clientModel
	.findOneAndupdate({ _id: req.params.clientId })
	.set(req.body)
	.exec((err, clients)=>{
		if (err) res.status(500).send(err);
		else if(clients) res.status(200).send(clients);
		else res.status(404).send("Not Found");
	})
}

salesController.getAllClient = (req, res)=>{
	clientModel
	.find({})
	.populate('communication_medium coordinator')
	.exec((err, clients)=>{
		if (err) res.status(500).send(err);
		else if(clients) res.status(200).send(clients);
		else res.status(404).send("Not Found");
	})
}

salesController.getClientByClientId = (req, res)=>{
	clientModel
	.find({ _id: req.params.clientId })
	.exec((err, clients)=>{
		if (err) res.status(500).send(err);
		else if(clients) res.status(200).send(clients);
		else res.status(404).send("Not Found");
	})
}

salesController.getClientByCoordinatorId = (req, res)=>{
	clientModel
	.find({ coordinator: req.params.salesId })
	.exec((err, clients)=>{
		if (err) res.status(500).send(err);
		else if(clients) res.status(200).send(clients);
		else res.status(404).send("Not Found");
	})
}

salesController.deleteClientById = (req, res)=>{
	clientModel
	.findOneAndDelete({ _id: req.params.clientId })
	.exec((err, clients)=>{
		if (err) res.status(500).send(err);
		else if(clients) res.status(200).send(clients);
		else res.status(404).send("Not Found");
	})
}

salesController.deleteClientByMultipleId = (req, res)=>{
	clientModel
	.findAndDelete({ _id: { $in: req.body.clientId } })
	.exec((err, clients)=>{
		if (err) res.status(500).send(err);
		else if(clients) res.status(200).send(clients);
		else res.status(404).send("Not Found");
	})
}

salesController.getAllUser = (req, res)=>{
	salesModel
	.find({})
	.exec((err, user)=>{
		if (err) res.status(500).send(err);
		else if(user) res.status(200).send(user);
		else res.status(404).send("Not Found");	
	})
}

salesController.addUser = function(req,res){
	console.log("req body ===>" , req.body);
	salesModel.findOne({email: req.body.email})
	.exec((err,founduser)=>{
		if (err) {
			res.status(500).send(err);
		}else if (founduser){
			res.status(400).send('user already exists! ');
		}else{
			var User = new salesModel(req.body);
			User.save((err, newUser)=>{
				if (err) {
					res.status(500).send(err);
				}
				else{

				// res.status(200).send(newUser);
				console.log("newuser",newUser);
				var uploadPath = path.join(__dirname, "../uploads/"+newUser.name+"/");
				console.log("userid===>",newUser._id);
				console.log("uploadprofile path===>",uploadPath);
				req.file('profilePhoto').upload({
					maxBytes: 50000000,
					dirname: uploadPath,
					// saveAs: function (__newFileStream, next) {
					// 	dir.files(uploadPath, function(err, files) {
					// 		if (err){
					// 			mkdir(uploadPath, 0775);
					// 			return next(undefined, __newFileStream.filename);
					// 		}else {
					// 			return next(undefined, __newFileStream.filename);
					// 		}
					// 	});
					// }
				}, function(err, files){
					if (err) {
						console.log(err);
						res.status(500).send(err);
					}else{
						console.log("files==========>",files)
						// res.status(200).send("files uploaded successfully");
						for(var i=0;i<files.length;i++){
							if(_.includes(files[i].filename, '.pdf')){
								var cv = files[i].fd.split('/')[6]+"/"+files[i].fd.split('/')[7];
							}else{
								var profile = files[i].fd.split('/')[6]+"/"+files[i].fd.split('/')[7];
							}
						}
						newUser['CV'] = cv;
						newUser['profilePhoto'] = profile;
						salesModel.findOneAndUpdate({_id: newUser._id}, {$set: {CV:cv, profilePhoto:profile }}, {upsert:true, new:true}).exec((error,user)=>{
							if (error) res.status(500).send(error);
							res.status(200).send(user);
						})
					}

				})
			}		
		});	
		}			
	})
}

salesController.logIn = function(req,res){
	// console.log("req.method" , req.method);
	if(req.method == 'POST' && req.body.email && req.body.password){
		salesModel.findOne({ email : req.body.email } )
		// .select('-password')
		.exec((err, user)=>{
			// console.log(user, err);
			if (err) {
				return res.status(500).send( { errMsg : err });
			}else if(user){
				user.comparePassword(req.body.password,(error, isMatch)=>{
					if (error){
						return res.status(403).send( { errMsg : 'User not found' });
					}else if(isMatch){
						const payload = {user};
						var token = jwt.sign(payload,'pmt');
						console.log("Token = ",token);
						return res.status(200).send({data:user,
							token: token});
					}else{
						return res.status(403).send( { errMsg : 'Password Incorrect' });	
					}
				});
			}else{
				return res.status(403).send( { errMsg : 'User not found' });
			}
		});
	}else{
		return res.status(400).send({errMsg : 'Bad Data'});
	}
}

module.exports = salesController;
