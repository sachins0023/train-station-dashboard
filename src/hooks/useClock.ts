import { useState, useEffect, useRef } from "react";
import { formatTime } from "@/utils";
import { TIME_MULTIPLIER, INITIAL_CLOCK_TIME } from "@/constants";
import type { Dispatch } from "react";
import type { TrainAction } from "@/types";
import { updateClock } from "@/actions";

export default function useClock(
  multiplier: number = TIME_MULTIPLIER,
  dispatch?: Dispatch<TrainAction>
) {
  const [formattedTime, setFormattedTime] = useState(() =>
    formatTime(
      new Date(
        0,
        0,
        0,
        Number(INITIAL_CLOCK_TIME.split(":")[0]),
        Number(INITIAL_CLOCK_TIME.split(":")[1])
      )
    )
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
      const newTime = new Date(
        0,
        0,
        0,
        Number(INITIAL_CLOCK_TIME.split(":")[0]),
        Number(INITIAL_CLOCK_TIME.split(":")[1])
      );
      newTime.setSeconds(Math.floor(totalSecondsRef.current));

      const newFormattedTime = formatTime(newTime);

      if (newFormattedTime !== lastTimeRef.current) {
        lastTimeRef.current = newFormattedTime;
        setFormattedTime(newFormattedTime);
        // Dispatch clock update if dispatch function is provided
        if (dispatch) {
          dispatch(updateClock(newFormattedTime));
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [dispatch]); // Add dispatch to deps array

  return { time: formattedTime };
}
