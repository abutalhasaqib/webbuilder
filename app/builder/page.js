"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Divider, Toolbar } from "@/components/ui/Misc";
import { RenderBlock } from "@/components/builder/RenderBlock";
import { Inspector } from "@/components/builder/Inspector";
import { DropZone as DZ } from "@/components/builder/DropZone";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

// Minimal ID generator
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const PALETTE = [
  { type: "heading", label: "Heading", defaults: { text: "A nice headline" } },
  { type: "text", label: "Paragraph", defaults: { text: "Write something compelling here." } },
  { type: "button", label: "Button", defaults: { text: "Click me", href: "#" } },
  { type: "image", label: "Image", defaults: { src: "https://picsum.photos/800/300", alt: "Random" } },
];

const STORAGE_KEY = "wb:items:v1";

export default function BuilderPage() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [dropIndex, setDropIndex] = useState(null); // visual indicator for drop position

  // Load and persist
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const selected = useMemo(() => items.find((i) => i.id === selectedId) || null, [items, selectedId]);

  // Palette drag start
  const onPaletteDragStart = (e, type, defaults) => {
    e.dataTransfer.setData(
      "application/wb-item",
      JSON.stringify({ source: "palette", type, defaults })
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  // Canvas drop handlers
  const onCanvasDragOver = (e) => {
    // Allow dropping anywhere in the canvas; we'll place at end if no specific index
    e.preventDefault();
    e.dataTransfer.dropEffect = "copyMove";
  };

  const insertAt = (list, index, item) => {
    const copy = list.slice();
    copy.splice(index, 0, item);
    return copy;
  };

  const moveItem = (list, fromIndex, toIndex) => {
    const copy = list.slice();
    const [moved] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, moved);
    return copy;
  };

  const handleDropAtIndex = (e, index) => {
    e.preventDefault();
    setDropIndex(null);
    const payloadRaw = e.dataTransfer.getData("application/wb-item");
    if (!payloadRaw) return;
    try {
      const payload = JSON.parse(payloadRaw);
      if (payload.source === "palette") {
        const { type, defaults } = payload;
        const newItem = { id: uid(), type, props: { ...defaults } };
        setItems((prev) => insertAt(prev, clampIndex(index, prev.length), newItem));
        setSelectedId(newItem.id);
      } else if (payload.source === "canvas") {
        const { index: fromIndex } = payload;
        setItems((prev) => {
          const to = clampIndex(index, prev.length);
          if (fromIndex === to || fromIndex + 1 === to) return prev; // no-op if same position
          const normalizedTo = fromIndex < to ? to - 1 : to; // account for removal
          return moveItem(prev, fromIndex, clampIndex(normalizedTo, prev.length));
        });
      }
    } catch {}
  };

  const clampIndex = (i, len) => Math.max(0, Math.min(i, len));

  const onItemDragStart = (e, index) => {
    e.dataTransfer.setData("application/wb-item", JSON.stringify({ source: "canvas", index }));
    e.dataTransfer.effectAllowed = "move";
  };

  const DropZone = ({ index }) => (
    <DZ
      index={index}
      active={dropIndex === index}
      onDragOver={(e) => {
        e.preventDefault();
        setDropIndex(index);
      }}
      onDragLeave={() => setDropIndex((d) => (d === index ? null : d))}
      onDrop={(e) => handleDropAtIndex(e, index)}
    />
  );

  const removeSelected = () => {
    if (!selected) return;
    setItems((prev) => prev.filter((i) => i.id !== selected.id));
    setSelectedId(null);
  };

  const duplicateSelected = () => {
    if (!selected) return;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === selected.id);
      if (idx === -1) return prev;
      const clone = { ...selected, id: uid() };
      const next = prev.slice();
      next.splice(idx + 1, 0, clone);
      return next;
    });
  };

  const moveSelected = (dir) => {
    if (!selected) return;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === selected.id);
      if (idx === -1) return prev;
      const to = idx + dir;
      if (to < 0 || to >= prev.length) return prev;
      const copy = prev.slice();
      const [x] = copy.splice(idx, 1);
      copy.splice(to, 0, x);
      return copy;
    });
  };

  const clearAll = () => {
    setItems([]);
    setSelectedId(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const ExportHTML = () => {
    const html = items.map(renderStaticHTML).join("\n");
    return (
      <textarea readOnly value={html} className="w-full h-40 p-2 rounded-xl outline-none bg-white text-xs font-mono" />
    );
  };

  return (
    <div className="min-h-screen">
      <Toolbar>
        <Container className="flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))]" />
            <div className="font-semibold">Webbuilder</div>
            <span className="hidden text-xs text-slate-500 sm:inline">Playful pastel builder</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Link href="/" className="btn btn-ghost">Home</Link>
            <Button variant="danger" onClick={clearAll}>Clear</Button>
          </div>
        </Container>
      </Toolbar>

  <Container className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_320px]">
          {/* Palette */}
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-slate-700">Components</h2>
            <Divider className="my-3" />
            <div className="grid gap-2">
              {PALETTE.map((p) => (
                <button
                  key={p.type}
                  draggable
                  onDragStart={(e) => onPaletteDragStart(e, p.type, p.defaults)}
                  onClick={() => {
                    const newItem = { id: uid(), type: p.type, props: { ...p.defaults } };
                    setItems((prev) => [...prev, newItem]);
                    setSelectedId(newItem.id);
                  }}
                  title="Drag onto canvas or click to add"
                  className="text-left rounded-xl border border-[hsl(var(--border))] bg-white/70 hover:bg-white px-3 py-2 text-sm cursor-grab"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Divider className="my-3" />
            <h3 className="text-xs font-medium text-slate-500 mb-2">Templates</h3>
            <div className="grid gap-2">
              <button
                className="text-left rounded-xl border border-[hsl(var(--border))] bg-white/70 hover:bg-white px-3 py-2 text-sm"
                onClick={() => {
                  const blocks = [
                    { id: uid(), type: 'heading', props: { text: 'Hero title', align: 'center', size: '3xl', mb: 4 } },
                    { id: uid(), type: 'text', props: { text: 'Short subtitle goes here', align: 'center', size: 'lg', mb: 6 } },
                    { id: uid(), type: 'button', props: { text: 'Get started', href: '#', variant: 'success', align: 'center', px: 4, py: 3 } },
                  ];
                  setItems((prev) => [...prev, ...blocks]);
                  setSelectedId(blocks[0].id);
                }}
              >Hero CTA</button>

              <button
                className="text-left rounded-xl border border-[hsl(var(--border))] bg-white/70 hover:bg-white px-3 py-2 text-sm"
                onClick={() => {
                  const blocks = [
                    { id: uid(), type: 'image', props: { src: 'https://picsum.photos/1200/360', alt: 'Banner', radius: 'lg', mb: 4 } },
                    { id: uid(), type: 'heading', props: { text: 'Welcome to Webbuilder', size: '2xl', mb: 2 } },
                    { id: uid(), type: 'text', props: { text: 'Build with drag and drop blocks.', size: 'base', mb: 4 } },
                  ];
                  setItems((prev) => [...prev, ...blocks]);
                  setSelectedId(blocks[0].id);
                }}
              >Banner + Text</button>
            </div>
          </Card>

          {/* Canvas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-semibold">Canvas</h1>
              <span className="text-xs text-slate-500">Drag to reorder. Drop zones appear between blocks.</span>
            </div>

            <Card
              className="p-3 min-h-[540px] bg-white/70"
              onDragOver={onCanvasDragOver}
              onDrop={(e) => handleDropAtIndex(e, items.length)}
            >
              <DropZone index={0} />
              {items.map((item, i) => (
                <div key={item.id}>
                  <div
                    draggable
                    onDragStart={(e) => onItemDragStart(e, i)}
                    onClick={() => setSelectedId(item.id)}
                    className={`cursor-grab rounded-xl border ${
                      selectedId === item.id
                        ? "border-blue-400 bg-blue-50"
                        : "border-[hsl(var(--border))] bg-slate-50"
                    } px-3 py-3`}
                  >
                    <RenderBlock item={item} />
                  </div>
                  <DropZone index={i + 1} />
                </div>
              ))}
            </Card>

            <Card className="p-3">
              <details>
                <summary className="cursor-pointer text-sm font-medium">Export HTML</summary>
                <div className="mt-2 rounded-xl border border-[hsl(var(--border))] bg-white">
                  <ExportHTML />
                </div>
              </details>
            </Card>
          </div>

          {/* Inspector */}
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-slate-700">Inspector</h2>
            <Divider className="my-3" />
            {!selected && (
              <p className="text-sm text-slate-500">Select a block to edit its properties.</p>
            )}
            {selected && (
              <Inspector
                item={selected}
                onChange={(patch) =>
                  setItems((prev) => prev.map((i) => (i.id === selected.id ? { ...i, props: { ...i.props, ...patch } } : i)))
                }
                onRemove={removeSelected}
                onDuplicate={duplicateSelected}
                onMoveUp={() => moveSelected(-1)}
                onMoveDown={() => moveSelected(1)}
              />
            )}
          </Card>
        </div>
      </Container>
    </div>
  );
}

// RenderBlock moved to components/builder/RenderBlock.js

// Inspector moved to components/builder/Inspector.js

// Inline style helpers removed (Tailwind in use)

function renderStaticHTML(item) {
  if (item.type === "heading") return `<h2>${escapeHtml(item.props?.text || "Heading")}</h2>`;
  if (item.type === "text") return `<p>${escapeHtml(item.props?.text || "Paragraph")}</p>`;
  if (item.type === "button") return `<a href="${escapeAttr(item.props?.href || "#")}" style="display:inline-block;padding:8px 12px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;">${escapeHtml(item.props?.text || "Button")}</a>`;
  if (item.type === "image") return `<img src="${escapeAttr(item.props?.src || "https://picsum.photos/800/300")}" alt="${escapeAttr(item.props?.alt || "Image")}" style="width:100%;height:auto;border-radius:8px;"/>`;
  return "";
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#x60;");
}
