var tracksModel = require('../model/tracks.model');
var arrayMove = require('array-move');
var _ = require('lodash');
var async = require('async');
var tracksController = {};

tracksController.getAll = (req, res)=>{
	tracksModel
	.find({})
	.sort({"index" : 1})
	.exec((err, tracksMediums)=>{
		if (err) res.status(500).send(err);
		else if(tracksMediums) res.status(200).send(tracksMediums);
		else res.status(404).send("Not Found");
	})
}

tracksController.addtracks = (req, res)=>{
	tracksModel
	.count({})
	.exec((err, count)=>{
		if(err) res.status(500).send(err);
		console.log(count);
		var track = new tracksModel(req.body);
		track['index'] = count;
		track
		.save((error, tracksMediums)=>{
			if (error) res.status(500).send(error);
			else if(tracksMediums) res.status(200).send(tracksMediums);
			else res.status(404).send("Not Created");
		})
	})
}

tracksController.updateTrack = (req, res)=>{
	tracksModel
	.findOneAndUpdate({_id: req.params.trackId}, { $set: req.body }, { upsert: true, new: true })
	.exec((err, tracksMediums)=>{
		if (err) res.status(500).send(err);
		else if(tracksMediums) res.status(200).send(tracksMediums);
		else res.status(404).send("Not Found");
	})
}

tracksController.updatetracksIndex = (req, res)=>{
	console.log(req.body);
	tracksModel
	.find({})
	.sort({"index" : 1})
	.exec((err, tracks)=>{
		console.log(err, tracks)
		if (err) res.status(500).send(err);
		tracks = arrayMove(tracks, req.body.pIndex, req.body.cIndex);
		console.log(tracks);
		async.forEachOf(tracks, (value, index, callback)=> {
			console.log(value.title,"=================>", index)
			tracksModel
			.updateOne({_id: value._id}, { $set: { index: index } })
			.exec((error, updatedTracks)=>{
				// if (error) res.status(500).send(error);
				console.log(error, updatedTracks);
				callback();
			})
		});
		res.status(200).send({msg:"updated"});
	})
}

tracksController.deletetracks = (req, res)=>{
	tracksModel
	.findOneAndDelete({ _id: req.params.trackId })
	.exec((err, tracksMediums)=>{
		if (err) res.status(500).send(err);
		else if(tracksMediums) res.status(200).send(tracksMediums);
		else res.status(404).send("Not Found");
	})
}

module.exports = tracksController;