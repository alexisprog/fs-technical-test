import React from "react";

interface TabPanelProps {
  id: string;
  isActive: boolean;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  id,
  isActive,
  children,
}) => {
  if (!isActive) return null;

  return (
    <div
      id={`${id}-panel`}
      className="tab-panel"
      role="tabpanel"
      aria-labelledby={id}
    >
      {children}
    </div>
  );
};
