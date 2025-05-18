import React from "react";

interface TabProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const Tab: React.FC<TabProps> = ({ id, label, isActive, onClick }) => {
  return (
    <button
      id={id}
      className={`tab ${isActive ? "active" : ""}`}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${id}-panel`}
    >
      {label}
    </button>
  );
};
