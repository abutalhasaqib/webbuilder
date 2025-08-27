"use client";

import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Toolbar } from "@/components/ui/Misc";
import Link from "next/link";
import FlowBuilder from "@/components/flow/FlowBuilder";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

export default function FlowPage() {
  return (
    <div className="min-h-screen">
      <Toolbar>
        <Container className="flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))]" />
            <div className="font-semibold">Webbuilder Flow</div>
            <span className="hidden text-xs text-slate-500 sm:inline">React Flow builder</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Link href="/builder" className="btn btn-ghost">Blocks Builder</Link>
            <Link href="/" className="btn btn-ghost">Home</Link>
          </div>
        </Container>
      </Toolbar>

      <Container className="py-6 px-4 sm:px-6 lg:px-8">
        <FlowBuilder />
      </Container>
    </div>
  );
}
