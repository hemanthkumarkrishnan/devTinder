const mongoose =require("mongoose")

const userSchema = new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
        minLength:5
    },
    lastName:{
        type:String,
        
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate:(value)=>{
            if(!["male","female","others"].includes(value)){
                throw new Error("gender type isn't valid")
            }
        }
    },
    skills:{
        type:[String],

    },
    about:{
        type:String,
        default:"this is me short intro"
    }
},{
    timestamps:true
})

module.exports = mongoose.model("User",userSchema);