import { ShieldCheck, AlertTriangle, EyeOff, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
  {
    icon: AlertTriangle,
    title: "AI can be wrong",
    body: "Generated content may contain inaccurate, outdated, or fabricated information.",
  },
  {
    icon: ShieldCheck,
    title: "Always verify outputs",
    body: "Review and edit AI suggestions before sending, sharing, or acting on them.",
  },
  {
    icon: EyeOff,
    title: "Protect sensitive data",
    body: "Don't paste passwords, customer PII, financials, or confidential information.",
  },
  {
    icon: UserCheck,
    title: "Human judgment first",
    body: "AI assists your work — it doesn't replace professional or ethical judgment.",
  },
];

export function ResponsibleAI({ compact = false }: { compact?: boolean }) {
  return (
    <Card className="animate-fade-in border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Responsible AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={compact ? "grid gap-3 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"}>
          {items.map((i) => (
            <div key={i.title} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <i.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{i.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{i.body}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
