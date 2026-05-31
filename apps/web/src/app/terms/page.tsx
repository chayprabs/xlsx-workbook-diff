export const metadata = { title: "Terms & Conditions — SheetDiff" };

export default function TermsPage() {
  return (
    <article className="prose prose-neutral max-w-3xl mx-auto bg-white rounded-xl border border-[var(--border)] p-8">
      <h1>Terms &amp; Conditions</h1>
      <p className="text-sm text-[var(--muted)]">Last updated: May 31, 2026</p>
      <h2>Acceptance</h2>
      <p>
        By using SheetDiff you agree to these terms. If you do not agree, do not use the service.
      </p>
      <h2>Service provided &quot;as is&quot;</h2>
      <p>
        SheetDiff is provided without warranty of any kind, express or implied, including but not
        limited to accuracy of diff results, fitness for a particular purpose, or uninterrupted
        availability. Diff output is for informational purposes only and is not professional,
        financial, legal, or audit advice.
      </p>
      <h2>Your responsibility</h2>
      <p>
        You are solely responsible for the workbooks you upload and for verifying results before
        relying on them in business, compliance, or legal contexts. Do not upload files containing
        secrets you cannot afford to expose to the server operator.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by applicable law, the authors and contributors shall not be
        liable for any indirect, incidental, special, consequential, or punitive damages, or any loss
        of profits, data, or goodwill arising from use of SheetDiff, even if advised of the
        possibility of such damages.
      </p>
      <h2>Open source license</h2>
      <p>
        Source code is licensed under AGPL-3.0. Use and distribution of the software are governed by
        that license in addition to these terms for the hosted service.
      </p>
      <h2>Changes</h2>
      <p>We may update these terms; continued use after changes constitutes acceptance.</p>
      <p>
        <a href="/">← Back to SheetDiff</a>
      </p>
    </article>
  );
}
