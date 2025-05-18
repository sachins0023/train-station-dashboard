import TrainList from "@/components/TrainList";
import PlatformList from "@/components/PlatformList";
import type { Train } from "@/types";
import { useMemo, useState, useEffect, type Dispatch } from "react";
import { Slider } from "@/components/ui/slider";
import { setPlatformData, updateTrainStatus } from "@/actions";
import useClock from "@/hooks/useClock";
import useTrainEvents from "@/hooks/useTrainEvents";

const TrainDashboard = ({
  trainData,
  platformCount,
  platformData,
  dispatch,
}: {
  trainData: Train[];
  platformCount: string;
  platformData: Record<number, Train[]>;
  dispatch: Dispatch<ReturnType<typeof setPlatformData>>;
}) => {
  const [timeMultiplier, setTimeMultiplier] = useState<number>(1);

  const { time } = useClock(timeMultiplier);

  const { currentEvents, processedEventsRef } = useTrainEvents(
    trainData,
    platformCount,
    timeMultiplier
  );

  useEffect(() => {
    const newEvents = currentEvents.filter((event) => {
      const eventKey = `${event.train.trainNumber}-${event.type}-${time}`;
      if (processedEventsRef.current.has(eventKey)) {
        return false;
      }
      processedEventsRef.current.add(eventKey);
      return true;
    });

    if (newEvents.length > 0) {
      dispatch(updateTrainStatus(newEvents));
    }

    if (processedEventsRef.current.size > 1000) {
      processedEventsRef.current.clear();
    }
  }, [time, currentEvents, processedEventsRef, dispatch]);

  const renderTrainList = useMemo(() => {
    return <TrainList data={trainData} />;
  }, [trainData]);

  const renderPlatformList = useMemo(() => {
    return <PlatformList data={platformData} />;
  }, [platformData]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <p>Clock: {time}</p>
        <Slider
          min={1}
          max={500}
          value={[timeMultiplier]}
          className="w-80"
          onValueChange={(value) => {
            setTimeMultiplier(value[0]);
          }}
        />
        <p>{timeMultiplier}x</p>
      </div>
      <div className="flex">
        {renderTrainList}
        {renderPlatformList}
      </div>
    </div>
  );
};

export default TrainDashboard;
