import { createFileRoute } from "@tanstack/react-router";
import { Mail, Sparkles } from "lucide-react";
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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkAI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in any tone — formal, informal, or persuasive — powered by AI.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<"formal" | "informal" | "persuasive">("formal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const onGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for the email.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fn({ data: { topic, tone } });
      setResult(res.text);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't generate email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe what you need — AI will draft a polished email in the tone you choose."
      />

      <Card className="border-border/60 shadow-sm">
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Email topic</Label>
            <Textarea
              id="topic"
              placeholder="e.g. Ask the design team for revised mockups by Friday"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger id="tone" className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={onGenerate} disabled={loading} size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating..." : "Generate Email"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        {loading && <LoadingShimmer label="Drafting your email..." />}
        {!loading && result && <ResultCard title="Generated Email" text={result} />}
      </div>
    </div>
  );
}
