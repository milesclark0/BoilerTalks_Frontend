import { Close, Check, Edit } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "globals/mui";
import { useAuth } from "context/context";
import { User } from "globals/types";

interface ButtonProps extends IconButtonProps {
  isEditMode: boolean;
  viewedUser?: User;
}
export const CancelButton = ({ isEditMode, viewedUser, ...props }: ButtonProps) => {
  if (!isEditMode) return null;

  return (
    <IconButton onClick={props.onClick} {...props}>
      <Close />
    </IconButton>
  );
};

export const CheckButton = ({ isEditMode, viewedUser, ...props }: ButtonProps) => {
  if (!isEditMode) return null;

  return (
    <IconButton onClick={props.onClick} {...props}>
      <Check />
    </IconButton>
  );
};

export const EditButton = ({ isEditMode, viewedUser, ...props }: ButtonProps) => {
  const { user } = useAuth();
  if (viewedUser?.username !== user?.username) return null;
  if (!isEditMode) return null;
  return (
    <IconButton onClick={props.onClick} {...props}>
      <Edit />
    </IconButton>
  );
};
