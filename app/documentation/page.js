export const metadata = {
  title: "Documentation | bootNode",
};

export default function DocumentationPage() {
  return (
    <div className="flex-1 bg-white p-6 sm:p-12 lg:p-24 font-sans">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Documentation</h1>
        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          <p className="lead text-xl mb-8">
            Welcome to the bootNode technical documentation. Learn how to configure, scaffold, and deploy enterprise-grade architectures instantly.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Getting Started</h2>
          <p className="mb-6">
            BootNode uses optimized presets for both Web and Mobile app development. Our scaffolding engine dynamically generates the necessary boilerplate, CI/CD pipelines, and cloud provisioning scripts based on your selections.
          </p>
          
          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">1. Select your Paradigm</h3>
          <p className="mb-6">
            Whether you are building a SPA for the web using React and Next.js, or a Native mobile app using Swift and Kotlin, bootNode configures the environment to your specifications.
          </p>
          
          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">2. Configure Features</h3>
          <p className="mb-6">
            Toggle integrated features like Offline Sync, Push Notifications, and Deep Linking. We handle the complex integrations in the background so you can focus on building features.
          </p>
        </div>
      </div>
    </div>
  );
}
