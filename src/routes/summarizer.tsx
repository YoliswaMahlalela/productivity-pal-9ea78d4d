import { createFileRoute } from "@tanstack/react-router";
import { FileText, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { LoadingShimmer, ResultCard } from "@/components/ResultCard";
import { ResponsibleAI } from "@/components/ResponsibleAI";
import { summarizeNotes } from "@/lib/ai.functions";


export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkAI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a clean summary of key points, action items, deadlines, and responsibilities.",
      },
    ],
  }),
  component: SummarizerPage,
});

function SummarizerPage() {
  const fn = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const onGenerate = async () => {
    if (!notes.trim()) {
      toast.error("Please paste your meeting notes.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fn({ data: { notes } });
      setResult(res.text);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't summarize notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste your raw notes — AI will extract key points, action items, deadlines, and owners."
      />

      <Card className="border-border/60 shadow-sm">
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea
              id="notes"
              placeholder="Paste your meeting transcript or rough notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={12}
              className="resize-y"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={onGenerate}
              disabled={loading || !notes.trim()}
              size="lg"
              className="gap-2 transition-all"
              aria-busy={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Summarizing..." : "Summarize Notes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        {loading && <LoadingShimmer label="Extracting key points..." />}
        {!loading && result && <ResultCard title="Meeting Summary" text={result} />}
      </div>

      <div className="mt-8">
        <ResponsibleAI compact />
      </div>
    </div>
  );
}

