const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
    },
    senderId: {
        type: String,
    },
    message: {
        type: String,
    },
    
});

module.exports = mongoose.model("Message", messageSchema);
