var communicationModel = require('../model/communication.model');

var communicationController = {};

communicationController.getAll = (req, res)=>{
	communicationModel
	.find({})
	.exec((err, communicationMediums)=>{
		if (err) res.status(500).send(err);
		else if(communicationMediums) res.status(200).send(communicationMediums);
		else res.status(404).send("Not Found");
	})
}

communicationController.addCommunication = (req, res)=>{
	var communication = new communicationModel(req.body); 
	communication
	.save()
	.exec((err, communicationMediums)=>{
		if (err) res.status(500).send(err);
		else if(communicationMediums) res.status(200).send(communicationMediums);
		else res.status(404).send("Not Created");
	})
}

communicationController.getAllVerified = (req, res)=>{
	communicationModel
	.find({ verified:true })
	.exec((err, communicationMediums)=>{
		if (err) res.status(500).send(err);
		else if(communicationMediums) res.status(200).send(communicationMediums);
		else res.status(404).send("Not Found");
	})
}

communicationController.getAllUnVerified = (req, res)=>{
	communicationModel
	.find({ verified:false })
	.exec((err, communicationMediums)=>{
		if (err) res.status(500).send(err);
		else if(communicationMediums) res.status(200).send(communicationMediums);
		else res.status(404).send("Not Found");
	})
}

communicationController.verifyCommunication = (req, res)=>{
	communicationModel
	.find({ _id: req.params.comId })
	.set({ verified: true })
	.exec((err, communicationMediums)=>{
		if (err) res.status(500).send(err);
		else if(communicationMediums) res.status(200).send(communicationMediums);
		else res.status(404).send("Not Found");
	})
}

communicationController.deleteCommunication = (req, res)=>{
	communicationModel
	.findOneAndDelete({ _id: req.params.comId })
	.exec((err, communicationMediums)=>{
		if (err) res.status(500).send(err);
		else if(communicationMediums) res.status(200).send(communicationMediums);
		else res.status(404).send("Not Found");
	})
}

module.exports = communicationController;