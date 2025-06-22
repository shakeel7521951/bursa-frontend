import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const AlertDialog = ({ message, isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Sunteți sigur că doriți să ștergeți serviciul?</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Nu
        </Button>

        <Button onClick={onConfirm} color="error">
          Da
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
