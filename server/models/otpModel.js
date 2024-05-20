import mongoose from "mongoose"

const otpSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        },
        createAt: {
            type: Date,
            default: Date.now(),
            expires: 600
        }
    }
)

const OTPModel = mongoose.model("OTP", otpSchema)
export default OTPModel