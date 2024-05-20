import GroupModel from "../models/groupModel.js";
import UserModel from "../models/userModel.js";

export const createChatGroup = async (req, res) => {
    
    const newChatGroup = new GroupModel({
        name: req.body.name,
        creator: req.body.creator,
        members: req.body.members,
    });
    try {
      const result = await newChatGroup.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
};

export const userChatGroups = async (req, res) => {
    try {
      const chatGroup = await GroupModel.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(chatGroup);
    } catch (error) {
      res.status(500).json(error);
    }
};

export const memberGroups = async (req, res) => {
    try {
        const groupId = req.params.groupId;

        // Find the group by ID
        const group = await GroupModel.findById(groupId);

        if (!group) {
        return res.status(404).json({ message: 'Group not found' });
        }

        // Retrieve members of the group
        const members = await UserModel.find(
            { _id: { $in: group.members } },
            {password: 0, following: 0, followers: 0},
        );

        res.status(200).json(members);
    } catch (error) {
        console.error('Error fetching group members:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addMemberToGroup = async (req, res) => {
    const {groupId, memberIdToAdd, requestingUserId} = req.body;

    try {
        const group = await GroupModel.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Kiểm tra xem người thực hiện yêu cầu có phải là người tạo nhóm hay không
        // if (group.creator.toString() !== requestingUserId) {
        //     return res.status(403).json({ message: "Only creator can add members" });
        // }

        // Thêm thành viên mới vào nhóm
        group.members.push(...memberIdToAdd);
        await group.save();

        res.status(200).json({ message: "Member added successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const removeMemberFromGroup = async (req, res) => {
    const { groupId, memberIdToRemove, requestingUserId } = req.body;

    try {
        const group = await GroupModel.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Kiểm tra xem người thực hiện yêu cầu có phải là người tạo nhóm hay không
        if (group.creator.toString() !== requestingUserId) {
            return res.status(403).json({ message: "Only the creator can remove members from the group" });
        }

        // Kiểm tra xem người cần xóa có phải là người tạo nhóm không
        if (memberIdToRemove === group.creator.toString()) {
            return res.status(403).json({ message: "The creator cannot be removed from the group" });
        }

        // Xóa thành viên khỏi nhóm
        group.members = group.members.filter(member => member.toString() !== memberIdToRemove);
        await group.save();

        res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const leaveGroup = async (req, res) => {
    const { groupId, memberIdToLeave, requestingUserId } = req.body;

    try {
        const group = await GroupModel.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        
        if(memberIdToLeave === requestingUserId) {
            group.members = group.members.filter(member => member.toString() !== memberIdToLeave);
            await group.save();
            res.status(200).json({ message: "Leave group successfully" });
        } else {
            return res.status(403).json({ message: "Leave group fail" });
        }

    } catch (error) {
        res.status(500).json(error);
    }
};

export const deleteGroup = async (req, res) => {
    const { groupId, requestingUserId } = req.body;

    try {
        const group = await GroupModel.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        if(group.creator.toString() === requestingUserId) {
            await group.delete();
            res.status(200).json({ message: "Delete group successfully" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

