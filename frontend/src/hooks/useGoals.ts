import { useState, useEffect } from "react";

type Goal = "Retirement" | "Education" | "Emergency" | "Growth" | "Dividend";

export function useGoals() {
  const [tags, setTags] = useState<Record<string, Goal[]>>({});

  useEffect(() => {
    const stored = localStorage.getItem("equity_goal_tags");
    if (stored) {
      try {
        setTags(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse goal tags", e);
      }
    }
  }, []);

  const addTag = (symbol: string, goal: Goal) => {
    const newTags = { ...tags };
    if (!newTags[symbol]) newTags[symbol] = [];
    if (!newTags[symbol].includes(goal)) {
      newTags[symbol].push(goal);
      setTags(newTags);
      localStorage.setItem("equity_goal_tags", JSON.stringify(newTags));
    }
  };

  const removeTag = (symbol: string, goal: Goal) => {
    const newTags = { ...tags };
    if (newTags[symbol]) {
      newTags[symbol] = newTags[symbol].filter((g) => g !== goal);
      setTags(newTags);
      localStorage.setItem("equity_goal_tags", JSON.stringify(newTags));
    }
  };

  const getTags = (symbol: string): Goal[] => {
    return tags[symbol] || [];
  };

  return { tags, addTag, removeTag, getTags };
}
