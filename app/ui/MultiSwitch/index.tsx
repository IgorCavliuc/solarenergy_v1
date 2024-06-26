"use client";

import React, { useEffect, useState } from "react";
import "./index.scss";

interface OptionProps {
  label: string;
  type: string;
}

interface SwitchProps {
  options: OptionProps[];
  name?: string;
  select?: any;
  onChange?: (item: OptionProps) => void;
}

export const MultiSwitch: React.FC<SwitchProps> = ({
  options,
  name,
  select,
  onChange,
}) => {
  const [selected, setSelected] = useState<string>(options[0].type);
  const [startLeft, setStartLeft] = useState(0);
  const [endLeft, setEndLeft] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const currentIndex = options.findIndex(
      (option) => option.type === selected,
    );
    setStartLeft(endLeft);
    setEndLeft(currentIndex * (100 / options.length));
    setIsAnimating(true);
  }, [selected, endLeft, options]);

  const handleSwitch = (option: OptionProps) => {
    setSelected(option.type);
    if (onChange) {
      onChange(option);
    }
  };

  const indicatorStyle = {
    left: `${startLeft}%`,
    width: `${100 / options.length}%`,
    transform: `translateX(${endLeft - startLeft}%)`,
    transition: "transform 1s ease-in-out",
  };

  return (
    <div className="switch-container">
      {options.map((option, index) => (
        <div
          key={option.type}
          className={`switch-option ${selected === option.type ? "selected" : ""}`}
          onClick={() => handleSwitch(option)}
        >
          {option.label}
        </div>
      ))}
      <div
        className={`switch-indicator ${isAnimating ? "animating" : ""}`}
        style={indicatorStyle}
        onTransitionEnd={() => setIsAnimating(false)}
      />
    </div>
  );
};
