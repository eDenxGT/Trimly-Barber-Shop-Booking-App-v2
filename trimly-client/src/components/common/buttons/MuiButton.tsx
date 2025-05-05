import { Button } from "@mui/material";

interface MuiButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: "yellow" | "darkblue" | "outlined" | "text";
  fullWidth?: boolean;
  className?: string;
}

const MuiButton: React.FC<MuiButtonProps> = ({
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  children,
  variant = "yellow",
  fullWidth = false,
  className = "",
}) => {
  const backgroundColors: Record<string, string> = {
    yellow: "var(--yellow)",
    darkblue: "var(--darkblue)",
    outlined: "transparent",
    text: "transparent",
  };

  const hoverColors: Record<string, string> = {
    yellow: "var(--yellow-hover)",
    darkblue: "var(--darkblue-hover)",
    outlined: "rgba(0, 0, 0, 0.08)",
    text: "rgba(0, 0, 0, 0.1)",
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      loadingPosition="center"
      loading={loading}
      variant={
        variant === "outlined" || variant === "text" ? variant : "contained"
      }
      fullWidth={fullWidth}
      sx={{
        backgroundColor: backgroundColors[variant] || "var(--yellow)",
        color:
          variant === "outlined" || variant === "text"
            ? "var(--text-color)"
            : "#fff",
        textTransform: "none",
        border:
          variant === "outlined" ? "1px solid var(--border-color)" : "none",
        "&:hover": {
          backgroundColor: hoverColors[variant] || "var(--yellow-hover)",
        },
      }}
      className={`flex items-center justify-center ${className}`}
    >
      {children}
    </Button>
  );
};

export default MuiButton;
