import { Divider } from "globals/mui";

export const StyledDivider = (props) => {
  return (
    <Divider
      {...props}
      sx={{
        borderColor: "rgba(7, 7, 7, 0.199)",
      }}
    />
  );
};
