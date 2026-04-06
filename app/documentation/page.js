import Link from "next/link";

export const metadata = {
  title: "Documentation - bootNode",
  description: "Official documentation and guide for the bootNode architecture generator.",
};

export default function DocumentationPage() {
  return (
    <div className="flex-1 bg-[#F9FAFB] font-sans selection:bg-blue-200">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        
        {/* Header */}
        <div className="mb-16">
          <Link href="/" className="inline-block mb-6 font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer text-sm tracking-widest uppercase">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Documentation
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Everything you need to know about generating, customizing, and scaling production-ready architectures with bootNode.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 tracking-tight border-b border-slate-200 pb-2">
            1. Introduction to bootNode
          </h2>
          <p className="leading-relaxed mb-6">
            <strong>bootNode</strong> is an automated scaffolding engine designed to eliminate the repetitive boilerplate associated with starting new software projects. By parsing your design constraints, paradigm preferences, and feature requirements, bootNode dynamically outputs a fully structured, production-ready codebase.
          </p>
          <p className="leading-relaxed mb-6">
            Whether you are building a highly decoupled microservice architecture on the web or cross-platform applications internally, bootNode enforces industry best practices globally across every generated line of code.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 tracking-tight border-b border-slate-200 pb-2">
            2. Web Development Scaffolding
          </h2>
          <p className="leading-relaxed mb-6">
            bootNode supports modern web paradigms focused heavily on React ecosystems. When navigating to the Web Configuration pipeline, you are presented with several presets:
          </p>
          <ul className="list-disc pl-6 space-y-3 mb-6 font-medium">
            <li><strong>Next.js (App Router):</strong> Leverages server-side rendering, highly optimized image components, and route handlers. Includes predefined patterns for auth, databases, and UI components.</li>
            <li><strong>MERN Stack:</strong> A classic decoupled architecture. Generates an independent Node.js/Express backend API alongside a Vite or Create-React-App client.</li>
            <li><strong>Vite + React (SPA):</strong> A brutally lightweight, blindingly fast Single Page Application setup bundled via Vite, optimized for raw frontend development.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 tracking-tight border-b border-slate-200 pb-2">
            3. Mobile App Development
          </h2>
          <p className="leading-relaxed mb-6">
            For engineers focused on mobile OS targets, bootNode provides rigorous architectures for both Native and Cross-Platform domains:
          </p>
          <ul className="list-disc pl-6 space-y-3 mb-6 font-medium">
            <li><strong>React Native:</strong> Complete React codebase utilizing Metro bundler and robust navigation constraints. Perfect for Javascript engineers targeting iOS and Android simultaneously.</li>
            <li><strong>Flutter:</strong> Google's UI toolkit compilation. Includes strictly typed Dart architecture models, BLoC or Provider abstractions seamlessly generated.</li>
            <li><strong>Native (Swift / Kotlin):</strong> Pure, hardware-optimised native applications utilising Xcode and Android Studio standard filesystem hierarchies.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 tracking-tight border-b border-slate-200 pb-2">
            4. Modifying Output Archives (.zip)
          </h2>
          <p className="leading-relaxed mb-6">
            Once you click <strong>Generate</strong>, the platform compiles your selections internally and responds with a standard `.zip` archive holding your boilerplate.
          </p>
          <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl font-mono text-sm leading-loose shadow-xl mb-6 overflow-x-auto">
            $ unzip my-awesome-app.zip<br/>
            $ cd my-awesome-app<br/>
            $ npm install<br/>
            $ npm run dev
          </div>
          <p className="leading-relaxed mb-6">
            Your file structure is un-opinionated enough to be highly configurable but rigorous enough to support massive scaling from day one. Please thoroughly read the internal <code>README.md</code> included in every zip payload for specific environmental variables.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 tracking-tight border-b border-slate-200 pb-2">
            5. Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Do I own the code generated by bootNode?</h3>
              <p className="text-slate-600 mt-1">Absolutely. All generated architectural code is securely licensed under the MIT License, meaning you hold total autonomy and commercial rights to the output.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Are the packages and dependencies updated?</h3>
              <p className="text-slate-600 mt-1">Yes, the bootNode engine continuously targets `latest` stable tags for fundamental libraries to minimize deprecation conflicts dynamically during node-resolution.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Is there an internal API?</h3>
              <p className="text-slate-600 mt-1">An enterprise GraphQL API is currently in stealth development for CI/CD integrations. Check back on our Changelog for updates.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
