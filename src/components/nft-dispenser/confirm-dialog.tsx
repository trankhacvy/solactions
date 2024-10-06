"use client";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Stack,
  Typography,
  DialogActions,
} from "@mui/material";
import { CircleCheckIcon } from "lucide-react";

type ProcessDialogProps = {
  open: boolean;
  onClose: VoidFunction;
};

export default function CreateDispenserConfirmDialog({
  open,
  onClose,
}: ProcessDialogProps): JSX.Element {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Review</DialogTitle>
      <DialogContent>
        <Stack width="100%" gap={3}>
          <Stack direction="row">
            <Typography flex={1} variant="body2" color="text.secondary">
              Num of NFT
            </Typography>
            <Typography
              variant="subtitle2"
              component="span"
              fontWeight="fontWeightSemiBold"
            >
              100
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography flex={1} variant="subtitle1" color="text.primary">
              Total
            </Typography>
            <Typography variant="subtitle1" component="span" color="error">
              123$
            </Typography>
          </Stack>
        </Stack>
        <Stack display="none" gap={2}>
          <Stack direction="row" alignItems="center" gap={2}>
            {/* <CircularProgress sx={{ width: "40px", height: "40px" }} /> */}
            <Box
              color="success.main"
              width="40px"
              height="40px"
              component={CircleCheckIcon}
            />
            <Box flex={1}>
              <Typography variant="h6">Upload media</Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" gap={2}>
            {/* <CircularProgress sx={{ width: "40px", height: "40px" }} /> */}
            <Box
              color="success.main"
              width="40px"
              height="40px"
              component={CircleCheckIcon}
            />
            <Box flex={1}>
              <Typography variant="h6">Upload media</Typography>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button fullWidth autoFocus>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
