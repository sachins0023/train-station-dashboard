import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Train } from "@/types";
import { TrainListCard } from "./TrainListCard";

const TrainList = ({ data }: { data: Train[] }) => {
  const upcomingTrains = data.filter((train) => train.status === "scheduled");
  const trainsOnPlatform = data.filter((train) => train.status === "arrived");
  const departedTrains = data.filter((train) => train.status === "departed");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Train List</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <TrainListCard title="Upcoming Trains" trains={upcomingTrains} />
        <TrainListCard title="Trains on Platform" trains={trainsOnPlatform} />
        <TrainListCard title="Departed Trains" trains={departedTrains} />
      </CardContent>
    </Card>
  );
};

export default TrainList;
