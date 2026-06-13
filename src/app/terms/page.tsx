import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | CARWO GOBSAN",
  description: "Terms and conditions for using CARWO GOBSAN e-commerce platform",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold text-[#111111] mb-8 text-center">
          Terms & Conditions
        </h1>
        <p className="text-[#666666] text-center mb-12">Shuruudaha & Xeerarka</p>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-[#111111] mb-3">1. General Terms</h2>
            <p className="text-[#666666]">
              By accessing and using CARWO GOBSAN, you agree to these terms. 
              We reserve the right to modify these terms at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#111111] mb-3">2. Orders & Payments</h2>
            <p className="text-[#666666]">
              All orders are subject to availability. Prices are listed in USD and may 
              be converted to local currency at checkout. Cash on delivery is available 
              within Hargeisa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#111111] mb-3">3. Delivery</h2>
            <p className="text-[#666666]">
              Free delivery is available within Hargeisa city limits. Delivery times 
              vary by location. We are not responsible for delays caused by circumstances 
              beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#111111] mb-3">4. Returns & Refunds</h2>
            <p className="text-[#666666]">
              Products may be returned within 7 days of delivery if defective or not 
              as described. Refunds are processed within 5 business days after inspection.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#111111] mb-3">5. Contact</h2>
            <p className="text-[#666666]">
              For questions about these terms, contact us via WhatsApp at{" "}
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
