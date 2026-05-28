import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Sparkles } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { LoadingShimmer, ResultCard } from "@/components/ResultCard";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkAI" },
      {
        name: "description",
        content:
          "List your tasks and let AI build a prioritized daily schedule with time blocks and tips.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const onGenerate = async () => {
    if (!tasks.trim()) {
      toast.error("Please enter at least one task.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fn({ data: { tasks } });
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
        description="List your tasks — AI will prioritize them and build a focused daily schedule."
      />

      <Card className="border-border/60 shadow-sm">
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="tasks">Your tasks</Label>
            <Textarea
              id="tasks"
              placeholder={"e.g.\n- Finish Q3 report\n- Call client about renewal\n- Review 3 PRs\n- Prep slides for Thursday"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              rows={10}
              className="resize-y"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={onGenerate} disabled={loading} size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              {loading ? "Planning..." : "Build My Day"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        {loading && <LoadingShimmer label="Prioritizing tasks..." />}
        {!loading && result && <ResultCard title="Your Prioritized Schedule" text={result} />}
      </div>
    </div>
  );
}
