import * as React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const Button = ({
  children,
  variant = "default",
  className = "",
  onClick,
  disabled = false,
}: ButtonProps) => {
  const base =
    "rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 p-2";
  const variantClass =
    variant === "outline"
      ? "border border-gray-300 text-black bg-white"
      : "bg-blue-600 text-white hover:bg-blue-700";
  const finalClass = `${base} ${variantClass} ${className}`;

  return (
    <button onClick={onClick} className={finalClass} disabled={disabled}>
      {children}
    </button>
  );
};
