const express = require('express');
const passport = require('passport');
const Playlist = require('../models/Playlist');
const User = require('../models/User');
const Song = require('../models/Song');
const router = express.Router();

//create a playlist
router.post('/create',
passport.authenticate("jwt",{session:false}), 
async (req,res)=>{
const currentUser = req.user;
const {name,thumbnail,songs} = req.body;
const playlistData = {
    name,
    thumbnail,
    songs,
    owner:currentUser._id,
    collaboratores:[]
};
const playlist = await Playlist.create(playlistData);
return res.status(200).json(playlist);
});

//get a playlist by id
//we will get the playlist Id as a router parameter and we will return the playlist have
router.get('/get/playlist/:playlistId',
passport.authenticate("jwt",{session:false}), 
async (req,res)=>{
 const playlistId = req.params.playlistId;
 const playlist = await Playlist.findOne({_id:playlistId});
 if(!playlist) {
    return res.status(301).json({err:"Invalid Id"});
 }
 return res.status(200).json(playlist);
});

// get all playlist made by an artist
router.get('/get/artist/:artistId',
passport.authenticate("jwt",{session:false}),
async (req,res)=>{
    const artistId = req.params.artistId;
    
    const artist = await User.findOne({_id:artistId});
    if(!artistId){
        res.status(301).json({err:"Invalid Artist"});
    }

    const playlists = await Playlist.find({owner:artistId});
    return res.status(200).json({data:playlists});
});

// add a song to a playlist
router.post('/add/song',
passport.authenticate("jwt",{session:false}),
async (req,res)=>{
 const currentUser = req.user;
 const {playlistId,songId} = req.body;

 const playlist = await Playlist.findOne({_id:playlistId});
 if(!playlist) {
    return res.status(304).json({err:"Playlist doesnot exits"});
 }
 console.log(playlist);
 console.log(currentUser);
 console.log(currentUser._id);
 console.log(playlist.owner);
console.log(playlist.owner.equals(currentUser._id));
 if(
    !playlist.owner.equals(currentUser._id) && 
    !playlist.collaborators.includes(currentUser._id)
    ){
    return res.status(400).json({err:"Not Allowed"});
 }

 const song = await Song.findOne({_id:songId});
 if(!song) {
    return res.status(304).json({err:"song doesnot exits"});
 }

 playlist.songs.push(songId);
 await playlist.save();

 return res.status(200).json(playlist);

})
module.exports = router;