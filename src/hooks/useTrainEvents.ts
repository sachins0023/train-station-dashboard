import { useRef, useMemo } from "react";
import { assignTrainsWithMinHeap } from "@/utils";
import type { Train, Status } from "@/types";

// Helper to get all times between two HH:mm strings (inclusive)
function getTimesBetween(start: string, end: string): string[] {
  const result = [];
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const current = new Date(2000, 0, 1, startH, startM);
  const endDate = new Date(2000, 0, 1, endH, endM);
  while (current <= endDate) {
    // Format as HH:mm
    const hh = String(current.getHours()).padStart(2, "0");
    const mm = String(current.getMinutes()).padStart(2, "0");
    result.push(`${hh}:${mm}`);
    current.setMinutes(current.getMinutes() + 1);
  }
  return result;
}

const useTrainEvents = (
  trainData: Train[],
  platformCount: string,
  timeMultiplier: number,
  clockTime: string
) => {
  const processedEventsRef = useRef(new Set<string>());
  const previousTimeRef = useRef<string>(clockTime); // Track previous time

  const platformData = useMemo(() => {
    if (!platformCount || !trainData.length) return {};
    const numericPlatformData = assignTrainsWithMinHeap(
      trainData,
      Number(platformCount)
    );
    // Convert platform numbers to strings
    return Object.entries(numericPlatformData).reduce(
      (acc, [platformId, trains]) => {
        acc[platformId] = trains.map((train) => ({
          ...train,
          platformId: platformId,
        }));
        return acc;
      },
      {} as Record<string, Train[]>
    );
  }, [trainData, platformCount]);

  const eventMap = useMemo(() => {
    return Object.entries(platformData).reduce((acc, [platformId, trains]) => {
      trains.forEach((train) => {
        if (!acc[train.actualArrival]) {
          acc[train.actualArrival] = [];
        }
        if (!acc[train.actualDeparture]) {
          acc[train.actualDeparture] = [];
        }
        acc[train.actualArrival].push({
          type: "arrived",
          train,
          platformId,
        });
        acc[train.actualDeparture].push({
          type: "departed",
          train,
          platformId,
        });
      });
      return acc;
    }, {} as Record<string, { type: Status; train: Train; platformId: string }[]>);
  }, [platformData]);

  // Collect all events between previousTimeRef and current time
  const currentEvents = useMemo(() => {
    const prev = previousTimeRef.current;
    const curr = clockTime;
    // If time went backwards (reset), just use current time
    let times: string[];
    if (prev <= curr) {
      times = getTimesBetween(prev, curr);
    } else {
      // If clock reset (e.g. midnight), just use current time
      times = [curr];
    }
    // Gather all events for these times
    const events = times.flatMap((t) => eventMap[t] || []);
    previousTimeRef.current = curr;
    return events;
  }, [clockTime, eventMap]);

  return { currentEvents, processedEventsRef, platformData };
};

export default useTrainEvents;
