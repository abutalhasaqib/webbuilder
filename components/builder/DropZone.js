export function DropZone({ index, active, onDragOver, onDragLeave, onDrop }) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`h-3 border-t-2 border-dashed my-1 transition-colors ${
        active ? "border-blue-300 bg-blue-100/40" : "border-blue-200 bg-transparent"
      }`}
    />
  );
}
