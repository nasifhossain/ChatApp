const express = require('express');
const router = express.Router();
const Message = require('../schema/Message');
const User = require('../schema/User');
const Conversation = require('../schema/Conversation');

router.post('/', async(req, res) => {
    try {
        const {conversationId, senderId, message,receiverId=''} = req.body;
        if(!senderId || !message) return res.status(400).json({message: 'All fields are required'});
        if(!conversationId && receiverId){
            const newConversation = new Conversation({
                members: [senderId, receiverId],
                lastMessage: message
            })
            const savedConversation = await newConversation.save();
            conversationId = savedConversation._id;
        } else if(!conversationId){
            return res.status(400).json({message: 'Conversation ID is required'});
        }
        if(conversationId){
            const conversation = await Conversation.findById(conversationId);
            conversation.lastMessage = message;
            await conversation.save();
        }
        const newMessage = new Message({conversationId, senderId, message});
        await newMessage.save();
        res.status(200).json({message: 'Message sent successfully', newMessage});

    } catch (err) {
        res.status(500).json({message: 'Error sending message', err});
    }
})

router.get('/:conversationId', async(req, res) => {
    try {
        const {conversationId} = req.params;
        if(!conversationId) return res.status(200).json([]);
        const messages = await Message.find({conversationId});
        if( messages && messages.length === 0) return res.status(200).json([]);
        const messageUserData = await Promise.all(messages.map(async(message) => {
            const user = await User.findById(message.senderId);
            if(!user) return null;
            return {
                message: message.message,
                sender: {
                    _id: user._id,
                    name: user.name,
                    image: user.image,
                    bio: user.bio
                }
            }
        }))
        res.status(200).json({message: 'Messages fetched successfully', messageUserData});
    } catch (err) {
        res.status(500).json({message: 'Error fetching messages', err});
    }
})





module.exports = router;
