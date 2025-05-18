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
  const [uploadedFileData, setUploadedFileData] = useState<TrainCSV[]>([]);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  const { state, dispatch } = useTrainContext();

  const trainData = useMemo(() => {
    return Object.values(state.platformData).flat();
  }, [state.platformData]);

  const onUpload = useCallback((data: TrainCSV[]) => {
    // Format and validate train data
    const updatedData = data.map((train: TrainCSV) => {
      // Validate required fields
      console.log({ train, data });
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

    setUploadedFileData(updatedData);
  }, []);

  const onSubmit = useCallback(() => {
    if (!platformCount) {
      errorMessage("Please enter platform count first");
      return;
    }

    const platformCountNum = Number(platformCount);
    if (isNaN(platformCountNum) || platformCountNum <= 0) {
      errorMessage("Please enter a valid platform count");
      return;
    }

    if (!uploadedFileData.length) {
      errorMessage("No file uploaded");
      return;
    }
    try {
      dispatch(setPlatformData(uploadedFileData as Train[], platformCountNum));
    } catch (error) {
      errorMessage(
        `Failed to assign platforms: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
    setShowDashboard(true);
  }, [platformCount, uploadedFileData, dispatch]);

  const reset = useCallback(() => {
    setPlatformCount("");
    setShowDashboard(false);
    dispatch(setPlatformData([], 0));
  }, [dispatch]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="flex p-4 gap-4">
        {showDashboard && (
          <ArrowLeftIcon
            onClick={() => reset()}
            className="w-8 h-8 cursor-pointer"
          />
        )}
        <div className="font-bold text-2xl items-center flex-1 text-center">
          Train Scheduler
        </div>
      </div>
      <div className="flex-1 w-full overflow-auto px-4 pb-4">
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
      </div>
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
