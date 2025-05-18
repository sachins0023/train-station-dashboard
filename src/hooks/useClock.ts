import { useState, useEffect, useRef } from "react";
import { formatTime } from "@/utils";
import { TIME_MULTIPLIER } from "@/constants";

export default function useClock(multiplier: number = TIME_MULTIPLIER) {
  const [formattedTime, setFormattedTime] = useState(() =>
    formatTime(new Date(0, 0, 0, 10, 0))
  );
  const lastTimeRef = useRef(formattedTime);
  const totalSecondsRef = useRef(0);
  const lastUpdateRef = useRef(Date.now());
  const multiplierRef = useRef(multiplier);

  // Just update the multiplier ref
  useEffect(() => {
    multiplierRef.current = multiplier;
  }, [multiplier]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      // Add simulated seconds based on elapsed time and multiplier
      const simulatedSeconds = (elapsedMs / 1000) * multiplierRef.current;

      // Since all train timings are in HH:mm format, we can safely move in 1-minute increments
      const maxStepSeconds = 60; // 1 minute
      const limitedSimulatedSeconds = Math.min(
        simulatedSeconds,
        maxStepSeconds
      );
      totalSecondsRef.current += limitedSimulatedSeconds;

      // Create time from total seconds
      const newTime = new Date(0, 0, 0, 10, 0);
      newTime.setSeconds(Math.floor(totalSecondsRef.current));

      const newFormattedTime = formatTime(newTime);

      if (newFormattedTime !== lastTimeRef.current) {
        lastTimeRef.current = newFormattedTime;
        setFormattedTime(newFormattedTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []); // Empty deps array - interval never changes

  return { time: formattedTime };
}
