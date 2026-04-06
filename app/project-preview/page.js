import { Suspense } from "react";
import ProjectPreviewView from "./ProjectPreviewView";

function PreviewFallback() {
  return (
    <div className="flex flex-1 items-center justify-center py-24 text-slate-500">
      Loading preview...
    </div>
  );
}

export default function ProjectPreviewPage() {
  return (
    <Suspense fallback={<PreviewFallback />}>
      <ProjectPreviewView />
    </Suspense>
  );
}
