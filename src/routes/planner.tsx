import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { LoadingShimmer, ResultCard } from "@/components/ResultCard";
import { ResponsibleAI } from "@/components/ResponsibleAI";
import { planTasks } from "@/lib/ai.functions";


export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkAI" },
      {
        name: "description",
        content:
          "List your tasks and meetings — AI builds a prioritized daily or weekly schedule with time optimization tips.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<"daily" | "weekly">("daily");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const onGenerate = async () => {
    if (!tasks.trim()) {
      toast.error("Please enter at least one task or meeting.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fn({ data: { tasks, horizon } });
      setResult(res.text);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't build your schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="List tasks and meetings — AI prioritizes them and suggests time optimizations."
      />

      <Card className="border-border/60 shadow-sm">
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="tasks">Your tasks & meetings</Label>
            <Textarea
              id="tasks"
              placeholder={"e.g.\n- 10:00 Standup (30m)\n- Finish Q3 report\n- Call client about renewal\n- Review 3 PRs\n- Prep slides for Thursday"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              rows={10}
              className="resize-y"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="horizon">Schedule horizon</Label>
              <Select value={horizon} onValueChange={(v) => setHorizon(v as typeof horizon)}>
                <SelectTrigger id="horizon" className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily schedule</SelectItem>
                  <SelectItem value="weekly">Weekly schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={onGenerate}
              disabled={loading || !tasks.trim()}
              size="lg"
              className="gap-2 transition-all"
              aria-busy={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Planning..." : "Build My Schedule"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        {loading && <LoadingShimmer label="Prioritizing and optimizing..." />}
        {!loading && result && <ResultCard title="Your Prioritized Schedule" text={result} />}
      </div>

      <div className="mt-8">
        <ResponsibleAI compact />
      </div>
    </div>
  );
}

