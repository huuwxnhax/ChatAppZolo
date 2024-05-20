import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
    {
        name: {
                type: String,
        },
        creator: {
            type: String,
        },
        members: {
            type: Array,
        },
    },
    {
        timestamps: true,
    }
);

const GroupModel = mongoose.model("Group", GroupSchema);
export default GroupModel;