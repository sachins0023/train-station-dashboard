import { useState, useEffect, useRef } from "react";
import { formatTime } from "@/utils";
import { TIME_MULTIPLIER } from "@/constants";

export default function useClock() {
  const [formattedTime, setFormattedTime] = useState(() =>
    formatTime(new Date(0, 0, 0, 6, 0))
  );
  const lastTimeRef = useRef(formattedTime);
  const currentTimeRef = useRef(new Date(0, 0, 0, 6, 0));

  useEffect(() => {
    const interval = setInterval(() => {
      // Add 1 simulated second
      currentTimeRef.current.setSeconds(
        currentTimeRef.current.getSeconds() + 1
      );
      const newFormattedTime = formatTime(currentTimeRef.current);

      // Only update if the formatted time actually changed
      if (newFormattedTime !== lastTimeRef.current) {
        lastTimeRef.current = newFormattedTime;
        setFormattedTime(newFormattedTime);
      }
    }, 1000 / TIME_MULTIPLIER); // Run faster to simulate time progression

    return () => clearInterval(interval);
  }, []); // Empty deps array since we use refs for state

  return { time: formattedTime };
}
