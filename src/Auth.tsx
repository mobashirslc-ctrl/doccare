import React, { useState } from 'react';
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
// LOGIN PAGE COMPONENT
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== role) {
          alert(`You are registered as a ${userData.role.toUpperCase()}, not a ${role.toUpperCase()}!`);
          setLoading(false);
          return;
        }
        if (userData.status === "pending") {
          alert("Your account is pending admin approval.");
          setLoading(false);
          return;
        }
        setAuth({ name: userData.name, role: userData.role });
      } else {
        alert("User data not found!");
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
        <h2 className="text-center text-3xl font-extrabold text-white">Sign in</h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Or <button onClick={() => go("register")} className="text-indigo-400">create a new account</button>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-slate-900 py-8 px-4 shadow rounded-lg border border-slate-800">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-slate-300">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-indigo-600 rounded-md text-white font-medium">
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// REGISTER PAGE COMPONENT
// ============================================================
export function RegisterPage({ go, setAuth }: { go: (view: View) => void, setAuth: (user: { name: string; role: Role } | null) => void }) {
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // ডাক্তার বা এজেন্ট হলে pending থাকবে, অন্যথায় approved
      const initialStatus = (role === "patient" || role === "admin") ? "approved" : "pending";

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role,
        status: initialStatus,
        createdAt: new Date().toISOString()
      });

      alert("Registration Successful!");
      
      // ইউজার স্টেট আপডেট
      setAuth({ name: name, role: role });
      
      // ✅ আপডেট: ডাক্তার হলে পেমেন্ট পেজে যাবে, অন্যথায় পেন্ডিং বা লগইন পেজে
      if (role === "doctor") {
        go("doctor-payment"); 
      } else if (initialStatus === "approved") {
        go("login");
      } else {
        go("pending"); 
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
        <h2 className="text-center text-3xl font-extrabold text-white">Create Account</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-slate-900 py-8 px-4 shadow rounded-lg border border-slate-800">
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-slate-300">Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Register As</label>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="agent">Agent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-100" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-emerald-600 rounded-md text-white font-medium">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
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
        <h2 className="text-2xl font-bold text-white mb-2">Account Pending Approval</h2>
        <p className="text-slate-400 text-sm mb-6">
          Your profile is being reviewed. You will be able to log in once approved.
        </p>
        <button onClick={() => go("landing")} className="bg-slate-800 px-4 py-2 rounded-md">Back to Home</button>
      </div>
    </div>
  );
}