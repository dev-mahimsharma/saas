import FolderTreePreview from "@/components/FolderTreePreview";

export default function LiveStructurePreview({
  rootName,
  treeNodes,
  bundleLabel,
}) {
  return (
    <FolderTreePreview
      variant="live"
      rootName={rootName}
      nodes={treeNodes}
      headerTitle="Live Structure Preview"
      heightClass="h-[540px]"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          <span>Bundle estimate: {bundleLabel}</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-600">bootNode</span>
            <span className="rounded-md bg-blue-600/20 px-2 py-0.5 text-blue-300">
              Preview
            </span>
          </div>
        </div>
      }
    />
  );
}
