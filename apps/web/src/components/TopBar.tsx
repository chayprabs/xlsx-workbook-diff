import { Github, Globe } from "lucide-react";

const GITHUB_URL = "https://github.com/chayprabs/xlsx-workbook-diff";
const TWITTER_URL = "https://x.com/chayprabs";
const WEBSITE_URL = "https://www.chaitanyaprabuddha.com";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          SheetDiff
        </a>
        <nav className="flex items-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--accent)]"
            aria-label="GitHub repository"
          >
            <Github className="w-5 h-5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] hover:text-[var(--accent)]"
            aria-label="Twitter / X"
          >
            <XIcon className="w-5 h-5" />
          </a>
          <a
            href={WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] hover:text-[var(--accent)]"
            aria-label="Personal website"
          >
            <Globe className="w-5 h-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
