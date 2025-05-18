import TrainList from "@/components/TrainList";
import PlatformList from "@/components/PlatformList";
import type { Train } from "@/types";
import { useMemo } from "react";

const TrainDashboard = ({
  trainData,
  // platformCount,
  platformData,
}: {
  trainData: Train[];
  // platformCount: string;
  platformData: Record<number, Train[]>;
}) => {
  const renderTrainList = useMemo(() => {
    return <TrainList data={trainData} />;
  }, [trainData]);

  const renderPlatformList = useMemo(() => {
    return <PlatformList data={platformData} />;
  }, [platformData]);
  return (
    <div className="flex">
      {renderTrainList}
      {renderPlatformList}
    </div>
  );
};

export default TrainDashboard;
