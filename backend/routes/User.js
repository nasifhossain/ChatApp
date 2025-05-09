const express = require('express');
const router = express.Router();
const User = require('../schema/User');
const mongoose = require('mongoose');   
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
router.get('/',(req,res,next)=>{
   User.find().then(result=>{
    // console.log(result);
    res.status(200).json({message:'Users fetched successfully',users:result.map(user=>{
      return {
        _id:user._id,
        name:user.name,
        image:user.image,
        bio:user.bio
      }
    })});
   }).catch(err=>{
    res.status(500).json({message:'Internal server error',error:err});
   });
});



router.get('/details',async(req,res,next)=>{
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token,JWT_SECRET);
        const userId = decoded.userId;
        const user = await User.findById(userId);
        if(!user){
          console.log('User not found');
            return res.status(404).json({message:'User not found'});
        }
        res.status(200).json({message:'User details fetched successfully',user:user});
    }catch(error){
        console.log('error in fetching details');
        res.status(500).json({message:'Error in fetching details',error:error});
    }
});
router.get('/:username', async (req, res, next) => {
  const username = req.params.username;

  try {
    const users = await User.find({
      username: { $regex: '^' + username, $options: 'i' }  // Case-insensitive match from beginning
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    const userDetails = users.map(user => ({
      _id: user._id,
      name: user.name,
      username: user.username,
      image: user.image,
      bio: user.bio
    }));

    res.status(200).json({ message: 'Users fetched successfully', userDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/signup', async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if(req.body.username){
      const existingUsername = await User.findOne({ username: req.body.username });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const defaultImageUrl = `${req.protocol}://${req.get('host')}/avatar_icon.png`;

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      date: req.body.date,
      password: hashedPassword,
      phone: req.body.phone,
      email: req.body.email,
      image: defaultImageUrl, 
      name: req.body.name,
      gender: req.body.gender,
      bio:'Hey There! I am using Tinder',
      username: req.body.username
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user: user });
  } catch (error) {
    res.status(500).json({ message: 'Error in signup', error: error });
  }
});


router.post('/login',async(req,res,next)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(401).json({message:'User not registered'});
        }
        const checkPassword = await bcrypt.compare(req.body.password,user.password);
        if(!checkPassword){
            return res.status(401).json({message:'Invalid password'});
        }
       const token = jwt.sign({email:user.email,userId:user._id},JWT_SECRET,{expiresIn:'24h'});
       console.log(token);
       res.status(200).json({message:'Login successful',email:user.email,token:token,_id:user._id});
    }catch(error){
        res.status(500).json({message:'Error in login',error:error});
    }
});



router.put('/update', async (req, res) => {
  const {name, bio, image,username } = req.body;
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Decode token and extract _id
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    if (!userId) {
      return res.status(400).json({ message: 'Invalid token: Missing user ID' });
    }
    if(username){
      const existingUsername = await User.findOne({ username: username });
      if (existingUsername && existingUsername._id.toString() !== userId) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (bio) updatedFields.bio = bio;
    if (image) updatedFields.image = image;
    if (username) updatedFields.username = username;

    const user = await User.findByIdAndUpdate(
      userId,
      updatedFields,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    //console.log(user);
    const updatedUser = {
      _id:user._id,
      name:user.name,
      image:user.image,
      bio:user.bio,
      username:user.username
    }
    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    console.error('Update Error:', error);
    return res.status(500).json({ message: 'Error updating user', error });
  }
});

  
module.exports = router;
