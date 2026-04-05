"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOTP() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Recover email from active registration session
    const storedEmail = sessionStorage.getItem("verifyEmail");
    if (!storedEmail) {
      router.push("/auth/signup");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const submitOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please fill all correctly");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otpCode: code }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid OTP");

      setMessage("Verified successfully! Redirecting...");
      sessionStorage.removeItem("verifyEmail");

      setTimeout(() => {
        router.push("/auth/signin");
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Check your email</h1>
        <p className="text-slate-500 text-sm font-medium mb-8">
          We've sent a 6-digit verification code to <span className="font-bold text-slate-800">{email}</span>.
          Enter the code below.
        </p>

        {error && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{error}</div>}
        {message && <div className="mb-6 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold">{message}</div>}

        <div className="flex justify-center gap-2 sm:gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-14 sm:w-12 sm:h-16 text-center text-2xl font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all select-all shadow-inner"
            />
          ))}
        </div>

        <button 
          onClick={submitOtp} 
          disabled={busy} 
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-md transition-all uppercase tracking-widest text-[13px]"
        >
          {busy ? "Verifying..." : "Verify Code"}
        </button>

        <p className="mt-8 text-sm font-medium text-slate-500">
          Didn't receive a code? <span className="text-blue-600 font-bold hover:underline cursor-pointer" onClick={() => alert("Resend mock logic: Check api/auth/register logic to resend")}>Resend Code</span>
        </p>
      </div>
    </div>
  );
}
