const express = require('express');
// const User = require("../models/User");
const UserChat = require("../models/UserChat");
const router = express.Router();

router.get('/', async (req, res) => { // get all chats with participants of a user
	try {
		let chats = await UserChat.find({ "participants.email": req.token_data.data.email });
		if (chats) {
			let total_chat_participants = [];
			for (let i = 0; i < chats.length; i++) {
				if(chats[i].participants[0].email != req.token_data.data.email) total_chat_participants.push(chats[i].participants[0]);
				if(chats[i].participants[1].email != req.token_data.data.email) total_chat_participants.push(chats[i].participants[1]);
			}
			res.send(total_chat_participants);
		}
		else {
			res.send(JSON.stringify({ status: "failed!", action: "Chat not found!" }));
		}
	} catch (error) {
		console.log(error);
		res.send(JSON.stringify({ status: "failed!", action: `${error}` }));
	}
});

router.post('/get', async (req, res) => { // get a chat with a participant
	const participants = [req.token_data.data.email, req.body.participant];
	try {
		let chats = await UserChat.findOne({"participants.email": { $all: participants } });
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


router.post('/', async (req, res) => { // create a new chat or add a message to an existing chat
	const participants = [req.token_data.data.email, req.body.participant.email];
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
				{ new: true }
			);
			res.send(result);
		}
		else {
			const newUserChat = new UserChat({
				participants: [
					{ username: req.token_data.data.username, email: participants[0] },
					{ username: req.body.participant.username, email: participants[1] }
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