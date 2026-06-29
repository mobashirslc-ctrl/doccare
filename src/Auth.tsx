import React, { useState } from 'react';
// ফায়ারবেস সার্ভিস ইম্পোর্ট (নিশ্চিত করুন আপনার src/firebase.ts ফাইলটি রেডি আছে)
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

type Role = "doctor" | "patient" | "agent" | "admin";
type View = "landing" | "login" | "register" | "pending" | "doctor" | "patient" | "agent" | "admin";

interface AuthProps {
  go: (view: View) => void;
  setAuth: (user: { name: string; role: Role } | null) => void;
}

// ============================================================
// LOGIN PAGE COMPONENT (REAL FIREBASE WITH APPROVAL SYSTEM)
// ============================================================
export function LoginPage({ go, setAuth }: AuthProps) {
  const [role, setRole] = useState<Role>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // ১. ফায়ারবেস দিয়ে ইমেইল ও পাসওয়ার্ড লগইন
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ২. ফায়ারস্টোর ডেটাবেজ থেকে ইউজারের রোল, নাম এবং স্ট্যাটাস তুলে আনা
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // ৩. সিলেক্ট করা রোল ডেটাবেজের রোলের সাথে মিলছে কিনা চেক করা
        if (userData.role !== role) {
          alert(`You are registered as a ${userData.role.toUpperCase()}, not a ${role.toUpperCase()}!`);
          setLoading(false);
          return;
        }

        // 🚨 ৪. অ্যাডমিন অ্যাপ্রুভাল বা ইন্টারভিউ স্ট্যাটাস চেক
        if (userData.status === "pending") {
          alert("Your account is pending admin approval. You can log in after your interview and admin verification.");
          setLoading(false);
          return; // এখানেই লগইন প্রসেস আটকে দেওয়া হলো
        }

        // ৫. সব ঠিক থাকলে (Approved হলে) ড্যাশবোর্ডে রিডাইরেক্ট
        setAuth({
          name: userData.name,
          role: userData.role
        });
      } else {
        alert("User data not found in database!");
      }
    } catch (error: any) {
      alert("Login Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Or{' '}
          <button onClick={() => go("register")} className="font-medium text-indigo-400 hover:text-indigo-350 bg-transparent border-none cursor-pointer">
            create a new account
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-800">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-300">Select Your Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => go("landing")} className="text-xs text-slate-500 hover:text-slate-400">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// REGISTER PAGE COMPONENT (REAL FIREBASE WITH APPROVAL STATUS)
// ============================================================
export function RegisterPage({ go }: { go: (view: View) => void }) {
  const [role, setRole] = useState<Role>("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // ১. ফায়ারবেস অথেন্টিকেশনে ইউজার তৈরি
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🚨 ২. রোল অনুযায়ী স্ট্যাটাস সেটআপ (পেশেন্ট/অ্যাডমিন সরাসরি approved, ডাক্তার/এজেন্ট থাকবে pending)
      const initialStatus = (role === "patient" || role === "admin") ? "approved" : "pending";

      // ৩. ফায়ারস্টোর ডেটাবেজে ইউজারের রিয়াল ডেটা (status সহ) সেভ করা
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role,
        status: initialStatus, // 'approved' বা 'pending' স্ট্যাটাস ডেটাবেজে যাবে
        createdAt: new Date().toISOString()
      });

      alert("Registration Successful!");
      
      // ৪. স্ট্যাটাস অনুযায়ী স্ক্রিন রিডাইরেকশন
      if (initialStatus === "approved") {
        go("login");
      } else {
        go("pending"); // ডাক্তার/এজেন্ট হলে "Account Pending Approval" স্ক্রিনে নিয়ে যাবে
      }
    } catch (error: any) {
      alert("Registration Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
          Create a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-800">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Register As</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor (Requires Approval)</option>
                <option value="agent">Agent (Requires Approval)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <button onClick={() => go("login")} className="text-indigo-400 hover:text-indigo-350">
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PENDING APPROVAL COMPONENT
// ============================================================
export function PendingApprovalPage({ go }: { go: (view: View) => void }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 text-center text-slate-100">
      <div className="max-w-md bg-slate-900 p-8 rounded-lg border border-slate-800 shadow-xl">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Account Pending Approval</h2>
        <p className="text-slate-400 text-sm mb-6">
          Thank you for registering! Your profile as a Doctor/Agent is currently being reviewed by our Admin team. You will be able to log in once approved after your interview verification.
        </p>
        <button
          onClick={() => go("landing")}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-md text-sm transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}