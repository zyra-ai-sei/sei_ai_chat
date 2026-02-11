import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

const Privacy = () => {
  return (
    <div className="min-h-screen pt-12 bg-[#0D0C11] text-white font-['Figtree',sans-serif]">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-black mb-8 font-['Satoshi',sans-serif]">Privacy Policy</h1>
        <p className="text-gray-400 mb-8 italic">Last Updated: February 11, 2026</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Zyra is designed to be privacy-respecting. We collect minimal data necessary to provide our services:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
            <li>Public Wallet Addresses: To facilitate blockchain interactions and display your portfolio.</li>
            <li>Usage Data: Information on how you interact with the app, including features used and session duration.</li>
            <li>Chat Context: Temporary storage of chat interactions to provide context-aware AI responses.</li>
            <li>Device Information: Browser type, operating system, and IP address for security and analytics purposes.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            The data we collect is used to:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
            <li>Operate and maintain the Zyra platform.</li>
            <li>Improve and personalize your experience.</li>
            <li>Understand and analyze how you use our service to develop new features.</li>
            <li>Detect and prevent fraudulent or illegal activity.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
          <p className="text-gray-400 leading-relaxed">
            We implement industry-standard security measures to protect your data. However, remember that no method of transmission over the internet or method of electronic storage is 100% secure. Specifically, we never ask for or store your private keys or seed phrases.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Third-Party Services</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            We may use third-party services that collect information used to identify you:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
            <li>Blockchain Networks (e.g., Sei Network)</li>
            <li>Wallet Connectors (e.g., Privy, Wagmi)</li>
            <li>Analytics Providers (e.g., Google Analytics)</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Cookies</h2>
          <p className="text-gray-400 leading-relaxed">
            Zyra uses cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Your Data Rights</h2>
          <p className="text-gray-400 leading-relaxed">
            Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete the information we have on you. Since we do not store personal identities linked to wallet addresses, our ability to identify specific users is limited.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
          <p className="text-gray-400 leading-relaxed">
            If you have any questions about this Privacy Policy, you can contact us at admin@zyrachat.app.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
