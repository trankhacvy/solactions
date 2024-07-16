import { ButtonBase, Typography, alpha, useTheme } from "@mui/material";
import Link from "next/link";
import * as React from "react";

type SelectButtonItemProps = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
};

export default function SelectButtonItem({
  title,
  subtitle,
  icon,
  href,
}: SelectButtonItemProps) {
  const theme = useTheme();
  return (
    <ButtonBase
      sx={{
        textAlign: "left",
        display: "block",
        borderRadius: 2,
        padding: 2.5,
        border: `1px solid ${alpha(theme.palette.grey[500], 0.24)}`,
        "&:hover": {
          boxShadow: `rgb(33, 43, 54) 0px 0px 0px 2px`,
        },
      }}
      LinkComponent={Link}
      href={href}
    >
      {icon}
      <Typography fontWeight="fontWeightBold" mt={1} mb={0.5}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </ButtonBase>
  );
}
