import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions - bootNode",
  description: "Legal policies and terms of service for bootNode architecture generator.",
};

export default function TermsPage() {
  return (
    <div className="flex-1 bg-[#F9FAFB] font-sans selection:bg-blue-200">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        
        {/* Header */}
        <div className="mb-16">
          <Link href="/" className="inline-block mb-6 font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer text-sm tracking-widest uppercase">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Please read these terms carefully before accessing or using the bootNode services. Last updated: April 2026.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 tracking-tight border-b border-slate-200 pb-2">
            1. Acceptance of Terms
          </h2>
          <p className="leading-relaxed mb-6">
            By accessing or using the bootNode architecture generation services ("Service", "bootNode"), you agree to be legally bound by these Terms globally. If you do not agree to these Terms, you may not access or use the Service. 
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 tracking-tight border-b border-slate-200 pb-2">
            2. Description of Service
          </h2>
          <p className="leading-relaxed mb-6">
            bootNode provides a graphical interface and associated APIs that dynamically bundle software architecture solutions, configuration files, and initial project scaffolding into downloadable `.zip` archives. bootNode constantly updates these repositories dynamically; hence we offer no guarantees of permanence for any specific package version contained within.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 tracking-tight border-b border-slate-200 pb-2">
            3. Intellectual Property Ownership
          </h2>
          <p className="leading-relaxed mb-6">
            Except for the underlying algorithm logic running our servers, <strong>you retain complete 100% intellectual property ownership</strong> over all source code generated and downloaded using bootNode. We impose absolutely zero licensing restrictions, royalties, or attribution obligations on the software repositories you create using our product. Our generated templates are implicitly licensed under standard MIT or Apache 2.0 open source tolerances.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 tracking-tight border-b border-slate-200 pb-2">
            4. User Analytics and Privacy
          </h2>
          <p className="leading-relaxed mb-6">
            Using third-party OAuth providers (Google, GitHub) grants us basic analytical access exclusively to your primary email and display name for session persistence. We do not inspect, log, or persist the contents of your generated applications or internal naming-conventions beyond aggregate anonymized stack popularity statistics.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 tracking-tight border-b border-slate-200 pb-2">
            5. Disclaimer of Warranties
          </h2>
          <p className="leading-relaxed mb-6">
            The Service and any generated code are provided strictly on an <span className="italic font-bold">"AS IS"</span> and <span className="italic font-bold">"AS AVAILABLE"</span> basis. Due to the rapidly evolving nature of JavaScript, React, and Mobile ecosystems, bootNode unequivocally disclaims all warranties—express, implied, or statutory—including but not limited to compiler accuracy, non-infringement, and merchantability.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 tracking-tight border-b border-slate-200 pb-2">
            6. Limitation of Liability
          </h2>
          <p className="leading-relaxed mb-6">
            In absolutely no event shall bootNode, its founders, technical artisans, or partners be liable for any indirect, incidental, special, consequential, or punitive damages—including without limitation loss of profits, data, source code corruption, or goodwill—arising from your use, debugging, or execution of the generated architectures in a production environment. 
          </p>

        </div>
      </div>
    </div>
  );
}
