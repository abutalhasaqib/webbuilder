import { Button } from "@/components/ui/Button";

export function Inspector({ item, onChange, onRemove, onDuplicate, onMoveUp, onMoveDown }) {
  const { type, props } = item;
  return (
    <div className="mt-2 grid gap-3">
      <div>
        <label className="block text-xs text-slate-500 mb-1">Type</label>
        <div className="text-xs">{type}</div>
      </div>

      {(type === "heading" || type === "text" || type === "button") && (
        <div>
          <label className="block text-xs text-slate-500 mb-1">Text</label>
          <input
            value={props.text || ""}
            onChange={(e) => onChange({ text: e.target.value })}
            className="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm outline-none"
            placeholder="Enter text"
          />
        </div>
      )}

      {type === "button" && (
        <div>
          <label className="block text-xs text-slate-500 mb-1">Link (href)</label>
          <input
            value={props.href || ""}
            onChange={(e) => onChange({ href: e.target.value })}
            className="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm outline-none"
            placeholder="# or /path"
          />
        </div>
      )}

      {/* Common style controls */}
      {(type === "heading" || type === "text" || type === "button") && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Align</label>
            <select
              value={props.align || 'left'}
              onChange={(e) => onChange({ align: e.target.value })}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-2 py-2 text-sm outline-none"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Size</label>
            <select
              value={props.size || 'base'}
              onChange={(e) => onChange({ size: e.target.value })}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-2 py-2 text-sm outline-none"
            >
              <option value="sm">Sm</option>
              <option value="base">Base</option>
              <option value="lg">Lg</option>
              <option value="xl">XL</option>
              <option value="2xl">2XL</option>
              <option value="3xl">3XL</option>
            </select>
          </div>
        </div>
      )}

      {/* Button-specific variant + radius/padding */}
      {type === "button" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Variant</label>
            <select
              value={props.variant || 'primary'}
              onChange={(e) => onChange({ variant: e.target.value })}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-2 py-2 text-sm outline-none"
            >
              <option value="primary">Primary</option>
              <option value="success">Success</option>
              <option value="danger">Danger</option>
              <option value="muted">Muted</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Radius</label>
            <select
              value={props.radius || 'xl'}
              onChange={(e) => onChange({ radius: e.target.value })}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-2 py-2 text-sm outline-none"
            >
              <option value="none">None</option>
              <option value="sm">Sm</option>
              <option value="md">Md</option>
              <option value="lg">Lg</option>
              <option value="xl">XL</option>
              <option value="2xl">2XL</option>
              <option value="full">Full</option>
            </select>
          </div>
        </div>
      )}

      {/* Spacing controls */}
      {(type === "button" || type === "image") && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Padding X</label>
            <input type="number" min={0} max={16} value={props.px ?? 3} onChange={(e) => onChange({ px: clampNum(e.target.value, 0, 16) })} className="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Padding Y</label>
            <input type="number" min={0} max={16} value={props.py ?? 2} onChange={(e) => onChange({ py: clampNum(e.target.value, 0, 16) })} className="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Margin Top</label>
            <input type="number" min={0} max={16} value={props.mt ?? 0} onChange={(e) => onChange({ mt: clampNum(e.target.value, 0, 16) })} className="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Margin Bottom</label>
            <input type="number" min={0} max={16} value={props.mb ?? 2} onChange={(e) => onChange({ mb: clampNum(e.target.value, 0, 16) })} className="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm outline-none" />
          </div>
        </div>
      )}

      {type === "image" && (
        <>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Image URL</label>
            <input
              value={props.src || ""}
              onChange={(e) => onChange({ src: e.target.value })}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm outline-none"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Alt text</label>
            <input
              value={props.alt || ""}
              onChange={(e) => onChange({ alt: e.target.value })}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm outline-none"
              placeholder="Describe the image"
            />
          </div>
        </>
      )}

      <div className="mt-1 flex items-center gap-2">
        <Button className="btn-ghost" onClick={onDuplicate}>Duplicate</Button>
        <Button className="btn-ghost" onClick={onMoveUp}>Move Up</Button>
        <Button className="btn-ghost" onClick={onMoveDown}>Move Down</Button>
        <Button variant="danger" onClick={onRemove}>Delete</Button>
      </div>
    </div>
  );
}

function clampNum(v, min, max) {
  const n = Number(v);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}
