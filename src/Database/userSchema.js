import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    channels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }]
});

const User = mongoose.model('User', userSchema);
export default User;