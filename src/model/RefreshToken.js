import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, 
        token: {type: String, required: true  },  
        device: {type: String , default: ""  }, 
        expiresAt: {type: Date, require: true, index: { expires: 0}}
    }, 
    { timestamps: true }
)


export default mongoose.model("RefreshToken", refreshTokenSchema);