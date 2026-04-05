import FolderTreePreview from "@/components/FolderTreePreview";

export default function BlueprintPreview({ zipLabel, action, rootName, treeNodes }) {
  return (
    <FolderTreePreview
      variant="blueprint"
      rootName={rootName}
      nodes={treeNodes}
      headerTitle="Blueprint Preview"
      headerRight={
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          ACTIVE_CONFIG
        </p>
      }
      minHeight="min-h-[520px]"
      footer={
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Ready to build</span>
            <span>{zipLabel}</span>
          </div>
          {action}
        </div>
      }
    />
  );
}
