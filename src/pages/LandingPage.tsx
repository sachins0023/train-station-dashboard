import PlatformInput from "@/components/PlatformInput";
import { Button } from "@/components/ui/button";
import Upload from "@/components/Upload";
import type { TrainCSV } from "@/types";

const LandingPage = ({
  platformCount,
  setPlatformCount,
  onUpload,
  onSubmit,
}: {
  platformCount: string;
  setPlatformCount: (value: string) => void;
  onUpload: (data: TrainCSV[]) => void;
  onSubmit: () => void;
}) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex items-center gap-2">
        Enter number of platforms:
        <PlatformInput value={platformCount} updateValue={setPlatformCount} />
      </div>
      <div className="flex items-center gap-2">
        Upload your data:
        <Upload onUpload={onUpload} />
      </div>
      <Button className="w-fit" onClick={onSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default LandingPage;
