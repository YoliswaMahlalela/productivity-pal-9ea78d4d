import { Sparkles, Github } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AI Workplace Productivity Assistant</p>
            <p className="text-xs text-muted-foreground">A responsive workplace productivity platform</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs text-muted-foreground md:items-end">
          <p className="flex items-center gap-1.5">
            Built with
            <a
              href="https://lovable.dev"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              Lovable AI
            </a>
            and
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </p>
          <p>© {new Date().getFullYear()} WorkAI · Use AI responsibly — verify outputs before acting.</p>
        </div>
      </div>
    </footer>
  );
}
