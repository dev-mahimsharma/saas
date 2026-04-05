export const metadata = {
  title: "Support | bootNode",
};

export default function SupportPage() {
  return (
    <div className="flex-1 bg-white p-6 sm:p-12 lg:p-24 font-sans">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Support & Help Center</h1>
        <div className="text-slate-600 text-lg">
          <p className="mb-8">
            We're here to help you get the most out of your bootNode scaffolding experience. If you're running into issues or have questions about a specific stack, reach out to our team.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community Discord</h3>
              <p className="text-sm mb-6">Join our community of developers to ask questions, share your projects, and get help from the bootNode team.</p>
              <button className="bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-700 transition">Join Discord</button>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Email Support</h3>
              <p className="text-sm mb-6">For Pro Architect users or enterprise inquiries, contact our direct support team for priority assistance.</p>
              <button className="bg-slate-900 text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-slate-800 transition">Contact Us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
