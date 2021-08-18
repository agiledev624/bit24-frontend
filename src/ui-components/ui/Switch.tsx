import React, { useCallback } from "react";

interface SwitchProps {
  isActive: boolean;
  onChange: (isChecked: boolean) => void;
}

const Switch = ({ isActive, onChange }: SwitchProps) => {
  const handler = useCallback(
    (e: React.ChangeEvent) => {
      onChange(!isActive);
    },
    [isActive, onChange]
  );

  return (
    <label className="switch">
      <input checked={isActive} onChange={handler} type="checkbox" />
      <span className="slider round"></span>
    </label>
  );
};

export default React.memo(Switch);
