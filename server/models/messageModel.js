import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
    imageUrl: {
      // Thêm trường imageUrl
      type: String,
    },
    videoUrl: {
      // Thêm trường videoUrl
      type: String,
    },
    pdfUrl: {
      // Thêm trường pdfUrl
      type: String,
    },
    docxUrl: {
      // Thêm trường docxUrl
      type: String,
    },
    hiddenFor: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Message", MessageSchema);
export default MessageModel;
