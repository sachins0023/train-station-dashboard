import type { Train } from "@/types";
import { CardContent, CardHeader, CardTitle, Card } from "./ui/card";
import TrainTable from "./TrainTable";

export const TrainListCard = ({
  title,
  trains,
}: {
  title: string;
  trains: Train[];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-y-0 border">
        <TrainTable trains={trains} />
      </CardContent>
    </Card>
  );
};
