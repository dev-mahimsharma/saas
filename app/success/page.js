import { Suspense } from "react";
import SuccessView from "./SuccessView";

function SuccessFallback() {
  return (
    <div className="flex flex-1 items-center justify-center py-24 text-slate-500">
      Loading…
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessView />
    </Suspense>
  );
}
