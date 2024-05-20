import React, { useState } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import "./Modal.css";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../api/UserRequests";
import { logout } from "../../actions/AuthActions";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const ChangePasswordModal = ({ modalOpened, setModalOpened }) => {
  const { user } = useSelector((state) => state.authReducer.authData);

  const dispatch = useDispatch();
  const [isError, setIsError] = useState(true);
  const [successModalOpened, setSuccessModalOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const theme = useMantineTheme();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(true);
    if (newPassword === confirmPassword) {
      setIsError(true);
      try {
        const data = {
          username: user.username,
          currentPassword: currentPassword,
          newPassword: newPassword,
        };
        await changePassword(data);
        // dispatch(logout());
        setModalOpened(false);
        setSuccessModalOpened(true);
      } catch (error) {
        setIsError(false);
        setErrorMessage("Invalid Password");
      }
    } else {
      setIsError(false);
      setErrorMessage("New password and confirm password do not match");
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalOpened(false); // Đóng modal thông báo thành công
    dispatch(logout()); // Đăng xuất người dùng
  };

  return (
    <>
      <Modal
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        size="40%"
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      >
        <div className="modal">
          <div className="modal__header">
            <h2>Change Password</h2>
          </div>
          <div className="modal__body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <TextField
                  className="textfield"
                  fullWidth
                  required
                  type={showPassword ? "text" : "password"}
                  id="currentPassword"
                  label="Current Password"
                  variant="outlined"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    console.log(currentPassword);
                  }}
                  InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="form-group">
                <TextField
                  className="textfield"
                  fullWidth
                  required
                  id="newPassword"
                  label="New Password"
                  variant="outlined"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    console.log(newPassword);
                  }}
                />
              </div>
              <div className="form-group">
                <TextField
                  className="textfield"
                  fullWidth
                  required
                  id="confirmPassword"
                  label="Confirm Password"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    console.log(confirmPassword);
                  }}
                />
              </div>
              <div className="form-group">
                <Button variant="contained" color="primary" type="submit">
                  Change Password
                </Button>
              </div>
              {!isError && <div className="error-message">{errorMessage}</div>}
            </form>
          </div>
        </div>
      </Modal>
      <Modal
        opened={successModalOpened} // Hiển thị modal thông báo thành công
        onClose={handleSuccessModalClose} // Xử lý khi đóng modal
      >
        <div className="success-modal">
          <h2>Password Changed Successfully</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSuccessModalClose}
          >
            Login Again
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
