"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import 'reactflow/dist/style.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Misc";
import { RenderBlock } from "@/components/builder/RenderBlock";

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const PALETTE = [
  { type: 'heading', label: 'Heading', defaults: { text: 'A great title', size: '2xl' } },
  { type: 'text', label: 'Paragraph', defaults: { text: 'Write something nice here.' } },
  { type: 'button', label: 'Button', defaults: { text: 'Click me', href: '#', variant: 'primary' } },
  { type: 'image', label: 'Image', defaults: { src: 'https://picsum.photos/900/300', alt: 'Random', radius: 'lg' } },
];

function BlockNode({ data }) {
  // Preview using our RenderBlock
  return (
    <div className="rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 min-w-[160px]">
      <RenderBlock item={{ type: data?.type, props: data?.props || {} }} />
    </div>
  );
}

const nodeTypes = { block: BlockNode };

export default function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const wrapperRef = useRef(null);

  // Import from URL if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const dataParam = url.searchParams.get('data') || window.location.hash.replace(/^#data=/, '');
    if (dataParam) {
      try {
        const json = decompressFromEncodedURIComponent(dataParam);
        if (json) {
          const parsed = JSON.parse(json);
          setNodes(parsed.nodes || []);
          setEdges(parsed.edges || []);
        }
      } catch {}
    }
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const bounds = wrapperRef.current?.getBoundingClientRect();
      const payload = event.dataTransfer.getData('application/reactflow');
      if (!payload || !rfInstance || !bounds) return;
      try {
        const { type, defaults } = JSON.parse(payload);
        const position = rfInstance.project({
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        });
        const id = uid();
        const newNode = {
          id,
          type: 'block',
          position,
          data: { type, props: { ...defaults } },
        };
        setNodes((nds) => nds.concat(newNode));
      } catch {}
    },
    [rfInstance, setNodes]
  );

  const onPaletteDragStart = (e, type, defaults) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ type, defaults }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const exportJSON = () => JSON.stringify({ nodes, edges }, null, 2);

  const generateHTML = () => {
    // naive: order by y then x
    const ordered = [...nodes].sort((a, b) => (a.position.y - b.position.y) || (a.position.x - b.position.x));
    const htmlBlocks = ordered
      .filter((n) => n.type === 'block')
      .map((n) => renderStaticHTML({ type: n.data?.type, props: n.data?.props }))
      .join('\n');
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Exported Page</title>
  <style>
    :root { --border: #e5e7eb; }
    body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #0f172a; background: #f8fafc; }
    .container { max-width: 960px; margin: 40px auto; padding: 0 16px; }
    .btn { display:inline-block; padding:8px 12px; background:#2563eb; color:#fff; border-radius:10px; text-decoration:none; }
    img { display:block; max-width:100%; height:auto; border-radius:10px; }
    h2 { margin: 0 0 8px 0; }
    p { margin: 0 0 8px 0; }
  </style>
  </head>
<body>
  <main class="container">
${htmlBlocks}
  </main>
</body>
</html>`;
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    zip.file('flow.json', exportJSON());
    zip.file('index.html', generateHTML());
    zip.file('README.md', `# Exported Webbuilder Flow\n\nOpen index.html in a browser.\n`);
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'webbuilder-export.zip');
  };

  const makeShareLink = () => {
    const data = exportJSON();
    const enc = compressToEncodedURIComponent(data);
    const url = new URL(window.location.href);
    url.pathname = '/flow';
    url.searchParams.set('data', enc);
    return url.toString();
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_340px]">
      {/* Palette */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-slate-700">Flow Components</h2>
        <Divider className="my-3" />
        <div className="grid gap-2">
          {PALETTE.map((p) => (
            <button
              key={p.type}
              draggable
              onDragStart={(e) => onPaletteDragStart(e, p.type, p.defaults)}
              onClick={() => setNodes((nds) => nds.concat({ id: uid(), type: 'block', position: { x: 80, y: 80 + nds.length * 40 }, data: { type: p.type, props: { ...p.defaults } } }))}
              className="text-left rounded-xl border border-[hsl(var(--border))] bg-white/70 hover:bg-white px-3 py-2 text-sm cursor-grab"
              title="Drag into canvas or click to add"
            >
              {p.label}
            </button>
          ))}
        </div>
        <Divider className="my-3" />
        <div className="flex items-center gap-2">
          <Button onClick={() => { setNodes([]); setEdges([]); }}>Clear</Button>
        </div>
      </Card>

      {/* Canvas */}
      <Card className="p-0 min-h-[70vh]">
        <div ref={wrapperRef} className="h-[70vh] rounded-xl overflow-hidden" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            fitView
            nodeTypes={nodeTypes}
          >
            <Background gap={24} />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </Card>

      {/* Export */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-slate-700">Export</h2>
        <Divider className="my-3" />
        <div className="grid gap-2">
          <Button onClick={() => {
            const data = exportJSON();
            navigator.clipboard?.writeText(data);
            alert('Flow JSON copied to clipboard');
          }}>Copy JSON</Button>
          <Button onClick={downloadZip}>Download Code (ZIP)</Button>
          <Button onClick={() => {
            const link = makeShareLink();
            navigator.clipboard?.writeText(link);
            alert('Share link copied to clipboard');
          }}>Create Share Link</Button>
        </div>
        <Divider className="my-3" />
        <textarea readOnly className="w-full h-40 p-2 rounded-xl outline-none bg-white text-xs font-mono" value={exportJSON()} />
      </Card>
    </div>
  );
}

function renderStaticHTML(item) {
  if (item.type === "heading") return `<h2>${escapeHtml(item.props?.text || "Heading")}</h2>`;
  if (item.type === "text") return `<p>${escapeHtml(item.props?.text || "Paragraph")}</p>`;
  if (item.type === "button") return `<a href="${escapeAttr(item.props?.href || "#")}" class="btn">${escapeHtml(item.props?.text || "Button")}</a>`;
  if (item.type === "image") return `<img src="${escapeAttr(item.props?.src || "https://picsum.photos/800/300")}" alt="${escapeAttr(item.props?.alt || "Image")}"/>`;
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
function escapeAttr(str) { return escapeHtml(str).replaceAll("`", "&#x60;"); }
