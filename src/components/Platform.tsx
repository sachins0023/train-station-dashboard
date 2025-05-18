import type { Train } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const Platform = ({
  platformId,
  trains,
}: {
  platformId: string;
  trains: Train[];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform {platformId}</CardTitle>
      </CardHeader>
      <CardContent>
        {trains.map((train) => (
          <p key={train.trainNumber}>
            {train.trainNumber} {train.status}
          </p>
        ))}
      </CardContent>
    </Card>
  );
};

export default Platform;
