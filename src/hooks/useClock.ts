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
      // Add TIME_MULTIPLIER/10 simulated seconds (since we run every 100ms)
      currentTimeRef.current.setSeconds(
        currentTimeRef.current.getSeconds() + TIME_MULTIPLIER
      );
      const newFormattedTime = formatTime(currentTimeRef.current);

      // Only update if the formatted time actually changed
      if (newFormattedTime !== lastTimeRef.current) {
        lastTimeRef.current = newFormattedTime;
        setFormattedTime(newFormattedTime);
      }
    }, 100); // Run every 100ms, which is a reasonable interval

    return () => clearInterval(interval);
  }, []); // Empty deps array since we use refs for state

  return { time: formattedTime };
}
