import type { Train } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Platform from "./Platform";

const PlatformList = ({ data }: { data: Record<number, Train[]> }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform List</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        {Object.entries(data).map(([platformId, trains]) => (
          <Platform key={platformId} platformId={platformId} trains={trains} />
        ))}
      </CardContent>
      {/* <CardFooter>
    <p>Card Footer</p>
  </CardFooter> */}
    </Card>
  );
};

export default PlatformList;
