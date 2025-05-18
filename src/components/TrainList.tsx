import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Train } from "@/types";
import { TrainListCard } from "./TrainListCard";
import { isLate } from "@/utils";
import { useTrainContext } from "@/context/TrainContext";

const TrainList = ({ data }: { data: Train[] }) => {
  const { state } = useTrainContext();
  const currentTime = state?.clockTime;
  const upcomingTrains = data.filter(
    (train) =>
      train.status === "scheduled" &&
      !isLate(train.scheduledArrival, currentTime)
  );
  const trainsOnPlatform = data.filter((train) => train.status === "arrived");
  const departedTrains = data.filter((train) => train.status === "departed");
  const delayedTrains = data.filter(
    (train) =>
      train.status === "scheduled" &&
      isLate(train.scheduledArrival, currentTime)
  );
  return (
    <Card className="flex-4 h-full overflow-y-auto">
      <CardHeader>
        <CardTitle>Train List</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <TrainListCard title="Upcoming Trains" trains={upcomingTrains} />
        <TrainListCard title="Waiting Trains" trains={delayedTrains} />
        <TrainListCard title="Trains on Platform" trains={trainsOnPlatform} />
        <TrainListCard title="Departed Trains" trains={departedTrains} />
      </CardContent>
    </Card>
  );
};

export default TrainList;
