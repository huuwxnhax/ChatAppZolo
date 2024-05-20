import ChatModel from "../models/chatModel.js";
import UserModel from "../models/userModel.js";

export const createChat = async (req, res) => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};


export const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
};

export const findChatsByUserFullNameBody = async (req, res) => {
  try {
    const { firstname, lastname, userId } = req.body;
    // Tìm kiếm người dùng từ firstname và lastname
    const users = await UserModel.find({
      firstname: firstname,
      lastname: lastname
    });
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Lấy danh sách ID của người dùng từ kết quả tìm kiếm
    const findId = users.map(user => user._id);

    // Tìm kiếm các đoạn trò chuyện mà có ít nhất một thành viên là tài khoản đăng nhập và một thành viên là người dùng tìm thấy
    const chats = await ChatModel.find({
      $nor: [
        { members: { $nin: [userId, ...findId] } }, // Trường hợp bình thường
        { members: { $nin: [...findId, userId] } } // Trường hợp members bị đảo ngược
      ]
    });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error finding chats by user full name", error: error });
  }
};


