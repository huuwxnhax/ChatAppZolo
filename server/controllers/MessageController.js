import MessageModel from "../models/messageModel.js";
import multer from "multer";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";

const storage = multer.memoryStorage();

// upload image to memory storage and filter file types
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // allow file pdf, doc, docx, jpg, jpeg, png, mp4, video
    const allowedFileTypes = /jpeg|jpg|png|docx|doc|pdf|mp4/;
    const extension = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = allowedFileTypes.test(file.mimetype);
    if (extension && mimeType) {
      return cb(null, true);
    } else {
      cb("Error: Images only! (jpeg, jpg, png)");
    }
  },
});

// AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Middleware to handle file upload
const singleFileUpload = upload.single("image");

// Add Message
export const addMessage = async (req, res) => {
  // Xử lý lỗi khi upload file
  singleFileUpload(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({ error: uploadError.message });
    }

    // Lấy dữ liệu từ body của request
    const { chatId, senderId, text } = req.body;
    const hiddenFor = "";
    // Kiểm tra xem có file được gửi lên không và lưu trữ đường dẫn tương ứng
    let imageUrl, videoUrl, pdfUrl, docxUrl;
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      const uniqueFileName = `${Date.now()}_${chatId}_${senderId}${fileExtension}`;
      const fileKey = `uploads/${uniqueFileName}`;

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: req.file.buffer,
        ACL: "public-read",
      };

      try {
        await s3.send(new PutObjectCommand(uploadParams));

        // Xác định loại tệp và lưu đường dẫn tương ứng
        switch (fileExtension) {
          case ".jpeg":
          case ".jpg":
          case ".png":
            imageUrl = fileKey;
            break;
          case ".mp4":
            videoUrl = fileKey;
            break;
          case ".pdf":
            pdfUrl = fileKey;
            break;
          case ".docx":
          case ".doc":
            docxUrl = fileKey;
            break;
          default:
            // Xử lý loại tệp khác nếu cần
            break;
        }
      } catch (error) {
        console.error("Error uploading file to S3:", error);
        return res.status(500).json({ error: "Unable to upload file to S3" });
      }
    }

    // Tạo một tin nhắn mới với các trường dữ liệu
    const message = new MessageModel({
      chatId,
      senderId,
      text,
      imageUrl,
      videoUrl,
      pdfUrl,
      docxUrl,
      hiddenFor,
    });

    try {
      // Lưu tin nhắn vào cơ sở dữ liệu
      const result = await message.save();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error saving message to database:", error);
      res.status(500).json({ error: "Unable to save message to database" });
    }
  });
};

export const deleteMessageOneSide = async (req, res) => {
  const { _id } = req.params;
  const { currentUser } = req.body;
  console.log("id:", _id);
  console.log("currentUser:", currentUser);
  const result = await MessageModel.findByIdAndUpdate(
    _id,
    { hiddenFor: currentUser },
    { new: true }
  );
  console.log("Result:", result);
  res.status(200).json(result);
};

export const getHiddenMessagesForUser = async (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.body;
  try {
    const result = await MessageModel.find({ messageId, hiddenFor: userId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get Messages
export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete message
export const deleteMessage = async (req, res) => {
  const { _id } = req.params;
  console.log("id:", _id);
  try {
    const result = await MessageModel.findByIdAndDelete(_id);
    console.log("Result:", result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
