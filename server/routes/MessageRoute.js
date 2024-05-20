import express from "express";
import {
  addMessage,
  deleteMessage,
  deleteMessageOneSide,
  getHiddenMessagesForUser,
  getMessages,
} from "../controllers/MessageController.js";

const router = express.Router();

router.post("/", addMessage);

router.get("/:chatId", getMessages);

router.delete("/delete/:_id", deleteMessage);

router.delete("/deleteoneside/:_id", deleteMessageOneSide);

router.get("/hidden/:messageId", getHiddenMessagesForUser);

export default router;
