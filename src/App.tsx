import { useCallback, useReducer, useState, useEffect, useMemo } from "react";
import { Toaster } from "sonner";
import useClock from "@/hooks/useClock";
import type { Train, TrainCSV } from "@/types";
import LandingPage from "./pages/LandingPage";
import TrainDashboard from "./pages/TrainDashboard";
import { errorMessage } from "./utils";
import { trainReducer } from "./reducer";
import useTrainEvents from "./hooks/useTrainEvents";
import { setPlatformData, updateTrainStatus } from "./actions";

function App() {
  const [platformCount, setPlatformCount] = useState<string>("");
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  const [platformData, dispatch] = useReducer(trainReducer, {});

  const trainData = useMemo(() => {
    return Object.values(platformData).flat();
  }, [platformData]);

  const { currentEvents, processedEventsRef } = useTrainEvents(
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

  const onUpload = useCallback(
    (data: TrainCSV[]) => {
      if (!platformCount) {
        errorMessage("Please enter platform count first");
        return;
      }

      const platformCountNum = Number(platformCount);
      if (isNaN(platformCountNum) || platformCountNum <= 0) {
        errorMessage("Please enter a valid platform count");
        return;
      }

      if (!data.length) {
        errorMessage("No train data provided");
        return;
      }

      // Format and validate train data
      const updatedData = data.map((train: TrainCSV) => {
        // Validate required fields
        if (
          !train.trainNumber ||
          !train.scheduledArrival ||
          !train.scheduledDeparture ||
          !train.priority
        ) {
          throw new Error(
            `Invalid train data for train ${train.trainNumber || "unknown"}`
          );
        }

        return {
          ...train,
          actualArrival: train.scheduledArrival,
          actualDeparture: train.scheduledDeparture,
          status: "scheduled" as const,
          platformId: "0", // Will be set by assignTrainsWithMinHeap
        } as Train;
      });

      try {
        dispatch(setPlatformData(updatedData, platformCountNum));
      } catch (error) {
        errorMessage(
          `Failed to assign platforms: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    [platformCount]
  );

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
