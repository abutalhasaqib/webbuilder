export function RenderBlock({ item }) {
  const { type, props } = item;
  const { align = 'left', size = 'base', radius = 'xl', px = 3, py = 2, mt = 0, mb = 2, variant = 'primary' } = props || {};

  const textAlign = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  const textSize = sizeToText(size);
  const round = radiusToClass(radius);
  const padX = `px-${px}`; // safelisted
  const padY = `py-${py}`; // safelisted
  const marginTop = `mt-${mt}`; // safelisted
  const marginBottom = `mb-${mb}`; // safelisted
  const btnBg = variantToBg(variant);

  if (type === "heading") return <h2 className={`m-0 font-semibold ${textSize} ${textAlign}`}>{props.text || "Heading"}</h2>;
  if (type === "text") return <p className={`m-0 text-slate-700 ${textSize} ${textAlign}`}>{props.text || "Paragraph"}</p>;
  if (type === "button")
    return (
      <a href={props.href || "#"} className={`inline-block text-white ${round} ${btnBg} hover:${btnBg.replace('bg-', 'bg-')} ${padX} ${padY} ${marginTop} ${marginBottom}`}>
        {props.text || "Button"}
      </a>
    );
  if (type === "image")
    return (
      <img
        src={props.src || "https://picsum.photos/800/300"}
        alt={props.alt || "Image"}
        className={`w-full h-auto ${round} block ${marginTop} ${marginBottom}`}
      />
    );
  return <div>Unknown block</div>;
}

function sizeToText(size) {
  switch (size) {
    case 'sm': return 'text-sm';
    case 'lg': return 'text-lg';
    case 'xl': return 'text-xl';
    case '2xl': return 'text-2xl';
    case '3xl': return 'text-3xl';
    default: return 'text-base';
  }
}

function radiusToClass(r) {
  switch (r) {
    case 'none': return 'rounded-none';
    case 'sm': return 'rounded-sm';
    case 'md': return 'rounded-md';
    case 'lg': return 'rounded-lg';
    case 'xl': return 'rounded-xl';
    case '2xl': return 'rounded-2xl';
    case 'full': return 'rounded-full';
    default: return 'rounded-xl';
  }
}

function variantToBg(v) {
  switch (v) {
    case 'danger': return 'bg-rose-500';
    case 'success': return 'bg-emerald-500';
    case 'muted': return 'bg-slate-600';
    default: return 'bg-blue-500';
  }
}
