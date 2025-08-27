export function Toolbar({ className = "", ...props }) {
  return (
    <div className={`sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/50 bg-white/30 border-b border-[hsl(var(--border))] ${className}`} {...props} />
  );
}

export function Divider({ className = "" }) {
  return <div className={`h-px bg-[hsl(var(--border))] ${className}`} />;
}
