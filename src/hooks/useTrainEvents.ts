import { useRef, useMemo } from "react";
import { assignTrainsWithMinHeap } from "@/utils";
import type { Train, Status } from "@/types";
import useClock from "./useClock";

const useTrainEvents = (trainData: Train[], platformCount: string) => {
  const { time } = useClock();
  const processedEventsRef = useRef(new Set<string>());

  const platformData = useMemo(() => {
    if (!platformCount || !trainData.length) return {};
    return assignTrainsWithMinHeap(trainData, Number(platformCount));
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
          platformId: Number(platformId),
        });
        acc[train.actualDeparture].push({
          type: "departed",
          train,
          platformId: Number(platformId),
        });
      });
      return acc;
    }, {} as Record<string, { type: Status; train: Train; platformId: number }[]>);
  }, [platformData]);

  const currentEvents = useMemo(() => {
    return eventMap[time] || [];
  }, [time, eventMap]);

  return { currentEvents, processedEventsRef, platformData };
};

export default useTrainEvents;
