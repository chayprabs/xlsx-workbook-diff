import { LegalBanner } from "@/components/LegalBanner";

export const metadata = {
  title: "Privacy Policy — SheetDiff",
  description: "How SheetDiff handles data when you compare Excel workbooks online.",
};

const EFFECTIVE = "May 31, 2026";
const OPERATOR = "Chaitanya Prabuddha";
const CONTACT_URL = "https://www.chaitanyaprabuddha.com";
const REPO = "https://github.com/chayprabs/xlsx-workbook-diff";

export default function PrivacyPage() {
  return (
    <article className="prose prose-neutral max-w-3xl mx-auto bg-white rounded-xl border border-[var(--border)] p-8 space-y-6">
      <div>
        <h1>Privacy Policy</h1>
        <p className="text-sm text-[var(--muted)] !mt-1">Effective date: {EFFECTIVE}</p>
      </div>

      <LegalBanner />

      <section>
        <h2>1. Who we are</h2>
        <p>
          This Privacy Policy explains how {OPERATOR} (&quot;we&quot;, &quot;us&quot;) processes
          information when you use SheetDiff (the &quot;Service&quot;), including the public website
          and API. The open-source project is published at {REPO}.
        </p>
        <p>
          <strong>Self-hosting:</strong> If you or your organization deploy SheetDiff on your own
          servers, your organization is the data controller for uploads on that deployment. This
          policy primarily describes the Operator-hosted Service.
        </p>
      </section>

      <section>
        <h2>2. Scope</h2>
        <p>
          This policy applies to visitors and users of the hosted Service. It does not apply to
          third-party websites we link to (for example GitHub). Your use of the Service is also
          subject to our <a href="/terms">Terms &amp; Conditions</a>.
        </p>
      </section>

      <section>
        <h2>3. Information we process</h2>
        <table className="text-sm w-full">
          <thead>
            <tr>
              <th className="text-left">Category</th>
              <th className="text-left">Examples</th>
              <th className="text-left">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Uploaded files</td>
              <td>XLSX workbooks you submit for comparison</td>
              <td>Provide diff results and downloadable reports</td>
            </tr>
            <tr>
              <td>Technical data</td>
              <td>IP address, request metadata, timestamps, errors</td>
              <td>Security, abuse prevention, operations</td>
            </tr>
            <tr>
              <td>Generated artifacts</td>
              <td>Diff workbooks, HTML/JSON reports (temporary)</td>
              <td>Deliver outputs you request</td>
            </tr>
          </tbody>
        </table>
        <p>
          We design the application <strong>not</strong> to log cell values, formulas, or workbook
          filenames in routine application logs. Standard server or hosting logs may still record IP
          addresses and HTTP metadata.
        </p>
      </section>

      <section>
        <h2>4. Legal bases (EEA/UK)</h2>
        <p>If you are in the European Economic Area or United Kingdom, we rely on:</p>
        <ul>
          <li>
            <strong>Contract / steps at your request</strong> — processing uploads to perform the
            comparison you ask for;
          </li>
          <li>
            <strong>Legitimate interests</strong> — securing and improving the Service, preventing
            abuse, and defending legal claims, balanced against your rights;
          </li>
          <li>
            <strong>Legal obligation</strong> — where we must comply with law.
          </li>
        </ul>
        <p>We do not require an account for basic use of the public playground.</p>
      </section>

      <section>
        <h2>5. Retention</h2>
        <p>
          Uploaded files and generated artifacts are stored in ephemeral per-job directories on the
          server. By default they are deleted after the artifact time-to-live (typically{" "}
          <strong>one hour</strong>, configurable by the Operator via{" "}
          <code>ARTIFACT_TTL_SECONDS</code>). We do not intend to retain workbook content for
          long-term storage on the hosted Service.
        </p>
        <p>
          Aggregated or technical logs may be retained longer by hosting providers according to
          their policies.
        </p>
      </section>

      <section>
        <h2>6. Security</h2>
        <p>
          We use reasonable technical measures (HTTPS where configured, size limits, ephemeral
          storage, access controls on infrastructure). <strong>No method of transmission or storage
          is 100% secure.</strong> You use the Service at your own risk. Do not upload data you
          cannot afford to expose.
        </p>
      </section>

      <section>
        <h2>7. Sharing and sale of data</h2>
        <ul>
          <li>We do <strong>not</strong> sell your personal information.</li>
          <li>We do <strong>not</strong> use third-party advertising trackers in the web application.</li>
          <li>
            We may share data with infrastructure providers (hosting, CDN) solely to operate the
            Service, subject to their terms.
          </li>
          <li>
            We may disclose information if required by law, court order, or to protect rights,
            safety, and security.
          </li>
        </ul>
      </section>

      <section>
        <h2>8. International transfers</h2>
        <p>
          If you access the Service from outside the country where servers run, your data may be
          processed in that country or where our hosting providers operate. Laws in those locations
          may differ from yours.
        </p>
      </section>

      <section>
        <h2>9. Your rights</h2>
        <p>Depending on where you live, you may have rights to:</p>
        <ul>
          <li>Access, correct, or delete personal data we hold about you;</li>
          <li>Object to or restrict certain processing;</li>
          <li>Data portability;</li>
          <li>Withdraw consent where processing is consent-based;</li>
          <li>Lodge a complaint with a supervisory authority (EEA/UK).</li>
        </ul>
        <p>
          Because uploads are short-lived, deletion often occurs automatically when the job TTL
          expires. To exercise rights, contact us using the details below with enough information to
          identify your request (approximate time, job ID if available).
        </p>
      </section>

      <section>
        <h2>10. California residents (CCPA/CPRA)</h2>
        <p>
          If you are a California resident, you may have rights to know, delete, and correct
          personal information, and to opt out of sale or sharing. We do not sell or share personal
          information for cross-context behavioral advertising as defined under California law. To
          submit a request, contact us below.
        </p>
      </section>

      <section>
        <h2>11. Children</h2>
        <p>
          The Service is not directed to children under 18. We do not knowingly collect personal
          information from children. If you believe a child has provided data, contact us and we
          will take reasonable steps to delete it.
        </p>
      </section>

      <section>
        <h2>12. Changes</h2>
        <p>
          We may update this policy by posting a new effective date on this page. Continued use after
          changes means you accept the updated policy where permitted by law.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          Data protection inquiries: {OPERATOR} — <a href={CONTACT_URL}>{CONTACT_URL}</a> — or{" "}
          <a href={REPO}>GitHub issues</a> on the SheetDiff repository.
        </p>
      </section>

      <p>
        <a href="/">← Back to SheetDiff</a>
      </p>
    </article>
  );
}
