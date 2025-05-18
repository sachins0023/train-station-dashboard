import type { Train } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Platform from "./Platform";

const PlatformList = ({ data }: { data: Record<string, Train[]> }) => {
  return (
    <Card className="flex-1 h-full overflow-y-auto">
      <CardHeader>
        <CardTitle>Platform List</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {Object.entries(data).map(([platformId, trains]) => (
          <Platform key={platformId} platformId={platformId} trains={trains} />
        ))}
      </CardContent>
    </Card>
  );
};

export default PlatformList;
