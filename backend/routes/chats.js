const express = require('express');
// const User = require("../models/User");
const UserChat = require("../models/UserChat");
const router = express.Router();

router.post('/getmessages', async (req, res) => {
	const participants = [req.token_data.data.email, req.body.participant];
	try {
		let chats = await UserChat.findOne({ "participants.email": { $all: participants } });
		if (chats) {
			res.send(chats);
		}
		else {
			res.send(JSON.stringify({ status: "failed!", action: "Chat not found!" }));
		}
	} catch (error) {
		console.log(error);
		res.send(JSON.stringify({ status: "failed!", action: `${error}` }));
	}
});


router.post('/', async (req, res) => {
	const participants = [req.token_data.data.email, req.body.participant];
	const msg = req.body.message;

	if (participants[0] != req.body.message.sender && participants[0] != req.body.message.receiver) return res.send(JSON.stringify({ status: "failed!", action: "Participants do not match with message content." }));
	if (participants[1] != req.body.message.sender && participants[1] != req.body.message.receiver) return res.send(JSON.stringify({ status: "failed!", action: "Participants do not match with message content." }));

	try {
		const newMsg = {
			sender: msg.sender,
			receiver: msg.receiver,
			content: msg.content
		};
		let chats = await UserChat.findOne({ "participants.email": { $all: participants } });
		if (chats) {
			const result = await UserChat.findByIdAndUpdate(
				chats._id,
				{
					$push: {
						messages: {
							$each: [newMsg],
							$position: 0
						}
					}
				},
				{ new: true } // This option returns the updated document
			);
			res.send(result);
		}
		else {
			const newUserChat = new UserChat({
				participants: [
					{ email: participants[0] },
					{ email: participants[1] }
				],
				messages: newMsg
			});
			await newUserChat.save();
			res.send(newUserChat);
		}
	} catch (error) {
		console.log(error);
		res.send(JSON.stringify({ status: "failed!", action: `${error}` }));
	}
});


module.exports = router;