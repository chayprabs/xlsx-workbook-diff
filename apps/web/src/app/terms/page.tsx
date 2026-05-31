import { LegalBanner } from "@/components/LegalBanner";

export const metadata = {
  title: "Terms & Conditions — SheetDiff",
  description: "Terms governing use of the SheetDiff XLSX workbook comparison service.",
};

const EFFECTIVE = "May 31, 2026";
const OPERATOR = "Chaitanya Prabuddha";
const CONTACT_URL = "https://www.chaitanyaprabuddha.com";
const REPO = "https://github.com/chayprabs/xlsx-workbook-diff";

export default function TermsPage() {
  return (
    <article className="prose prose-neutral max-w-3xl mx-auto bg-white rounded-xl border border-[var(--border)] p-8 space-y-6">
      <div>
        <h1>Terms &amp; Conditions</h1>
        <p className="text-sm text-[var(--muted)] !mt-1">Effective date: {EFFECTIVE}</p>
      </div>

      <LegalBanner />

      <section>
        <h2>1. Agreement</h2>
        <p>
          These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of SheetDiff
          (the &quot;Service&quot;), including the website, API, downloadable outputs, and related
          open-source software at {REPO}. The Service is operated by {OPERATOR} (&quot;we&quot;,
          &quot;us&quot;, &quot;Operator&quot;).
        </p>
        <p>
          By accessing or using the Service, you agree to these Terms and our{" "}
          <a href="/privacy">Privacy Policy</a>. If you do not agree, you must not use the Service.
        </p>
      </section>

      <section>
        <h2>2. Eligibility</h2>
        <p>
          You must be at least 18 years old (or the age of legal majority where you live) and able to
          form a binding contract. You may not use the Service if you are barred under applicable law
          or if your use would violate any law, regulation, or third-party right.
        </p>
      </section>

      <section>
        <h2>3. The Service</h2>
        <p>
          SheetDiff compares Microsoft Excel <code>.xlsx</code> workbooks and produces diff results
          and reports. We may change, suspend, or discontinue any part of the Service at any time
          without liability.
        </p>
        <p>
          <strong>No professional advice.</strong> Output is generated automatically for general
          information only. It is not accounting, audit, tax, legal, investment, or compliance
          advice. You alone decide whether and how to rely on any output.
        </p>
      </section>

      <section>
        <h2>4. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Upload unlawful, infringing, defamatory, harassing, or malicious content;</li>
          <li>Upload malware or attempt to disrupt, probe, or overload the Service;</li>
          <li>Reverse engineer the hosted Service except where applicable law expressly permits;</li>
          <li>Use the Service to process personal data you are not authorized to process;</li>
          <li>Scrape or automate abuse of the Service beyond reasonable personal or internal use;</li>
          <li>Misrepresent diff results as human-reviewed or guaranteed accurate.</li>
        </ul>
        <p>
          We may refuse, remove, or limit access for conduct we reasonably believe violates these
          Terms or poses risk to others or to the Service.
        </p>
      </section>

      <section>
        <h2>5. Your files and data</h2>
        <p>
          You retain ownership of workbooks and content you submit. You grant us a limited,
          non-exclusive, royalty-free license to host, process, transmit, and temporarily store your
          uploads solely to operate the Service and produce requested outputs.
        </p>
        <p>
          Do not upload confidential, regulated, or highly sensitive information unless you accept the
          risks of transmission and processing (see Privacy Policy). You are responsible for backups,
          redaction, and compliance with laws that apply to your data (including employment, health,
          financial, and personal-data laws).
        </p>
      </section>

      <section>
        <h2>6. Open-source software</h2>
        <p>
          Source code is offered under the GNU Affero General Public License v3.0 (&quot;AGPL-3.0&quot;).
          Your use, modification, and distribution of the software are governed by AGPL-3.0 in
          addition to these Terms for the hosted Service. A copy of the license is in the{" "}
          <a href={REPO}>repository</a> file <code>LICENSE</code>.
        </p>
        <p>
          If you run a modified version as a network service, AGPL-3.0 may require you to offer
          corresponding source to users who interact with it over a network.
        </p>
      </section>

      <section>
        <h2>7. Disclaimer of warranties</h2>
        <p className="uppercase text-sm leading-relaxed">
          THE SERVICE AND ALL OUTPUTS ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
          WITHOUT WARRANTY OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WITHOUT
          LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE,
          NON-INFRINGEMENT, ACCURACY, COMPLETENESS, OR THAT THE SERVICE WILL BE UNINTERRUPTED,
          SECURE, OR ERROR-FREE. SOME JURISDICTIONS DO NOT ALLOW EXCLUSION OF IMPLIED WARRANTIES; IN
          THOSE JURISDICTIONS, EXCLUSIONS APPLY TO THE MAXIMUM EXTENT PERMITTED BY LAW.
        </p>
      </section>

      <section>
        <h2>8. Limitation of liability</h2>
        <p className="uppercase text-sm leading-relaxed">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE OPERATOR,
          CONTRIBUTORS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
          EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, BUSINESS
          INTERRUPTION, OR PROCUREMENT OF SUBSTITUTE SERVICES, ARISING OUT OF OR RELATED TO THE
          SERVICE OR THESE TERMS, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE),
          STRICT LIABILITY, OR ANY OTHER THEORY, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>
        <p className="uppercase text-sm leading-relaxed">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS
          RELATING TO THE SERVICE IN ANY TWELVE (12) MONTH PERIOD SHALL NOT EXCEED THE GREATER OF
          (A) ONE HUNDRED U.S. DOLLARS (USD $100) OR (B) THE AMOUNT YOU PAID US FOR THE SERVICE IN
          THAT PERIOD (TYPICALLY ZERO FOR THE FREE SERVICE). THE FREE SERVICE IS PROVIDED WITHOUT
          CHARGE; THIS CAP REFLECTS THAT LIMITED COMMERCIAL EXPOSURE.
        </p>
        <p>
          Some jurisdictions do not allow limitation of certain damages; in those places, the above
          limits apply only to the extent permitted.
        </p>
      </section>

      <section>
        <h2>9. Indemnification</h2>
        <p>
          To the maximum extent permitted by law, you agree to defend, indemnify, and hold harmless
          the Operator and contributors from and against any claims, damages, losses, liabilities,
          costs, and expenses (including reasonable attorneys&apos; fees) arising from: (a) your use
          of the Service; (b) your content or uploads; (c) your violation of these Terms or
          applicable law; or (d) your reliance on or distribution of diff outputs.
        </p>
      </section>

      <section>
        <h2>10. International use and export</h2>
        <p>
          The Service may be accessed globally. You are responsible for compliance with local laws.
          You represent that you are not located in a country subject to comprehensive embargo or
          sanctions and are not a prohibited party under applicable export-control laws.
        </p>
      </section>

      <section>
        <h2>11. Third-party services</h2>
        <p>
          Links to third-party sites (for example GitHub or social profiles) are provided for
          convenience. We do not control and are not responsible for third-party content or
          practices.
        </p>
      </section>

      <section>
        <h2>12. Changes</h2>
        <p>
          We may update these Terms by posting a revised version with a new effective date. Material
          changes will be posted on this page. Continued use after the effective date constitutes
          acceptance where permitted by law.
        </p>
      </section>

      <section>
        <h2>13. Termination</h2>
        <p>
          You may stop using the Service at any time. We may suspend or terminate access if we
          reasonably believe you violated these Terms. Sections that by nature should survive
          (disclaimers, limitation of liability, indemnity, governing law) survive termination.
        </p>
      </section>

      <section>
        <h2>14. Governing law and disputes</h2>
        <p>
          These Terms are governed by the laws of India, without regard to conflict-of-law rules
          that would apply another jurisdiction&apos;s laws. Subject to mandatory consumer
          protections in your country of residence that cannot be waived, you agree that courts
          located in India shall have exclusive jurisdiction over disputes arising from these Terms
          or the Service.
        </p>
        <p>
          Before filing a claim, you agree to contact us in good faith to seek informal resolution.
          Nothing in this section prevents either party from seeking injunctive relief for
          intellectual-property or security issues.
        </p>
        <p>
          <strong>EU/UK consumers:</strong> If you are a consumer in the European Union or United
          Kingdom, you may also have mandatory rights under local law that these Terms cannot
          override.
        </p>
      </section>

      <section>
        <h2>15. General</h2>
        <ul>
          <li>
            <strong>Severability:</strong> If any provision is unenforceable, the remainder stays in
            effect.
          </li>
          <li>
            <strong>No waiver:</strong> Failure to enforce a provision is not a waiver.
          </li>
          <li>
            <strong>Assignment:</strong> You may not assign these Terms without consent; we may
            assign them in connection with a reorganization or sale.
          </li>
          <li>
            <strong>Entire agreement:</strong> These Terms and the Privacy Policy are the entire
            agreement regarding the hosted Service.
          </li>
        </ul>
      </section>

      <section>
        <h2>16. Contact</h2>
        <p>
          {OPERATOR} — <a href={CONTACT_URL}>{CONTACT_URL}</a> — or via{" "}
          <a href={REPO}>GitHub issues</a> for the SheetDiff repository.
        </p>
      </section>

      <p>
        <a href="/">← Back to SheetDiff</a>
      </p>
    </article>
  );
}
