export const metadata = {
  title: "Terms of Service | bootNode",
};

export default function TermsPage() {
  return (
    <div className="flex-1 bg-white p-6 sm:p-12 lg:p-24 font-sans">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8 font-bold uppercase tracking-wider">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p>
            Please read these Terms of Service ("Terms") carefully before using the bootNode website and scaffolding services.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-10">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-10">2. Description of Service</h2>
          <p>
            bootNode provides an automated platform for scaffolding software projects, including web and mobile applications ("Service"). We process your configuration choices to generate boilerplate code.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-10">3. Generated Code Rights</h2>
          <p>
            You retain all rights, title, and interest in and to the code generated through your use of the Service. bootNode claims no ownership over the output scaffolds. The open source frameworks included in the scaffolds belong to their respective creators under their respective open-source licenses.
          </p>
        </div>
      </div>
    </div>
  );
}
