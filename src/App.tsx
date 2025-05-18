import { useCallback, useState, useMemo } from "react";
import { Toaster } from "sonner";
import type { Train, TrainCSV } from "@/types";
import LandingPage from "./pages/LandingPage";
import TrainDashboard from "./pages/TrainDashboard";
import { errorMessage } from "./utils";
import { setPlatformData } from "./actions";
import { ArrowLeftIcon } from "lucide-react";
import { TrainProvider, useTrainContext } from "./context/TrainContext";

function TrainApp() {
  const [platformCount, setPlatformCount] = useState<string>("");
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  const { state, dispatch } = useTrainContext();

  const trainData = useMemo(() => {
    return Object.values(state.platformData).flat();
  }, [state.platformData]);

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
    [platformCount, dispatch]
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

  const reset = useCallback(() => {
    setPlatformCount("");
    setShowDashboard(false);
    dispatch(setPlatformData([], 0));
  }, [dispatch]);

  return (
    <div className="h-screen w-screen flex flex-col gap-4 items-center p-4">
      <h1 className="font-bold text-2xl flex items-center gap-4">
        {showDashboard && (
          <ArrowLeftIcon
            onClick={() => reset()}
            className="w-12 h-12 cursor-pointer"
          />
        )}
        Train Scheduler
      </h1>
      {!showDashboard && (
        <LandingPage
          platformCount={platformCount}
          setPlatformCount={setPlatformCount}
          onUpload={onUpload}
          onSubmit={onSubmit}
        />
      )}
      {showDashboard && (
        <TrainDashboard trainData={trainData} platformCount={platformCount} />
      )}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <TrainProvider>
      <TrainApp />
    </TrainProvider>
  );
}

export default App;
