import React, { useEffect, useState } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import "./ProfileModal.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { uploadImage } from "../../actions/UploadAction";
import { updateUser } from "../../actions/UserAction";

const ProfileModal = ({ modalOpened, setModalOpened, data }) => {
  const theme = useMantineTheme();
  const { password, ...other } = data;
  const [formData, setFormData] = useState(other);
  const [profileImage, setProfileImage] = useState(null);
  const dispatch = useDispatch();
  const param = useParams();

  const { user } = useSelector((state) => state.authReducer.authData);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      if (event.target.name === "profileImage") {
        setProfileImage(img);
        console.log(img);
      }
    }
  };

  // form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let UserData = formData;
    if (profileImage) {
      const data = new FormData();
      const fileName = Date.now() + profileImage.name;
      data.append("name", fileName);
      data.append("file", profileImage);
      UserData.profilePicture = fileName;
      try {
        const response = await dispatch(uploadImage(data));
        UserData.profilePicture = response.fileUrl;
        console.log(response.fileUrl);
      } catch (err) {
        console.log(err);
      }
    }
    dispatch(updateUser(user._id, UserData));
    setModalOpened(false);
  };

  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <form className="inforForm" onSubmit={handleSubmit}>
        <div className="backgroundImage-section">
          <img
            src={
              formData.profilePicture
                ? formData.profilePicture
                : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"
            }
            alt="Profile"
            className="backgroundImage-infor"
          />
          <span>
            {formData.firstname} {formData.lastname}
          </span>
        </div>
        <div className="textInfor-section">
          <div>
            <input
              value={formData.firstname}
              onChange={handleChange}
              type="text"
              placeholder="First Name"
              name="firstname"
              className="infoInput"
            />
            <input
              value={formData.lastname}
              onChange={handleChange}
              type="text"
              placeholder="Last Name"
              name="lastname"
              className="infoInput"
            />
          </div>

          <div>
            <input
              value={formData.worksAt}
              onChange={handleChange}
              type="text"
              placeholder="Works at"
              name="worksAt"
              className="infoInput"
            />
          </div>

          <div>
            <input
              value={formData.livesIn}
              onChange={handleChange}
              type="text"
              placeholder="Lives in"
              name="livesIn"
              className="infoInput"
            />
            <input
              value={formData.country}
              onChange={handleChange}
              type="text"
              placeholder="Country"
              name="country"
              className="infoInput"
            />
          </div>

          <div>
            Profile image
            <input type="file" name="profileImage" onChange={onImageChange} />
          </div>
        </div>

        <button className="button infoButton" type="submit">
          Update
        </button>
      </form>
    </Modal>
  );
};

export default ProfileModal;
