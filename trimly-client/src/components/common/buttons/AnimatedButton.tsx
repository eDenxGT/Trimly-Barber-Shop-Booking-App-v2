import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

interface AnimatedButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: "yellow" | "darkblue" | "outlined" | "text";
  fullWidth?: boolean;
  className?: string;
}

const MuiAnimatedButton: React.FC<AnimatedButtonProps> = ({
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  children,
  variant = "yellow",
  fullWidth = false,
  className = "",
}) => {
  // Define colors based on variant
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

  const textColors: Record<string, string> = {
    yellow: "#fff",
    darkblue: "#fff",
    outlined: "var(--darkblue)",
    text: "var(--darkblue)",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-2 border-[1px] font-medium cursor-pointer transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      style={{
        backgroundColor: backgroundColors[variant] || "var(--yellow)",
        color: textColors[variant] || "#fff",
        borderColor: variant === "outlined" ? "var(--darkblue)" : "transparent",
        borderRadius: "8px",
      }}
      whileHover={{
        backgroundColor: hoverColors[variant] || "var(--yellow-hover)",
        borderColor: variant === "outlined" ? "var(--darkblue-hover)" : "transparent",
        borderRadius: "999px",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </motion.button>
  );
};

export default MuiAnimatedButton;
