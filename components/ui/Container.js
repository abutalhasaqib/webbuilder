export function Container({ className = "", ...props }) {
  return <div className={`w-full ${className}`} {...props} />;
}
