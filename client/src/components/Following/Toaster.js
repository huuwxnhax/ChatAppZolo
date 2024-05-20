import React from 'react'
import { useState } from 'react';
import { Alert, IconButton, Snackbar } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';


const Toaster = ({ msg }) => {
    const [open, setOpen] = useState(true);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

  return (
    <div>
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            message={msg}
            variant="warning"
            ContentProps={{
                "aria-describedby": "message-id"
            }}
            action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }
        >
            <Alert onClose={handleClose} severity="warning" sx={{width: '30vw'}}>
                {msg}
            </Alert>
        </Snackbar>
    </div>
  )
}

export default Toaster