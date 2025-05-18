import PlatformInput from "@/components/PlatformInput";
import { Button } from "@/components/ui/button";
import Upload from "@/components/Upload";
import type { TrainCSV } from "@/types";
import { Download, DownloadIcon } from "lucide-react";

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
}) => (
  <div className="flex flex-col w-[40%] min-w-[500px] mx-auto gap-4 h-full">
    <div className="grid grid-cols-2 gap-2">
      <p>Enter number of platforms:</p>
      <PlatformInput value={platformCount} updateValue={setPlatformCount} />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <p>Upload your data:</p>
      <div className="flex items-center gap-2">
        <Upload onUpload={onUpload} />
        <Button variant="link" className="text-xs" asChild>
          <a
            href="/template.csv"
            download="sample_template.csv"
            className="text-blue-500 text-xs flex items-center gap-1 hover:text-blue-600"
          >
            <DownloadIcon className="w-4 h-4" />
            Template
          </a>
        </Button>
      </div>
    </div>
    <div className="sm:col-span-2 flex justify-center">
      <Button className="w-fit" onClick={onSubmit}>
        Submit
      </Button>
    </div>
  </div>
);

export default LandingPage;
