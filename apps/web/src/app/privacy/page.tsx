export const metadata = { title: "Privacy Policy — SheetDiff" };

export default function PrivacyPage() {
  return (
    <article className="prose prose-neutral max-w-3xl mx-auto bg-white rounded-xl border border-[var(--border)] p-8">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-[var(--muted)]">Last updated: May 31, 2026</p>
      <h2>Overview</h2>
      <p>
        SheetDiff (&quot;we&quot;, &quot;the service&quot;) is an open-source tool for comparing Excel
        workbooks. This policy describes how we handle information when you use the hosted or
        self-hosted version.
      </p>
      <h2>Files you upload</h2>
      <p>
        Uploaded workbooks are processed in ephemeral job directories on the server. Files are not
        retained beyond the artifact TTL (typically one hour) unless you self-host with different
        settings. We do not log cell contents, formulas, or file names in application logs.
      </p>
      <h2>Data we do not collect</h2>
      <ul>
        <li>No account is required for the public playground.</li>
        <li>No third-party advertising or tracking scripts are embedded in the web app.</li>
        <li>We do not sell personal data.</li>
      </ul>
      <h2>Self-hosting</h2>
      <p>
        If you deploy SheetDiff yourself, you are the data controller for uploads on your
        infrastructure. Configure retention, TLS, and access controls accordingly.
      </p>
      <h2>Contact</h2>
      <p>
        Questions:{" "}
        <a href="https://www.chaitanyaprabuddha.com">chaitanyaprabuddha.com</a> or via the GitHub
        repository issue tracker.
      </p>
      <p>
        <a href="/">← Back to SheetDiff</a>
      </p>
    </article>
  );
}
