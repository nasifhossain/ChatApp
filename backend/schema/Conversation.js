const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members: {
        type: Array,
    },
    lastMessage: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model("Conversation", conversationSchema);
