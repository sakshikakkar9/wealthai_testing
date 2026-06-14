import React from "react";
import Badge from "./Badge";

interface Props {
  goal: "Retirement" | "Education" | "Emergency" | "Growth" | "Dividend";
}

const GoalTag: React.FC<Props> = ({ goal }) => {
  const getGoalColor = (g: string) => {
    switch (g) {
      case "Retirement":
        return "indigo";
      case "Education":
        return "emerald";
      case "Emergency":
        return "red";
      case "Growth":
        return "amber";
      case "Dividend":
        return "blue";
      default:
        return "slate";
    }
  };

  return (
    <Badge
      variant={getGoalColor(goal) as any}
      className="text-[9px] uppercase tracking-wider font-bold"
    >
      {goal}
    </Badge>
  );
};

export default GoalTag;
