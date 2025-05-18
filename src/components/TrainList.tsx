import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Train } from "@/types";
import { TrainListCard } from "./TrainListCard";

const TrainList = ({ data }: { data: Train[] }) => {
  const upcomingTrains = data.filter((train) => train.status !== "departed");
  const pastTrains = data.filter((train) => train.status === "departed");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Train List</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <TrainListCard title="Upcoming Trains" trains={upcomingTrains} />
        <TrainListCard title="Past Trains" trains={pastTrains} />
      </CardContent>
    </Card>
  );
};

export default TrainList;
