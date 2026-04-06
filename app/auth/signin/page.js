"use client";

import { signIn } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const oauthProviders = [
  {
    id: "google",
    label: "Continue with Google",
    callbackUrl: "/templates",
    styles:
      "bg-white border-2 border-slate-200/60 hover:border-blue-500 text-slate-700 focus:ring-blue-100",
    icon: (
      <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    id: "github",
    label: "Continue with GitHub",
    callbackUrl: "/templates",
    styles:
      "bg-slate-900 border-2 border-slate-900 hover:bg-slate-800 text-white focus:ring-slate-300",
    icon: (
      <svg className="w-5 h-5 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
];

function errorMessage(code) {
  switch (code) {
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
      return "OAuth authentication failed. Check provider credentials and callback URLs.";
    case "AccessDenied":
      return "Access denied. Please use an allowed account.";
    case "Configuration":
      return "Auth provider configuration is incomplete. Please contact support.";
    default:
      return "Authentication failed. Please try again.";
  }
}

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/templates";
  const [loadingProvider, setLoadingProvider] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [callbackUrl, router, status]);

  useEffect(() => {
    if (loadingProvider !== null) {
      document.body.style.pointerEvents = "none";
      document.body.style.opacity = "0.7";
      return () => {
        document.body.style.pointerEvents = "auto";
        document.body.style.opacity = "1";
      };
    }
  }, [loadingProvider]);

  const enabledProviders = useMemo(
    () =>
      oauthProviders.filter((provider) => {
        const envName = provider.id === "google" ? "NEXT_PUBLIC_GOOGLE_AUTH_ENABLED" : "NEXT_PUBLIC_GITHUB_AUTH_ENABLED";
        return process.env[envName] !== "false";
      }),
    []
  );

  return (
    <div className="flex-1 flex items-center justify-center bg-[#F9FAFB] p-6 font-sans">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="text-center mb-10">
          <div className="inline-block mb-3 font-black text-3xl text-slate-900 tracking-tighter">bootNode</div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Sign in to continue</p>
        </div>

        {error && (
          <div className="mb-6 w-full rounded-xl border border-red-200 bg-red-100/50 p-4 text-center text-sm font-bold text-red-600">
            {errorMessage(error)}
          </div>
        )}

        <div className="flex flex-col gap-4 w-full">
          {enabledProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={async () => {
                try {
                  setLoadingProvider(provider.id);
                  await signIn(provider.id, { callbackUrl });
                } catch (err) {
                  setLoadingProvider(null);
                }
              }}
              disabled={loadingProvider !== null}
              className={`flex items-center justify-center gap-3 w-full font-bold py-4 rounded-full transition-all text-[15px] shadow-sm hover:shadow-md cursor-pointer outline-none group disabled:opacity-60 disabled:cursor-not-allowed ${provider.styles}`}
            >
              {provider.icon}
              {loadingProvider === provider.id ? "Redirecting..." : provider.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
