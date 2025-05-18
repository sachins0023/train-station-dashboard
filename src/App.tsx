import { useCallback, useState, useMemo } from "react";
import { Toaster } from "sonner";
import type { Train, TrainCSV } from "@/types";
import LandingPage from "./pages/LandingPage";
import TrainDashboard from "./pages/TrainDashboard";
import { errorMessage } from "./utils";
import { resetState, setPlatformData } from "./actions";
import { X } from "lucide-react";
import { TrainProvider, useTrainContext } from "./context/TrainContext";
import { assignTrainsWithMinHeap } from "@/utils";

function TrainApp() {
  const [platformCount, setPlatformCount] = useState<string>("");
  const [uploadedFileData, setUploadedFileData] = useState<TrainCSV[]>([]);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  const { state, dispatch } = useTrainContext();

  const trainData = useMemo(() => {
    return Object.values(state.platformData).flat();
  }, [state.platformData]);

  const onUpload = useCallback((data: TrainCSV[]) => {
    const hasError = data.some(
      (train) =>
        !train.trainNumber ||
        !train.scheduledArrival ||
        !train.scheduledDeparture ||
        !train.priority
    );
    if (hasError) {
      errorMessage(
        "Invalid train data. Please check the uploaded excel! Download the template to see the expected format."
      );
      return;
    }

    const updatedData = data.map(
      (train: TrainCSV) =>
        ({
          ...train,
          actualArrival: train.scheduledArrival,
          actualDeparture: train.scheduledDeparture,
          status: "scheduled" as const,
          platformId: "0", // Will be set by assignTrainsWithMinHeap
        } as Train)
    );

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
      // Calculate minTime (earliest scheduledArrival)
      const minTime = uploadedFileData.reduce(
        (min, t) => (t.scheduledArrival < min ? t.scheduledArrival : min),
        "23:59"
      );
      // Assign platforms and get all trains with actualDeparture
      const platformData = assignTrainsWithMinHeap(
        uploadedFileData as Train[],
        platformCountNum
      );
      const allTrains: Train[] = Object.values(platformData).flat();
      // Calculate maxTime (latest actualDeparture)
      const maxTime = allTrains.reduce(
        (max, t) => (t.actualDeparture > max ? t.actualDeparture : max),
        "00:00"
      );
      dispatch(
        setPlatformData(
          uploadedFileData as Train[],
          platformCountNum,
          minTime,
          maxTime
        )
      );
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
    setUploadedFileData([]);
    setShowDashboard(false);
    dispatch(resetState());
  }, [dispatch]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="flex p-4 gap-4">
        {showDashboard && (
          <X
            onClick={() => reset()}
            className="w-8 h-8 cursor-pointer text-red-800 hover:text-red-600"
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
        {showDashboard && <TrainDashboard trainData={trainData} />}
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
