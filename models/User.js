const mongoose = require('mongoose');

const User = new mongoose.Schema({
    firstname: {
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    likedSongs:{
        type:String,
        default:"",
    },
    likedPlayLists:{
        type:String,
        default:"",
    },
    subscribedArtists:{
        type:String,
        default:"",
    },
});

const UserModel = mongoose.model("User",User);
module.exports = UserModel;