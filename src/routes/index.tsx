import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, LayoutDashboard, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { ResponsibleAI } from "@/components/ResponsibleAI";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkAI" },
      {
        name: "description",
        content:
          "Your AI workplace productivity dashboard — draft emails, summarize meetings, and plan your day.",
      },
    ],
  }),
  component: DashboardPage,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Draft polished workplace emails in any tone — formal, informal, or persuasive.",
    accent: "from-primary/10 to-primary/5",
  },
  {
    to: "/summarizer",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    description: "Turn raw notes into key points, decisions, action items, and owners.",
    accent: "from-primary/10 to-primary/5",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    description: "Prioritize tasks and meetings into a focused daily or weekly schedule.",
    accent: "from-primary/10 to-primary/5",
  },
] as const;

function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        icon={LayoutDashboard}
        title="Welcome back"
        description="Pick a tool to get started — your AI workplace assistant is ready."
      />

      <div className="mb-8 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Work smarter, not harder</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Three focused AI tools to save you hours every week. Choose one below to begin.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="h-full border-border/60 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
              <CardContent className={`flex h-full flex-col gap-4 bg-gradient-to-br ${t.accent} p-6`}>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <t.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{t.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{t.description}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-primary">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ResponsibleAI />
      </div>
    </div>
  );
}

