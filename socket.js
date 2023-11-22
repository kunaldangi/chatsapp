const UserChat = require("./models/UserChat");
const User = require("./models/User");

const connectedUsers = {};

const setupSocketConnection = (io) => {
    io.on('connection', async (socket) => {
        console.log(`${socket.token_data.data.username} user connected`);
        connectedUsers[socket.token_data.data.email] = socket;
    
        await UserChat.updateMany(
            { "participants.email": socket.token_data.data.email },
            { $set: { "participants.$[elem].isOnline": true } },
            { arrayFilters: [{ "elem.email": socket.token_data.data.email }] }
        );
    
        let chats = await UserChat.find({ "participants.email": socket.token_data.data.email });
        if(chats){
            for(let i = 0; i < chats.length; i++){
                if(socket.token_data.data.email !== chats[i].participants[0].email && connectedUsers[chats[i].participants[0].email]){
                    connectedUsers[chats[i].participants[0].email].emit('userOnline', {email: socket.token_data.data.email});
                }
                if(socket.token_data.data.email !== chats[i].participants[1].email && connectedUsers[chats[i].participants[1].email]){
                    connectedUsers[chats[i].participants[1].email].emit('userOnline', {email: socket.token_data.data.email});
                }
            }
        }
    
        socket.on('disconnect', async () => {
            console.log(`${socket.token_data.data.username} disconnected`);
    
            await UserChat.updateMany(
                { "participants.email": socket.token_data.data.email },
                { $set: { "participants.$[elem].isOnline": false } },
                { arrayFilters: [{ "elem.email": socket.token_data.data.email }] }
            );
    
            let chats = await UserChat.find({ "participants.email": socket.token_data.data.email });
            if(chats){
                for(let i = 0; i < chats.length; i++){
                    if(socket.token_data.data.email !== chats[i].participants[0].email && connectedUsers[chats[i].participants[0].email]){
                        connectedUsers[chats[i].participants[0].email].emit('userOffline', {email: socket.token_data.data.email});
                    }
                    if(socket.token_data.data.email !== chats[i].participants[1].email && connectedUsers[chats[i].participants[1].email]){
                        connectedUsers[chats[i].participants[1].email].emit('userOffline', {email: socket.token_data.data.email});
                    }
                }
            }
            
            delete connectedUsers[socket.token_data.data.email];
        });
    
        socket.on('chatMsg', async (data) => {
            let msgData = JSON.parse(data);
    
            let sender = socket.token_data.data.email;
            let receiver = msgData.participant.email;
            const participants = [sender, receiver];
            const msg = msgData.message;
    
            if (participants[0] != msgData.message.sender && participants[0] != msgData.message.receiver) return socket.emit('chatMsgError', JSON.stringify({ status: "failed!", action: "Participants do not match with message content." }));
            if (participants[1] != msgData.message.sender && participants[1] != msgData.message.receiver) return socket.emit('chatMsgError', JSON.stringify({ status: "failed!", action: "Participants do not match with message content." }));
    
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
                    if(connectedUsers[msgData.participant.email]){
                        connectedUsers[msgData.participant.email].emit('chatMsgRec', result);
                    }
                    await chats.save();
    
                    let unreadMsgs = await UserChat.aggregate([
                        {$match: {"_id": chats._id}},
                        {$unwind: "$messages"},
                        {$match: {"messages.isRead": false,"messages.receiver": receiver}},
                        {$group: {_id: null, count: { $sum: 1 }}},
                        {$project: {_id: 0}}
                    ]);
                    console.log(unreadMsgs[0].count);
    
                    socket.emit('chatMsgSent', result);
                }
                else {
                    console.log(socket.token_data.data.username);
                    const userContact = await User.findOne({email: msgData.participant.email});
                    if(userContact){
                        console.log(msgData);
                        const newUserChat = new UserChat({
                            participants: [
                                { username: socket.token_data.data.username, email: participants[0], unreadMsgs: 1},
                                { username: userContact.username, email: participants[1], }
                            ],
                            messages: newMsg
                        });
                        await newUserChat.save();

                        if(connectedUsers[msgData.participant.email]){
                            connectedUsers[msgData.participant.email].emit('chatMsgRec', newUserChat);
                        }
                        socket.emit('chatMsgSent', newUserChat);
                    }
                }
            } catch (error) {
                console.log(error);
                socket.emit('chatMsgError', JSON.stringify({ status: "failed!", action: `${error}` }));
            }
        });
    
        socket.on('msgRead', async (data) => {
            let msgData = JSON.parse(data);
            const get = await UserChat.findOne({ 
                $and: [
                    { 'participants.email': msgData.messages.sender },
                    { 'participants.email': msgData.messages.receiver },
                    { 'messages._id': msgData.messages._id }
                ]
            });
            get.messages[msgData.msgId].isRead = true;
            msgData.messages.isRead = true;
    
            
            let unreadMsgs = await UserChat.aggregate([
                {$match: {"_id": "651ef921b166842816b3acb2"}},
                {$unwind: "$messages"},
                {$match: {"messages.isRead": true,"messages.receiver": "arya250611@gmail.com"}},
                {$group: {_id: null,countOfReadMessages: { $sum: 1 }}},
                {$project: {_id: 0}}
            ]);
            console.log(unreadMsgs);
            
    
            socket.emit('remainUnreadMsgs', {email: msgData.messages.sender, unreadMsgs: get.participants[0].unreadMsgs});
            
            await get.save();
            
            if(connectedUsers[msgData.messages.sender]){
                connectedUsers[msgData.messages.sender].emit('msgReadRec', msgData);
            }
        });
    });
}

module.exports = {connectedUsers, setupSocketConnection};