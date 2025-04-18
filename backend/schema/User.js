    const mongoose = require('mongoose');

    const userSchema = new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        date: { type: Date, required: true },
        password: { type: String, required: true },
        phone: { type: Number, required: true },
        email: { type: String, required: true,unique:true },
        name: { type: String, required: true },
        gender: { type: String, required: true },
        image: { type: String},
        bio: { type: String},
        username: { type: String, required: true,unique:true},
    });

    module.exports = mongoose.model("User", userSchema);
