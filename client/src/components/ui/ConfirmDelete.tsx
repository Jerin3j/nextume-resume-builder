import React from "react";

type ConfirmDeleteProps = {
  /** Title of the alert (e.g. "Delete item?" or "Are you sure?") */
  title: string;

  /** Description text below the title */
  description: string;

  /** Label for the confirm button */
  confirmLabel?: string;

  /** Label for the cancel button */
  cancelLabel?: string;

  /** Called when the confirm button is clicked */
  onConfirm: () => void;

  /** Called when the cancel button is clicked */
  onCancel: () => void;

  /** Optional color scheme: affects border and button colors */
  type?: "info" | "success" | "warning" | "danger" | "dark";
};

const colorStyles: Record<
  NonNullable<ConfirmDeleteProps["type"]>,
  {
    border: string;
    text: string;
    bg: string;
    button: string;
    buttonHover: string;
  }
> = {
  info: {
    border: "border-blue-300",
    text: "text-blue-800",
    bg: "bg-blue-50",
    button: "bg-blue-800 hover:bg-blue-900 focus:ring-blue-200",
    buttonHover: "hover:bg-blue-900",
  },
  success: {
    border: "border-green-300",
    text: "text-green-800",
    bg: "bg-green-50",
    button: "bg-green-800 hover:bg-green-900 focus:ring-green-300",
    buttonHover: "hover:bg-green-900",
  },
  warning: {
    border: "border-yellow-300",
    text: "text-yellow-800",
    bg: "bg-yellow-50",
    button: "bg-yellow-800 hover:bg-yellow-900 focus:ring-yellow-300",
    buttonHover: "hover:bg-yellow-900",
  },
  danger: {
    border: "border-red-300",
    text: "text-red-800",
    bg: "bg-red-50",
    button: "bg-red-800 hover:bg-red-900 focus:ring-red-300",
    buttonHover: "hover:bg-red-100",
  },
  dark: {
    border: "border-gray-600",
    text: "text-gray-800 dark:text-gray-300",
    bg: "bg-gray-50 dark:bg-gray-800",
    button: "bg-gray-700 hover:bg-gray-800 focus:ring-gray-300",
    buttonHover: "hover:bg-gray-800",
  },
};

export const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  type = "danger",
}) => {
  const colors = colorStyles[type];

  return (
    <div
      className={`p-4 mb-4 border rounded-lg absolute top-1 left-[50%] -translate-x-1/2 ${colors.border} ${colors.text} ${colors.bg}`}
      role="alert"
    >
      <div className="flex items-center">
        <svg
          className="shrink-0 w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="mt-2 mb-4 text-sm">{description}</div>
      <div className="flex">
        <button
          type="button"
          onClick={onConfirm}
          className={`text-white font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center focus:ring-4 focus:outline-none ${colors.button}`}
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`border font-medium rounded-lg text-xs px-3 py-1.5 text-center focus:ring-4 focus:outline-none ${colors.text} border-current bg-transparent ${colors.buttonHover}`}
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  );
};
