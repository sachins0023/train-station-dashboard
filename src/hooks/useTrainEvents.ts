import { useRef, useMemo } from "react";
import { assignTrainsWithMinHeap } from "@/utils";
import type { Train, Status } from "@/types";
import useClock from "./useClock";

const useTrainEvents = (trainData: Train[], platformCount: string) => {
  const { time } = useClock();
  const processedEventsRef = useRef(new Set<string>());

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

  const currentEvents = useMemo(() => {
    return eventMap[time] || [];
  }, [time, eventMap]);

  return { currentEvents, processedEventsRef, platformData };
};

export default useTrainEvents;
