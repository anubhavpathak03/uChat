import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body; 
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({error: 'All fields are Required to signup'})
        }
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        const existingUserEmail = await User.findOne({email});
        if(existingUserEmail) {
            return res.status(400).json({message: "Email Already Exist"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // enter new user data
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })

        if(newUser) {
            // as new user created, we generate jwt token
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic: newUser.profilePic,
            });
        }else {
            res.status(400).json({message: 'Invalid user data'});
        }
    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};


export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(!existingUser) {
            return res.status(400).json({message: "Invalid Credentials"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid Credentials"});
        }
        generateToken(existingUser._id, res);
        res.status(201).json({
            _id:existingUser._id,
            fullName: existingUser.fullName,
            email: existingUser.email,
            profilePic: existingUser.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt_token", "", {maxAge: 0});
        res.status(200).json({message: "Logged Out SuccessFully"})
    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({message: "Profile Pic is Required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new:true}); 

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update Profile: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}