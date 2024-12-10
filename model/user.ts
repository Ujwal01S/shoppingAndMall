
import mongoose from "mongoose";

const roleEnum = ["admin", "user"]

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        unique:true,
    },
    email: {
        required: true,
        type: String,
        unique: true, // Ensure email is unique
    },
    password: {
        required: true,
        type: String
    },
    role:{
        type:String,
        enum:roleEnum,
        default:'user'
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
});


export const User = mongoose.models.User ?? mongoose.model("User", userSchema);
