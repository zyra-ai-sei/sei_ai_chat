import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { SEO } from "@/components/common/SEO";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen pt-12 bg-[#0D0C11] text-white font-['Figtree',sans-serif]">
      <SEO
        title="Cookie Policy"
        description="Learn about how Zyra uses cookies and similar technologies to improve your experience."
      />
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-black mb-4 font-['Satoshi',sans-serif]">
          Cookie Policy
        </h1>
        <p className="text-gray-400 mb-12 italic">
          Last Updated: February 11, 2026
        </p>

        {/* Intro */}
        <section className="mb-12">
          <p className="text-gray-400 leading-relaxed">
            This Cookie Policy explains what cookies are, how Zyra uses them,
            and your choices regarding their use. By continuing to use our
            platform, you consent to the use of cookies as described in this
            policy.
          </p>
        </section>

        {/* What Are Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
          <p className="text-gray-400 leading-relaxed">
            Cookies are small text files stored on your device (computer, tablet,
            or mobile) when you visit a website. They help websites remember your
            preferences, understand how you interact with the site, and improve
            your overall experience. Cookies do not contain personal information
            like your private keys or passwords.
          </p>
        </section>

        {/* Types of Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Types of Cookies We Use</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Zyra uses three categories of cookies:
          </p>

          {/* Necessary */}
          <div className="mb-6 p-5 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-blue-400"
                >
                  <path
                    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="m9 12 2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg">
                Necessary Cookies
              </h3>
              <span className="ml-auto text-xs text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                Always Active
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              These cookies are essential for the platform to function properly.
              They enable core features such as wallet connection state
              persistence, session management, and security. Without these
              cookies, the platform cannot operate as intended.
            </p>
            <ul className="list-disc list-inside text-gray-500 mt-3 space-y-1 text-sm ml-2">
              <li>Authentication state &amp; wallet session</li>
              <li>Security tokens &amp; CSRF protection</li>
              <li>Cookie consent preferences</li>
            </ul>
          </div>

          {/* Functional */}
          <div className="mb-6 p-5 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-purple-400"
                >
                  <path
                    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg">
                Functional Cookies
              </h3>
              <span className="ml-auto text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                Optional
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              These cookies enable enhanced features and personalization. They
              remember your preferences so we can provide a tailored experience
              when you return.
            </p>
            <ul className="list-disc list-inside text-gray-500 mt-3 space-y-1 text-sm ml-2">
              <li>UI preferences (theme, layout settings)</li>
              <li>Chat context &amp; conversation history</li>
              <li>Language &amp; regional preferences</li>
              <li>Recently viewed tokens &amp; strategies</li>
            </ul>
          </div>

          {/* Performance */}
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-cyan-400"
                >
                  <path
                    d="M22 12h-4l-3 9L9 3l-3 9H2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg">
                Performance Cookies
              </h3>
              <span className="ml-auto text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                Optional
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              These cookies help us understand how visitors interact with Zyra by
              collecting anonymous usage data. This allows us to identify areas
              for improvement and optimize performance.
            </p>
            <ul className="list-disc list-inside text-gray-500 mt-3 space-y-1 text-sm ml-2">
              <li>Page load times &amp; error tracking</li>
              <li>Feature usage analytics</li>
              <li>Navigation patterns &amp; session duration</li>
            </ul>
          </div>
        </section>

        {/* Managing Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            3. Managing Your Cookie Preferences
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            You can manage your cookie preferences at any time:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
            <li>
              <strong className="text-gray-300">Via our cookie banner:</strong>{" "}
              When you first visit Zyra, you'll be shown a cookie consent banner
              where you can accept all, customize, or reject non-essential
              cookies.
            </li>
            <li>
              <strong className="text-gray-300">Browser settings:</strong> Most
              browsers allow you to block or delete cookies through their
              settings. Note that blocking essential cookies may impair platform
              functionality.
            </li>
            <li>
              <strong className="text-gray-300">Clear local storage:</strong>{" "}
              You can clear your browser's local storage to remove all saved
              preferences and cookie consent data.
            </li>
          </ul>
        </section>

        {/* Third-Party Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Some cookies may be set by third-party services that appear on our
            pages. We do not control these cookies. Third-party services we use
            may include:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
            <li>Google Analytics — for anonymous usage statistics</li>
            <li>Wallet providers (Privy) — for authentication state</li>
            <li>
              Blockchain RPC providers — for caching network request data
            </li>
          </ul>
        </section>

        {/* Data Retention */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
          <p className="text-gray-400 leading-relaxed">
            Cookie lifetimes vary depending on their purpose. Session cookies are
            deleted when you close your browser. Persistent cookies remain on
            your device for a set period or until you delete them manually. Our
            consent preferences are stored locally and do not expire unless you
            clear your browser data.
          </p>
        </section>

        {/* Updates */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            6. Changes to This Policy
          </h2>
          <p className="text-gray-400 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes
            in technology, legislation, or our data practices. Any changes will
            be posted on this page with an updated "Last Updated" date. We
            encourage you to review this policy periodically.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
          <p className="text-gray-400 leading-relaxed">
            If you have any questions about our use of cookies, please contact us
            at{" "}
            <a
              href="mailto:admin@zyrachat.app"
              className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2"
            >
              admin@zyrachat.app
            </a>
            .
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
