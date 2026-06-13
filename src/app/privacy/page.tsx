import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CARWO GOBSAN",
  description: "Privacy policy for CARWO GOBSAN e-commerce platform",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold text-[#111111] mb-8 text-center">
          Privacy Policy
        </h1>
        <p className="text-[#666666] text-center mb-12">Siyaasadda Qarsoonida</p>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-[#111111] mb-3">1. Information We Collect</h2>
            <p className="text-[#666666]">
              We collect your name, phone number, and delivery address to process orders. 
              Payment information is handled securely and never stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#111111] mb-3">2. How We Use Your Data</h2>
            <p className="text-[#666666]">
              Your information is used solely for order fulfillment, delivery coordination, 
              and customer support. We do not sell or share your data with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#111111] mb-3">3. Data Security</h2>
            <p className="text-[#666666]">
              We implement industry-standard security measures to protect your personal 
              information. All communications are encrypted where possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#111111] mb-3">4. Your Rights</h2>
            <p className="text-[#666666]">
              You may request deletion of your account and associated data at any time 
              by contacting us via WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#111111] mb-3">5. Contact</h2>
            <p className="text-[#666666]">
              For privacy-related questions, contact us via WhatsApp at{" "}
              <a href="https://wa.me/252633800999" className="text-[#E60000] hover:underline">
                +252 63 3800999
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
