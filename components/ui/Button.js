export function Button({ variant = "primary", className = "", ...props }) {
  const base = "btn ";
  const style =
    variant === "danger"
      ? "btn-danger"
      : variant === "ghost"
      ? "btn-ghost"
      : "btn-primary";
  return <button className={`${base} ${style} ${className}`} {...props} />;
}
