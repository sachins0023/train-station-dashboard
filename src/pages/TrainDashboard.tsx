import TrainList from "@/components/TrainList";
import PlatformList from "@/components/PlatformList";
import type { Train } from "@/types";
import { useMemo, useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { updateTrainStatus } from "@/actions";
import useClock from "@/hooks/useClock";
import useTrainEvents from "@/hooks/useTrainEvents";
import { useTrainContext } from "@/context/TrainContext";

const TrainDashboard = ({ trainData }: { trainData: Train[] }) => {
  const { state, dispatch } = useTrainContext();
  const [timeMultiplier, setTimeMultiplier] = useState<number>(1);

  // Use the clock time from the reducer
  useClock(timeMultiplier, dispatch);

  const { currentEvents, processedEventsRef } = useTrainEvents(state.clockTime);

  useEffect(() => {
    const newEvents = currentEvents.filter((event) => {
      const eventKey = `${event.train.trainNumber}-${event.type}-${state.clockTime}`;
      if (processedEventsRef.current.has(eventKey)) {
        return false;
      }
      processedEventsRef.current.add(eventKey);
      return true;
    });

    if (newEvents.length > 0) {
      dispatch(updateTrainStatus(newEvents));
    }

    if (processedEventsRef.current.size > 10000) {
      processedEventsRef.current.clear();
    }
  }, [state.clockTime, currentEvents, processedEventsRef, dispatch]);

  const renderTrainList = useMemo(() => {
    return <TrainList data={trainData} />;
  }, [trainData]);

  const renderPlatformList = useMemo(() => {
    return <PlatformList data={state.platformData} />;
  }, [state.platformData]);

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full">
      <div className="flex items-center gap-2 shrink-0">
        <p>Clock: {state.clockTime}</p>
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
      <div className="flex gap-4 w-full flex-1 min-h-0">
        {renderTrainList}
        {renderPlatformList}
      </div>
    </div>
  );
};

export default TrainDashboard;
