import { Close, Check, Edit } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import { useAuth } from "../../context/context";
import { User } from "../../globals/types";

interface ButtonProps extends IconButtonProps {
  isEditMode: boolean;
  viewedUser?: User;
}
export const CancelButton = ({ ...props }: ButtonProps) => {
  if (!props.isEditMode) return null;

  return (
    <IconButton onClick={props.onClick} {...props}>
      <Close />
    </IconButton>
  );
};

export const CheckButton = ({ ...props }: ButtonProps) => {
  if (!props.isEditMode) return null;

  return (
    <IconButton onClick={props.onClick} {...props}>
      <Check />
    </IconButton>
  );
};

export const EditButton = ({ ...props }: ButtonProps) => {
  const { user } = useAuth();
  if (props.viewedUser?.username !== user?.username) return null;
  if (!props.isEditMode) return null;
  return (
    <IconButton onClick={props.onClick} {...props}>
      <Edit />
    </IconButton>
  );
};
