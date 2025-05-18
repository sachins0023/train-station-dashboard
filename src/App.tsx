import { useCallback, useReducer, useState, useEffect } from "react";
import { Toaster } from "sonner";
import useClock from "@/hooks/useClock";
import type { Train, TrainCSV } from "@/types";
import LandingPage from "./pages/LandingPage";
import TrainDashboard from "./pages/TrainDashboard";
import { errorMessage } from "./utils";
import { trainReducer } from "./reducer";
import useTrainEvents from "./hooks/useTrainEvents";
import { setTrains, updateTrainStatus } from "./actions";

function App() {
  const [platformCount, setPlatformCount] = useState<string>("");
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  const [trainData, dispatch] = useReducer(trainReducer, []);

  const { currentEvents, processedEventsRef, platformData } = useTrainEvents(
    trainData,
    platformCount
  );

  const { time } = useClock();

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
  }, [time, currentEvents, processedEventsRef]);

  const onUpload = useCallback((data: TrainCSV[]) => {
    const updatedData = data.map((train: TrainCSV) => ({
      ...train,
      actualArrival: train.scheduledArrival,
      actualDeparture: train.scheduledDeparture,
      status: "scheduled",
    })) as Train[];
    dispatch(setTrains(updatedData));
  }, []);

  const onSubmit = useCallback(() => {
    if (!platformCount) {
      errorMessage("No platform count entered");
      return;
    }
    if (!trainData.length) {
      errorMessage("No data uploaded");
      return;
    }
    setShowDashboard(true);
  }, [platformCount, trainData]);

  console.log("App rerenders");

  return (
    <div className="h-screen w-screen flex flex-col gap-4 items-center">
      <h1 className="font-bold text-2xl">Train Scheduler</h1>
      <p>Current time: {time}</p>
      {!showDashboard && (
        <LandingPage
          platformCount={platformCount}
          setPlatformCount={setPlatformCount}
          onUpload={onUpload}
          onSubmit={onSubmit}
        />
      )}
      {showDashboard && (
        <TrainDashboard trainData={trainData} platformData={platformData} />
      )}
      <Toaster />
    </div>
  );
}

export default App;
