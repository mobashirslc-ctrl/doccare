import React, { useState, useRef } from "react";
// 🚨 পুরোনো ফায়ারবেস ইম্পোর্ট ৩টি মুছে এই একটি লাইন যোগ করুন:
import { LoginPage, RegisterPage, PendingApprovalPage } from "./Auth";
import {
  User, Lock, Mail, Phone, Upload, QrCode, Activity,
  Users, FileText, Settings, Bell, Star, Play, Download,
  CheckCircle, Calendar, Clock, TrendingUp,
  BarChart2, LogOut, Eye, EyeOff, Camera, PhoneCall,
  PhoneOff, Check, Home, BookOpen, Briefcase,
  Heart, Pause, ArrowRight, Zap, Globe, CreditCard,
  UserCheck, ClipboardList, ChevronDown,
  X, Plus, Shield, Headphones, Menu, Search, AlertCircle
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart,
  Pie, Cell
} from "recharts";

// ============================================================
// TYPES
// ============================================================
type View = "landing" | "login" | "register" | "pending" | "doctor" | "patient" | "agent" | "admin" | "qrscan";
type Role = "doctor" | "patient" | "agent" | "admin";
type AgentStatus = "pending" | "interview" | "approved" | "suspended";

interface Agent {
  id: string; name: string; email: string; phone: string;
  status: AgentStatus; workExp: string; qualification: string;
  appliedDate: string; calls: number; successRate: number; isLive: boolean;
}

// ============================================================
// MOCK DATA
// ============================================================
const INITIAL_AGENTS: Agent[] = [
  { id: "a1", name: "রাফি হাসান", email: "rafi@example.com", phone: "01712345678",
    status: "approved", workExp: "২ বছর কাস্টমার সার্ভিস", qualification: "BBA, ঢাকা বিশ্ববিদ্যালয়",
    appliedDate: "১০ জুন ২০২৫", calls: 42, successRate: 94, isLive: true },
  { id: "a2", name: "সুমাইয়া খানম", email: "sumaiya@example.com", phone: "01898765432",
    status: "interview", workExp: "১ বছর হেলথকেয়ার সাপোর্ট", qualification: "MBA, BRAC University",
    appliedDate: "১৫ জুন ২০২৫", calls: 0, successRate: 0, isLive: false },
  { id: "a3", name: "তানভীর আহমেদ", email: "tanvir@example.com", phone: "01534567890",
    status: "pending", workExp: "৩ বছর কল সেন্টার", qualification: "HSC",
    appliedDate: "২০ জুন ২০২৫", calls: 0, successRate: 0, isLive: false },
  { id: "a4", name: "নাসরিন আক্তার", email: "nasrin@example.com", phone: "01677890123",
    status: "suspended", workExp: "৪ বছর মেডিকেল অ্যাসিস্ট্যান্ট", qualification: "BSc Nursing",
    appliedDate: "১ মে ২০২৫", calls: 128, successRate: 87, isLive: false },
];

const PATIENTS = [
  { id: "p1", name: "মো. রহিম উদ্দিন", phone: "01712345678", age: 45,
    lastVisit: "২০ জুন ২০২৫", nextFollowup: "১২ জুলাই ২০২৫", status: "follow-up",
    doctorNote: "রক্তচাপ নিয়ন্ত্রণে আছে, ওষুধ চালিয়ে যান" },
  { id: "p2", name: "ফাতেমা বেগম", phone: "01898765432", age: 38,
    lastVisit: "১৮ জুন ২০২৫", nextFollowup: "২ জুলাই ২০২৫", status: "urgent",
    doctorNote: "ডায়াবেটিস টেস্ট পেন্ডিং — দ্রুত জানাতে হবে" },
  { id: "p3", name: "করিম শেখ", phone: "01556789012", age: 62,
    lastVisit: "১৫ জুন ২০২৫", nextFollowup: "১৫ জুলাই ২০২৫", status: "stable",
    doctorNote: "থাইরয়েড ওষুধ পরিবর্তন করা হয়েছে" },
  { id: "p4", name: "আয়েশা সিদ্দিকা", phone: "01923456789", age: 29,
    lastVisit: "২২ জুন ২০২৫", nextFollowup: "২২ জুলাই ২০২৫", status: "stable",
    doctorNote: "আয়রন ও ভিটামিন D সাপ্লিমেন্ট দেওয়া হয়েছে" },
  { id: "p5", name: "আব্দুল হক", phone: "01534567890", age: 55,
    lastVisit: "১০ জুন ২০২৫", nextFollowup: "১০ জুলাই ২০২৫", status: "follow-up",
    doctorNote: "হার্টের ওষুধ ঠিকমতো খাচ্ছেন কিনা চেক করুন" },
];

const CALLS = [
  { id: "c1", patient: "মো. রহিম উদ্দিন", phone: "01712345678", time: "10:23 AM",
    agent: "রাফি হাসান", note: "আগামী রবিবারে রিপোর্ট দেখাবেন", duration: "3:42", hasRec: true },
  { id: "c2", patient: "ফাতেমা বেগম", phone: "01898765432", time: "11:05 AM",
    agent: "রাফি হাসান", note: "ডায়াবেটিস টেস্ট করে রিপোর্ট পাঠাবেন", duration: "5:18", hasRec: true },
  { id: "c3", patient: "করিম শেখ", phone: "01556789012", time: "12:30 PM",
    agent: "রাফি হাসান", note: "নতুন ওষুধের ব্যাপারে জানানো হয়েছে", duration: "2:55", hasRec: false },
  { id: "c4", patient: "আয়েশা সিদ্দিকা", phone: "01923456789", time: "02:15 PM",
    agent: "রাফি হাসান", note: "পরবর্তী অ্যাপয়েন্টমেন্ট কনফার্ম করা হয়েছে", duration: "1:48", hasRec: true },
];

const QUEUE = [
  { id: "q1", patient: "নাসরিন আক্তার", phone: "01677890123", type: "prescription",
    time: "২ মিনিট আগে", urgent: true, doctor: "ডা. আহমেদ করিম" },
  { id: "q2", patient: "আব্দুল হক", phone: "01534567890", type: "call",
    time: "৫ মিনিট আগে", urgent: false, doctor: "ডা. আহমেদ করিম" },
  { id: "q3", patient: "সেলিনা পারভীন", phone: "01923456789", type: "query",
    time: "৮ মিনিট আগে", urgent: false, doctor: "ডা. আহমেদ করিম" },
];

const CHART_DATA = [
  { day: "শনি", patients: 28, followups: 22 }, { day: "রবি", patients: 35, followups: 28 },
  { day: "সোম", patients: 42, followups: 35 }, { day: "মঙ্গল", patients: 38, followups: 30 },
  { day: "বুধ", patients: 45, followups: 40 }, { day: "বৃহ", patients: 50, followups: 45 },
  { day: "আজ", patients: 32, followups: 28 },
];

const PERF_DATA = [
  { day: "শনি", calls: 38 }, { day: "রবি", calls: 42 }, { day: "সোম", calls: 35 },
  { day: "মঙ্গল", calls: 48 }, { day: "বুধ", calls: 52 }, { day: "বৃহ", calls: 44 }, { day: "আজ", calls: 42 },
];

const CALL_PIE = [{ name: "সফল", value: 94 }, { name: "মিসড", value: 6 }];

// ============================================================
// SHARED COMPONENTS
// ============================================================

function Field({ label, icon, type, val, onChange, placeholder, show }: {
  label: string; icon: JSX.Element; type: string; val: string;
  onChange: (v: string) => void; placeholder: string; show?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 block mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none">{icon}</div>
        <input
          type={type === "password" && show ? "text" : type}
          value={val}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
}

function QRCodeSVG({ size = 180, color = "#FF5E13" }: { size?: number; color?: string }) {
  const cell = size / 21;
  const pattern = [
    [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,0,1,1,1,0,1,0,1,0],
    [0,1,0,1,1,0,0,0,1,1,0,1,1,0,0,1,1,0,1,0,1],
    [1,0,1,0,0,1,1,0,1,0,1,0,1,0,1,0,1,1,0,1,0],
    [0,1,0,0,1,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,1],
    [1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,0],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,1,0,0,1],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,0,1,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,1,1,0,1,0,0,1,0,0,1,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,1,0,0],
    [1,0,0,0,0,0,1,0,1,1,0,1,0,1,0,1,0,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,0,1,0,1,0,1,0,1,1,0,0,1],
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="4"/>
      {pattern.map((row, i) =>
        row.map((v, j) =>
          v === 1 ? (
            <rect key={`${i}-${j}`} x={j * cell} y={i * cell} width={cell} height={cell} fill={color}/>
          ) : null
        )
      )}
      <rect x={size / 2 - 18} y={size / 2 - 18} width={36} height={36} fill="white" rx="4"/>
      <text x={size / 2} y={size / 2 + 7} textAnchor="middle" fontSize={14} fill={color} fontWeight="bold">M</text>
    </svg>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================
function LandingPage({ go }: { go: (v: View) => void }) {
  return (
    <div style={{ fontFamily: "'Inter', 'Hind Siliguri', sans-serif" }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
           style={{ background: "rgba(255,94,19,0.97)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5" style={{ color: "#FF5E13" }}/>
          </div>
          <span className="text-white font-bold text-xl">মেডিকেয়ার BD</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-white/90 text-sm font-medium">
          <a href="#features" className="hover:text-white transition-colors">সুবিধাসমূহ</a>
          <a href="#pricing" className="hover:text-white transition-colors">মূল্য পরিকল্পনা</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => go("login")} className="text-white border border-white/40 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-all">
            লগইন
          </button>
          <button onClick={() => go("register")} className="bg-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-50 transition-all shadow-lg" style={{ color: "#FF5E13" }}>
            রেজিস্ট্রেশন
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center pt-20 pb-16 relative overflow-hidden"
               style={{ background: "linear-gradient(135deg, #FF5E13 0%, #D84315 60%, #BF360C 100%)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10"
               style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}/>
          <div className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full opacity-10"
               style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}/>
        </div>
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="relative order-2 md:order-1">
            <div className="relative w-full max-w-md mx-auto">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=600&fit=crop&auto=format"
                alt="আত্মবিশ্বাসী ডাক্তার"
                className="w-full rounded-2xl object-cover shadow-2xl"
                style={{ height: "480px" }}
              />
              <div className="absolute -right-4 bottom-20 bg-white rounded-2xl shadow-xl p-4 min-w-[160px]">
                <div className="text-xs text-gray-500 mb-1">আজকের রোগী</div>
                <div className="text-2xl font-bold text-gray-900">১২৪ জন</div>
                <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                  <TrendingUp className="w-3 h-3"/><span>১৮% বেশি</span>
                </div>
              </div>
              <div className="absolute -left-4 top-20 bg-white rounded-2xl shadow-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 fill-orange-500 text-orange-500"/>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">৪.৯ ★</div>
                    <div className="text-xs text-gray-500">গুগল রিভিউ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-white order-1 md:order-2">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
              <Zap className="w-4 h-4"/> বাংলাদেশের প্রথম ডাক্তার ফলো-আপ প্ল্যাটফর্ম
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              আপনার চেম্বার সামলাবে আমাদের টিম।
              <span className="block text-orange-200">আপনি শুধু চিকিৎসা দিন।</span>
            </h1>
            <p className="text-lg text-white/85 mb-8 leading-relaxed">
              ডাক্তারদের জন্য তৈরি বাংলাদেশের প্রথম ডেডিকেটেড পার্সোনাল ফলো-আপ ও রেপুটেশন ম্যানেজমেন্ট প্ল্যাটফর্ম।
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => go("register")} className="bg-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl hover:scale-105 transition-all" style={{ color: "#FF5E13" }}>
                ফ্রি ডেমো বুক করুন →
              </button>
              <button onClick={() => go("login")} className="border-2 border-white/50 text-white font-semibold py-4 px-8 rounded-full text-lg hover:bg-white/10 transition-all">
                লগইন করুন
              </button>
            </div>
            <div className="flex items-center gap-8 mt-10">
              {[["৫০০+", "নিবন্ধিত ডাক্তার"], ["৯৮%", "ফলো-আপ সাফল্য"], ["২৪/৭", "এজেন্ট সাপোর্ট"]].map(([v, l], i) => (
                <div key={i} className="flex items-center gap-8">
                  {i > 0 && <div className="w-px h-10 bg-white/20"/>}
                  <div><div className="text-2xl font-bold">{v}</div><div className="text-sm text-white/70">{l}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="w-6 h-6"/>
        </div>
      </section>

      {/* Pain Points */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">আপনার চেম্বারের সমস্যাগুলো আমরা জানি</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">প্রতিটি ডাক্তারের একই সমস্যা — কিন্তু এখন সমাধান আছে।</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <PhoneOff className="w-8 h-8"/>, title: "মিসড কল ও ব্যস্ত অ্যাসিস্ট্যান্ট",
                desc: "প্রতিদিন কত রোগীর কল মিস হচ্ছে জানেন? আমাদের ডেডিকেটেড এজেন্ট টিম প্রতিটি কল রিসিভ করে রেকর্ড রাখে।",
                stat: "০% মিসড কল", iconBg: "bg-red-100 text-red-500", cardBg: "bg-red-50 border border-red-100" },
              { icon: <Calendar className="w-8 h-8"/>, title: "হারিয়ে যাওয়া ফলো-আপ",
                desc: "রোগীরা ফলো-আপে ফিরে আসছেন না? আমাদের সিস্টেম স্বয়ংক্রিয়ভাবে রিমাইন্ড করে অ্যাপয়েন্টমেন্ট বুক করে।",
                stat: "৯৮% ফলো-আপ হার", iconBg: "bg-orange-100 text-orange-500", cardBg: "bg-orange-50 border border-orange-100" },
              { icon: <Star className="w-8 h-8"/>, title: "ডিজিটাল রেপুটেশন",
                desc: "গুগল ও ফেসবুকে আপনার রেটিং কেমন? সন্তুষ্ট রোগীদের রিভিউ দিতে উৎসাহিত করে অনলাইন উপস্থিতি শক্তিশালী করি।",
                stat: "৪.৯★ গড় রেটিং", iconBg: "bg-yellow-100 text-yellow-600", cardBg: "bg-yellow-50 border border-yellow-100" },
            ].map((item, i) => (
              <div key={i} className={`${item.cardBg} rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1`}>
                <div className={`w-16 h-16 ${item.iconBg} rounded-2xl flex items-center justify-center mb-6`}>{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{item.desc}</p>
                <div className="text-sm font-bold" style={{ color: "#FF5E13" }}>{item.stat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #fff 0%, #FFF3ED 100%)" }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 rounded-full px-4 py-2 text-sm font-medium mb-6">
                <BarChart2 className="w-4 h-4"/> লাইভ ড্যাশবোর্ড
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">আপনার চেম্বারের পূর্ণ নিয়ন্ত্রণ এক স্ক্রিনে</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">রোগীর তালিকা, এজেন্টের লাইভ কল স্ট্যাটাস, ফলো-আপ ট্র্যাকিং এবং কাস্টম QR কোড।</p>
              <ul className="space-y-3 mb-8">
                {["রিয়েল-টাইম পেশেন্ট ট্র্যাকিং", "এজেন্ট লাইভ কল মনিটরিং", "কাস্টম QR কোড জেনারেটর", "গুগল রিভিউ ইন্টিগ্রেশন"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF5E13" }}>
                      <Check className="w-3 h-3 text-white"/>
                    </div>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => go("login")} className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all" style={{ background: "linear-gradient(135deg, #FF5E13, #D84315)" }}>
                ড্যাশবোর্ড দেখুন <ArrowRight className="w-4 h-4"/>
              </button>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format"
                   alt="ড্যাশবোর্ড প্রিভিউ" className="w-full rounded-2xl shadow-2xl bg-gray-200"/>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"/>
                  <span className="text-sm font-semibold text-gray-800">৩ এজেন্ট এখন লাইভ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">স্বচ্ছ মূল্য পরিকল্পনা</h2>
            <p className="text-gray-500">আপনার চেম্বারের আকার অনুযায়ী প্যাকেজ বেছে নিন।</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "স্টার্টার", price: "১৫ টাকা/রোগী", desc: "কোনো ফিক্সড ফি নেই। শুধু সফল ফলো-আপে চার্জ।",
                features: ["পার-পেশেন্ট মডেল", "আনলিমিটেড কল", "বেসিক রিপোর্টিং", "QR কোড জেনারেটর"], popular: false },
              { name: "প্রো", price: "৩,০০০ টাকা/মাস", desc: "৫০০ জন রোগীর কমপ্লিট ফলো-আপ + ডেডিকেটেড এজেন্ট।",
                features: ["৫০০ রোগী/মাস", "ডেডিকেটেড এজেন্ট", "লাইভ কল মনিটরিং", "কাস্টম QR স্ট্যান্ডি", "কল রেকর্ডিং"], popular: true },
              { name: "এন্টারপ্রাইজ", price: "৫,০০০+ টাকা/মাস", desc: "মাল্টি-চেম্বার + কাস্টম হোয়াটসঅ্যাপ + গুগল রিভিউ।",
                features: ["আনলিমিটেড রোগী", "মাল্টি-চেম্বার", "হোয়াটসঅ্যাপ API", "গুগল রিভিউ বুস্টিং", "কাস্টম ইন্টিগ্রেশন"], popular: false },
            ].map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-8 transition-all hover:-translate-y-1 ${plan.popular ? "shadow-2xl scale-105" : "bg-white border border-gray-100 shadow-md hover:shadow-xl"}`}
                   style={plan.popular ? { background: "linear-gradient(135deg, #FF5E13, #D84315)", color: "white" } : {}}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    সবচেয়ে জনপ্রিয় 🔥
                  </div>
                )}
                <div className={`text-sm font-semibold mb-2 ${plan.popular ? "text-orange-200" : "text-orange-500"}`}>{i === 0 ? "Starter" : i === 1 ? "Pro" : "Enterprise"}</div>
                <div className={`text-2xl font-bold mb-1 ${plan.popular ? "text-white" : "text-gray-900"}`}>{plan.name}</div>
                <div className={`text-3xl font-bold mb-2 ${plan.popular ? "text-white" : "text-gray-900"}`}>{plan.price}</div>
                <p className={`text-sm mb-6 ${plan.popular ? "text-orange-100" : "text-gray-500"}`}>{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.popular ? "text-white" : "text-gray-700"}`}>
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-orange-200" : "text-orange-500"}`}/>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => go("register")} className={`w-full py-3 rounded-xl font-semibold transition-all hover:opacity-90 ${plan.popular ? "bg-white text-orange-600" : "text-white"}`}
                        style={!plan.popular ? { background: "linear-gradient(135deg, #FF5E13, #D84315)" } : {}}>
                  {plan.popular ? "সবচেয়ে জনপ্রিয় →" : "শুরু করুন →"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #FF5E13 0%, #D84315 100%)" }}>
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">আজই শুরু করুন — বিনামূল্যে ডেমো</h2>
          <p className="text-orange-100 mb-8 max-w-xl mx-auto">আপনার চেম্বারের জন্য কাস্টম সলিউশন দেখতে আমাদের টিমের সাথে কথা বলুন।</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => go("register")} className="bg-white font-bold py-4 px-8 rounded-full text-lg hover:scale-105 transition-all shadow-lg" style={{ color: "#FF5E13" }}>
              ফ্রি রেজিস্ট্রেশন করুন
            </button>
            <button onClick={() => go("login")} className="border-2 border-white text-white font-semibold py-4 px-8 rounded-full text-lg hover:bg-white/10 transition-all">
              ডেমো লগইন করুন
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white"/>
                </div>
                <span className="text-white font-bold">মেডিকেয়ার BD</span>
              </div>
              <p className="text-sm leading-relaxed">বাংলাদেশের ডাক্তারদের জন্য তৈরি প্রিমিয়াম হেলথকেয়ার ম্যানেজমেন্ট প্ল্যাটফর্ম।</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">প্ল্যাটফর্ম</h4>
              <ul className="space-y-2 text-sm">
                {["ডক্টর পোর্টাল", "পেশেন্ট পোর্টাল", "এজেন্ট ওয়ার্কস্পেস"].map(l => (
                  <li key={l}><button onClick={() => go("login")} className="hover:text-white transition-colors">{l}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">অ্যাকাউন্ট</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => go("login")} className="hover:text-white transition-colors">লগইন</button></li>
                <li><button onClick={() => go("register")} className="hover:text-white transition-colors">রেজিস্ট্রেশন</button></li>
                <li><button onClick={() => go("qrscan")} className="hover:text-white transition-colors">QR স্ক্যান পেজ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">যোগাযোগ</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-orange-500"/> 01700-000000</div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-orange-500"/> info@medicare-bd.com</div>
                <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-orange-500"/> www.medicare-bd.com</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            © ২০২৫ মেডিকেয়ার BD। সর্বস্বত্ব সংরক্ষিত।
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================
import React, { useState } from "react";
// ফায়ারবেস ইম্পোর্টস
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// আইকন ইম্পোর্টস (সবগুলো নিশ্চিত করা হয়েছে যাতে কোনো এরর না আসে)
import { User, Heart, Headphones, Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

type Role = "doctor" | "patient" | "agent" | "admin";
type View = "landing" | "login" | "register" | "pending" | "doctor" | "patient" | "agent" | "admin";

export function LoginPage({ 
  go, 
  setAuth 
}: { 
  go: (v: View) => void; 
  setAuth: (u: { name: string; role: Role }) => void 
}) {
  const [role, setRole] = useState<Role>("doctor");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // লোডিং স্টেট

  const isValid = identifier.length > 0 && password.length >= 6;

  // ইউজার যদি শুধু মোবাইল নম্বর দেয়, তবে সেটাকে ফায়ারবেস ফরম্যাট ইমেইলে রূপান্তর করার লজিক
  const formatEmail = (input: string) => {
    const cleanInput = input.trim();
    if (!cleanInput.includes("@")) {
      return `${cleanInput}@medicarebd.com`; // রেজিস্ট্রেশনের সাথে মিল রেখে
    }
    return cleanInput;
  };

  // 🚨 আসল ফায়ারবেস লগইন হ্যান্ডলার
  const handleLogin = async () => {
    if (!isValid) return;
    setError("");
    setLoading(true);

    try {
      const emailToSignIn = formatEmail(identifier);

      // ১. ফায়ারবেস দিয়ে সাইন-ইন
      const userCredential = await signInWithEmailAndPassword(auth, emailToSignIn, password);
      const user = userCredential.user;

      // ২. ফায়ারস্টোর থেকে ইউজারের রোল এবং স্ট্যাটাস চেক করা
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // ৩. রোল ভ্যালিডেশন (সিলেক্ট করা রোলের সাথে ডাটাবেজের রোল মিলছে কি না)
        if (userData.role !== role) {
          setError(`এই অ্যাকাউন্টটি ${role === 'doctor' ? 'ডাক্তার' : role === 'patient' ? 'রোগী' : role === 'agent' ? 'এজেন্ট' : 'অ্যাডমিন'} হিসেবে নিবন্ধিত নয়!`);
          setLoading(false);
          return;
        }

        // ৪. স্ট্যাটাস ভ্যালিডেশন (ডাক্তার বা এজেন্ট পেন্ডিং থাকলে ড্যাশবোর্ডে ঢুকতে দেবে না)
        if (userData.status === "pending") {
          go("pending");
          setLoading(false);
          return;
        }

        // ৫. সবকিছু ঠিক থাকলে অথ সেট করা এবং ড্যাশবোর্ডে পাঠানো
        setAuth({ name: userData.name, role: userData.role as Role });
        go(userData.role as View);
      } else {
        setError("ইউজারের কোনো তথ্য ডাটাবেজে পাওয়া যায়নি!");
      }
    } catch (err: any) {
      // ফায়ারবেসের কমন এরর মেসেজগুলোকে বাংলায় রূপান্তর
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("ভুল ইমেইল/মোবাইল নম্বর অথবা পাসওয়ার্ড!");
      } else {
        setError("লগইন ব্যর্থ হয়েছে: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "doctor" as Role, label: "ডাক্তার", icon: <User className="w-4 h-4" /> },
    { id: "patient" as Role, label: "রোগী", icon: <Heart className="w-4 h-4" /> },
    { id: "agent" as Role, label: "এজেন্ট", icon: <Headphones className="w-4 h-4" /> },
    { id: "admin" as Role, label: "অ্যাডমিন", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12"
         style={{ background: "linear-gradient(135deg, #FF5E13 0%, #D84315 100%)" }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-white rounded-full blur-3xl"/>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"/>
      </div>
      <div className="relative w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <button onClick={() => go("landing")} className="inline-flex items-center gap-3 text-white bg-transparent border-none cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7" style={{ color: "#FF5E13" }}/>
            </div>
            <span className="text-2xl font-bold">মেডিকেয়ার BD</span>
          </button>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">স্বাগতম!</h2>
          <p className="text-gray-500 text-sm mb-6">আপনার অ্যাকাউন্টে লগইন করুন</p>
          
          {/* Role Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-xl mb-6">
            {tabs.map(t => (
              <button key={t.id} type="button" onClick={() => { setRole(t.id); setError(""); }}
                      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all border-none cursor-pointer ${role === t.id ? "bg-white shadow text-orange-600" : "text-gray-500 bg-transparent hover:text-gray-700"}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">ইমেইল / মোবাইল নম্বর</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
                       placeholder="আপনার ইমেইল বা মোবাইল নম্বর দিন"
                       className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-900 bg-white"/>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                       placeholder="আপনার পাসওয়ার্ড লিখুন"
                       className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-900 bg-white"/>
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
                  {showPass ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0"/>{error}
              </div>
            )}

            <button type="button" onClick={handleLogin} disabled={!isValid || loading}
                    className={`w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all border-none cursor-pointer ${isValid && !loading ? "hover:opacity-90 hover:shadow-lg shadow-md" : "opacity-40 cursor-not-allowed"}`}
                    style={{ background: isValid && !loading ? "linear-gradient(135deg, #FF5E13, #D84315)" : "#cbd5e1" }}>
              {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            অ্যাকাউন্ট নেই?{" "}
            <button type="button" onClick={() => go("register")} className="font-semibold hover:underline bg-transparent border-none cursor-pointer" style={{ color: "#FF5E13" }}>রেজিস্ট্রেশন করুন</button>
          </p>
        </div>
        
        <button type="button" onClick={() => go("landing")} className="mt-5 w-full text-center text-white/80 text-sm hover:text-white transition-colors bg-transparent border-none cursor-pointer">
          ← হোম পেজে ফিরুন
        </button>
      </div>
    </div>
  );
}
// ============================================================
// REGISTER PAGE
// ============================================================
import React, { useState, useRef } from 'react';
// ফায়ারবেস সার্ভিস ইম্পোর্ট (নিশ্চিত করুন আপনার src/firebase.ts ফাইলটি রেডি আছে)
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// আইকন ইম্পোর্টস (আপনার ডিজাইন অনুযায়ী সব আইকন যুক্ত করা হয়েছে)
import { 
  User, Heart, Headphones, Shield, Mail, Phone, Lock, 
  Calendar, Globe, Upload, CheckCircle, BookOpen, Briefcase, Check 
} from 'lucide-react';

type Role = "doctor" | "patient" | "agent" | "admin";
type View = "landing" | "login" | "register" | "pending" | "doctor" | "patient" | "agent" | "admin";

export function RegisterPage({ go }: { go: (v: View) => void }) {
  const [role, setRole] = useState<Role>("doctor");
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [cvName, setCvName] = useState("");
  const [loading, setLoading] = useState(false); // লোডিং স্টেট
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPass: "",
    specialty: "", chamber: "", dob: "",
    workExp: "", qualification: "", institution: "", year: "", agentRole: "", company: "",
    adminCode: ""
  });

  const upd = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  // পেশেন্ট যদি ইমেইল না দেয়, তবে তার ফোন নম্বর দিয়ে একটি ইউনিক ডামি ইমেইল তৈরি হবে ফায়ারবেসের জন্য
  const getRegisterEmail = () => {
    if (form.email.trim() === "") {
      return `${form.phone}@medicarebd.com`;
    }
    return form.email;
  };

  const baseValid = form.name.length > 0 && form.phone.length >= 11
    && form.password.length >= 6 && form.password === form.confirmPass;

  const isStepValid = () => {
    if (role === "doctor") return baseValid && form.email.includes("@") && form.specialty.length > 0 && form.chamber.length > 0;
    if (role === "patient") return form.name.length > 0 && form.phone.length >= 11 && form.password.length >= 6 && form.password === form.confirmPass && form.dob.length > 0;
    if (role === "admin") return baseValid && form.email.includes("@") && form.adminCode === "ADMIN2025";
    if (role === "agent") {
      if (step === 1) return baseValid && form.email.includes("@");
      if (step === 2) return form.qualification.length > 0 && form.institution.length > 0;
      if (step === 3) return form.workExp.length > 0;
      return cvName.length > 0;
    }
    return false;
  };

  // 🚨 আসল ফায়ারবেস সাবমিট হ্যান্ডলার
  const handleSubmit = async () => {
    if (!isStepValid()) return;

    setLoading(true);
    try {
      const emailToRegister = getRegisterEmail();

      // ১. ফায়ারবেস Auth-এ ইউজার তৈরি
      const userCredential = await createUserWithEmailAndPassword(auth, emailToRegister, form.password);
      const user = userCredential.user;

      // ২. স্ট্যাটাস রুল (patient ও admin সরাসরি approved, doctor ও agent থাকবে pending)
      const initialStatus = (role === "patient" || role === "admin") ? "approved" : "pending";

      // ৩. ফায়ারস্টোর ডাটাবেজে সম্পূর্ণ ডাটা সেভ করা হচ্ছে
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: role,
        status: initialStatus, // 'approved' অথবা 'pending'
        createdAt: new Date().toISOString(),
        // রোল অনুযায়ী অতিরিক্ত প্রয়োজনীয় ফিল্ড ডাটাবেজে পাঠানো হচ্ছে
        ...(role === "doctor" && { specialty: form.specialty, chamber: form.chamber }),
        ...(role === "patient" && { dob: form.dob }),
        ...(role === "agent" && { 
          qualification: form.qualification, 
          institution: form.institution, 
          year: form.year,
          company: form.company,
          agentRole: form.agentRole,
          workExp: form.workExp,
          cvName: cvName 
        })
      });

      alert("রেজিস্ট্রেশন সফল হয়েছে!");

      // ৪. ভিউ বা স্ক্রিন পরিবর্তনের লজিক
      if (initialStatus === "approved") {
        go("login");
      } else {
        go("pending"); // এজেন্ট বা ডাক্তার হলে পেন্ডিং স্ক্রিনে যাবে ইন্টারভিউয়ের জন্য
      }
    } catch (error: any) {
      alert("রেজিস্ট্রেশন ব্যর্থ হয়েছে: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "doctor" as Role, label: "ডাক্তার", icon: <User className="w-4 h-4"/> },
    { id: "patient" as Role, label: "রোগী", icon: <Heart className="w-4 h-4"/> },
    { id: "agent" as Role, label: "এজেন্ট", icon: <Headphones className="w-4 h-4"/> },
    { id: "admin" as Role, label: "অ্যাডমিন", icon: <Shield className="w-4 h-4"/> },
  ];

  const agentStepLabels = ["ব্যক্তিগত তথ্য", "শিক্ষাগত যোগ্যতা", "কাজের অভিজ্ঞতা", "সিভি আপলোড"];

  const renderForm = () => {
    if (role === "doctor") return (
      <>
        <Field label="পূর্ণ নাম (উপাধিসহ)" icon={<User className="w-5 h-5"/>} type="text" val={form.name} onChange={v => upd("name", v)} placeholder="ডা. আপনার নাম"/>
        <Field label="ইমেইল" icon={<Mail className="w-5 h-5"/>} type="email" val={form.email} onChange={v => upd("email", v)} placeholder="email@example.com"/>
        <Field label="মোবাইল নম্বর" icon={<Phone className="w-5 h-5"/>} type="tel" val={form.phone} onChange={v => upd("phone", v)} placeholder="01XXXXXXXXX"/>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1.5">বিশেষজ্ঞতা</label>
          <select value={form.specialty} onChange={e => upd("specialty", e.target.value)} className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white text-gray-900">
            <option value="">বেছে নিন</option>
            {["কার্ডিওলজি","মেডিসিন","গাইনোকোলজি","শিশু বিশেষজ্ঞ","অর্থোপেডিক","ডার্মাটোলজি","নিউরোলজি","সার্জারি","চক্ষু","অন্যান্য"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <Field label="চেম্বারের ঠিকানা" icon={<Globe className="w-5 h-5"/>} type="text" val={form.chamber} onChange={v => upd("chamber", v)} placeholder="ধানমন্ডি, ঢাকা"/>
        <Field label="পাসওয়ার্ড" icon={<Lock className="w-5 h-5"/>} type="password" val={form.password} onChange={v => upd("password", v)} placeholder="কমপক্ষে ৬ অক্ষর" show={showPass}/>
        <Field label="পাসওয়ার্ড নিশ্চিত করুন" icon={<Lock className="w-5 h-5"/>} type="password" val={form.confirmPass} onChange={v => upd("confirmPass", v)} placeholder="পাসওয়ার্ড আবার লিখুন" show={showPass}/>
      </>
    );
    if (role === "patient") return (
      <>
        <Field label="পূর্ণ নাম" icon={<User className="w-5 h-5"/>} type="text" val={form.name} onChange={v => upd("name", v)} placeholder="আপনার নাম"/>
        <Field label="মোবাইল নম্বর" icon={<Phone className="w-5 h-5"/>} type="tel" val={form.phone} onChange={v => upd("phone", v)} placeholder="01XXXXXXXXX"/>
        <Field label="ইমেইল (ঐচ্ছিক)" icon={<Mail className="w-5 h-5"/>} type="email" val={form.email} onChange={v => upd("email", v)} placeholder="email@example.com"/>
        <Field label="জন্ম তারিখ" icon={<Calendar className="w-5 h-5"/>} type="date" val={form.dob} onChange={v => upd("dob", v)} placeholder=""/>
        <Field label="পাসওয়ার্ড" icon={<Lock className="w-5 h-5"/>} type="password" val={form.password} onChange={v => upd("password", v)} placeholder="কমপক্ষে ৬ অক্ষর" show={showPass}/>
        <Field label="পাসওয়ার্ড নিশ্চিত করুন" icon={<Lock className="w-5 h-5"/>} type="password" val={form.confirmPass} onChange={v => upd("confirmPass", v)} placeholder="পাসওয়ার্ড আবার লিখুন" show={showPass}/>
      </>
    );
    if (role === "admin") return (
      <>
        <Field label="পূর্ণ নাম" icon={<User className="w-5 h-5"/>} type="text" val={form.name} onChange={v => upd("name", v)} placeholder="আপনার নাম"/>
        <Field label="ইমেইল" icon={<Mail className="w-5 h-5"/>} type="email" val={form.email} onChange={v => upd("email", v)} placeholder="email@example.com"/>
        <Field label="মোবাইল নম্বর" icon={<Phone className="w-5 h-5"/>} type="tel" val={form.phone} onChange={v => upd("phone", v)} placeholder="01XXXXXXXXX"/>
        <Field label="পাসওয়ার্ড" icon={<Lock className="w-5 h-5"/>} type="password" val={form.password} onChange={v => upd("password", v)} placeholder="কমপক্ষে ৬ অক্ষর" show={showPass}/>
        <Field label="পাসওয়ার্ড নিশ্চিত করুন" icon={<Lock className="w-5 h-5"/>} type="password" val={form.confirmPass} onChange={v => upd("confirmPass", v)} placeholder="পাসওয়ার্ড আবার লিখুন" show={showPass}/>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1.5">অ্যাডমিন কোড</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
            <input type="text" value={form.adminCode} onChange={e => upd("adminCode", e.target.value)} placeholder="ADMIN2025 (Demo)" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-900 bg-white"/>
          </div>
        </div>
      </>
    );
    
    // Agent steps
    if (step === 1) return (
      <>
        <Field label="পূর্ণ নাম" icon={<User className="w-5 h-5"/>} type="text" val={form.name} onChange={v => upd("name", v)} placeholder="আপনার পূর্ণ নাম"/>
        <Field label="ইমেইল" icon={<Mail className="w-5 h-5"/>} type="email" val={form.email} onChange={v => upd("email", v)} placeholder="email@example.com"/>
        <Field label="মোবাইল নম্বর" icon={<Phone className="w-5 h-5"/>} type="tel" val={form.phone} onChange={v => upd("phone", v)} placeholder="01XXXXXXXXX"/>
        <Field label="পাসওয়ার্ড" icon={<Lock className="w-5 h-5"/>} type="password" val={form.password} onChange={v => upd("password", v)} placeholder="কমপক্ষে ৬ অক্ষর" show={showPass}/>
        <Field label="পাসওয়ার্ড নিশ্চিত করুন" icon={<Lock className="w-5 h-5"/>} type="password" val={form.confirmPass} onChange={v => upd("confirmPass", v)} placeholder="পাসওয়ার্ড আবার লিখুন" show={showPass}/>
      </>
    );
    if (step === 2) return (
      <>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1.5">সর্বোচ্চ শিক্ষাগত যোগ্যতা</label>
          <select value={form.qualification} onChange={e => upd("qualification", e.target.value)} className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-900 bg-white">
            <option value="">বেছে নিন</option>
            {["SSC","HSC","Diploma","BSc / BA / BBA","MSc / MA / MBA","BSc Nursing","অন্যান্য"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <Field label="শিক্ষা প্রতিষ্ঠান" icon={<BookOpen className="w-5 h-5"/>} type="text" val={form.institution} onChange={v => upd("institution", v)} placeholder="প্রতিষ্ঠানের নাম"/>
        <Field label="পাসের বছর" icon={<Calendar className="w-5 h-5"/>} type="text" val={form.year} onChange={v => upd("year", v)} placeholder="যেমন: ২০২০"/>
      </>
    );
    if (step === 3) return (
      <>
        <Field label="পূর্ববর্তী কোম্পানি / প্রতিষ্ঠান" icon={<Briefcase className="w-5 h-5"/>} type="text" val={form.company} onChange={v => upd("company", v)} placeholder="কোম্পানির নাম"/>
        <Field label="পদবী / ভূমিকা" icon={<User className="w-5 h-5"/>} type="text" val={form.agentRole} onChange={v => upd("agentRole", v)} placeholder="যেমন: Customer Service Executive"/>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1.5">মোট কাজের অভিজ্ঞতা</label>
          <select value={form.workExp} onChange={e => upd("workExp", e.target.value)} className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-900 bg-white">
            <option value="">বেছে নিন</option>
            {["কোনো অভিজ্ঞতা নেই (ফ্রেশার)","৬ মাস - ১ বছর","১ - ২ বছর","২ - ৩ বছর","৩+ বছর"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </>
    );
    return (
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1.5">সিভি / রেজ্যুমে আপলোড করুন (PDF)</label>
        <div onClick={() => fileRef.current?.click()}
             className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${cvName ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-orange-400 bg-gray-50 hover:bg-orange-50"}`}>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                 onChange={e => { const f = e.target.files?.[0]; if (f) setCvName(f.name); }}/>
          {cvName ? (
            <><CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3"/>
              <p className="font-semibold text-green-700">{cvName}</p>
              <p className="text-xs text-green-500 mt-1">ফাইল সফলভাবে নির্বাচন করা হয়েছে</p></>
          ) : (
            <><Upload className="w-12 h-12 text-gray-400 mx-auto mb-3"/>
              <p className="font-semibold text-gray-600">এখানে ক্লিক করুন বা ড্র্যাগ করুন</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (সর্বোচ্চ ৫MB)</p></>
          )}
        </div>
      </div>
    );
  };

  const valid = isStepValid();

  return (
    <div className="min-h-screen flex items-center justify-center py-10 relative overflow-hidden"
         style={{ background: "linear-gradient(135deg, #FF5E13 0%, #D84315 100%)" }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-white rounded-full blur-3xl"/>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"/>
      </div>
      <div className="relative w-full max-w-lg mx-4">
        <div className="text-center mb-6">
          <button onClick={() => go("landing")} className="inline-flex items-center gap-3 text-white bg-transparent border-none cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7" style={{ color: "#FF5E13" }}/>
            </div>
            <span className="text-2xl font-bold">মেডিকেয়ার BD</span>
          </button>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">নতুন অ্যাকাউন্ট তৈরি করুন</h2>
          <p className="text-gray-500 text-sm mb-6">আপনার ভূমিকা অনুযায়ী রেজিস্ট্রেশন করুন</p>
          <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-xl mb-6">
            {tabs.map(t => (
              <button key={t.id} type="button" onClick={() => { setRole(t.id); setStep(1); setCvName(""); }}
                      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all border-none cursor-pointer ${role === t.id ? "bg-white shadow text-orange-600" : "text-gray-500 bg-transparent hover:text-gray-700"}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
          
          {/* Agent step indicator */}
          {role === "agent" && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                {agentStepLabels.map((s, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${i + 1 < step ? "bg-green-500 text-white" : i + 1 === step ? "text-white" : "bg-gray-200 text-gray-500"}`}
                         style={i + 1 === step ? { background: "#FF5E13" } : {}}>
                      {i + 1 < step ? <Check className="w-4 h-4"/> : i + 1}
                    </div>
                    {i < 3 && <div className={`h-0.5 flex-1 mx-1 ${i + 1 < step ? "bg-green-500" : "bg-gray-200"}`}/>}
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-700">ধাপ {step}: {agentStepLabels[step - 1]}</p>
            </div>
          )}

          <div className="space-y-4">{renderForm()}</div>
          
          {/* Password toggle */}
          {(role !== "agent" || step === 1) && (
            <button type="button" onClick={() => setShowPass(!showPass)} className="mt-2 text-xs text-gray-500 hover:text-gray-700 transition-colors bg-transparent border-none cursor-pointer">
              {showPass ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
            </button>
          )}

          <div className="mt-6 flex gap-3">
            {role === "agent" && step > 1 && (
              <button type="button" onClick={() => setStep(s => s - 1)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm bg-white hover:bg-gray-50 transition-all cursor-pointer">
                ← পূর্ববর্তী
              </button>
            )}
            {role === "agent" && step < 4 ? (
              <button type="button" onClick={() => setStep(s => s + 1)} disabled={!valid}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-white text-sm transition-all border-none cursor-pointer ${valid ? "hover:opacity-90 shadow-md" : "opacity-40 cursor-not-allowed"}`}
                      style={{ background: valid ? "linear-gradient(135deg, #FF5E13, #D84315)" : "#cbd5e1" }}>
                পরবর্তী ধাপ →
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={!valid || loading}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-white text-sm transition-all border-none cursor-pointer ${valid && !loading ? "hover:opacity-90 shadow-md" : "opacity-40 cursor-not-allowed"}`}
                      style={{ background: valid && !loading ? "linear-gradient(135deg, #FF5E13, #D84315)" : "#cbd5e1" }}>
                {loading ? "নিবন্ধন হচ্ছে..." : (role === "agent" ? "আবেদন জমা দিন ✓" : "রেজিস্ট্রেশন সম্পন্ন করুন ✓")}
              </button>
            )}
          </div>
          <p className="text-center text-sm text-gray-500 mt-5">
            ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
            <button type="button" onClick={() => go("login")} className="font-semibold hover:underline bg-transparent border-none cursor-pointer" style={{ color: "#FF5E13" }}>লগইন করুন</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// রিইউজেবল ফিল্ড উপাদান


// ============================================================
// PENDING APPROVAL PAGE
// ============================================================
function PendingApprovalPage({ go }: { go: (v: View) => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #FF5E13 0%, #D84315 100%)" }}>
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ClipboardList className="w-10 h-10 text-orange-500"/>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">আবেদন সফলভাবে জমা হয়েছে!</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">আপনার আবেদন ম্যানেজমেন্ট টিম রিভিউ করছে। পরবর্তী ধাপ:</p>
        <div className="text-left space-y-3 mb-8">
          {[
            { n: "১", title: "ডকুমেন্ট ভেরিফিকেশন", desc: "আমরা আপনার সিভি ও সার্টিফিকেট যাচাই করব", current: true },
            { n: "২", title: "ইন্টারভিউ", desc: "ভেরিফিকেশন শেষে আপনাকে ইন্টারভিউয়ের জন্য ডাকা হবে", current: false },
            { n: "৩", title: "অ্যাক্টিভেশন", desc: "সফল ইন্টারভিউর পর আপনার লগইন অ্যাক্সেস দেওয়া হবে", current: false },
          ].map(s => (
            <div key={s.n} className={`flex items-start gap-4 p-4 rounded-xl ${s.current ? "bg-orange-50 border border-orange-200" : "bg-gray-50"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${s.current ? "text-white" : "bg-gray-200 text-gray-500"}`}
                   style={s.current ? { background: "#FF5E13" } : {}}>
                {s.n}
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{s.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mb-6">আপনার মোবাইল নম্বরে নোটিফিকেশন পাঠানো হবে।</p>
        <div className="flex gap-3">
          <button onClick={() => go("landing")} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">হোম পেজ</button>
          <button onClick={() => go("login")} className="flex-1 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90" style={{ background: "linear-gradient(135deg, #FF5E13, #D84315)" }}>লগইন পেজ</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DOCTOR DASHBOARD
// ============================================================
function DoctorDashboard({ go, setAuth }: { go: (v: View) => void; setAuth: (u: null) => void }) {
  const [tab, setTab] = useState("overview");
  const [playingCall, setPlayingCall] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: "overview", label: "Overview", icon: <Home className="w-5 h-5"/> },
    { id: "patients", label: "Patient Logs", icon: <Users className="w-5 h-5"/> },
    { id: "team", label: "My Team", icon: <Headphones className="w-5 h-5"/> },
    { id: "qr", label: "QR Generator", icon: <QrCode className="w-5 h-5"/> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5"/> },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#FFFBF9", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#FF5E13" }}>
              <Heart className="w-5 h-5 text-white"/>
            </div>
            {sidebarOpen && <span className="font-bold text-gray-900 text-sm">মেডিকেয়ার BD</span>}
          </div>
        </div>
        {sidebarOpen && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&auto=format" alt="Doctor" className="w-10 h-10 rounded-full object-cover bg-gray-200"/>
              <div>
                <div className="text-sm font-bold text-gray-900">ডা. আহমেদ করিম</div>
                <div className="text-xs text-gray-500">কার্ডিওলজিস্ট</div>
              </div>
            </div>
          </div>
        )}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === item.id ? "text-white shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                    style={tab === item.id ? { background: "linear-gradient(135deg, #FF5E13, #D84315)" } : {}}>
              {item.icon}
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => { setAuth(null); go("landing"); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut className="w-5 h-5"/>
            {sidebarOpen && "লগ আউট"}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700"><Menu className="w-5 h-5"/></button>
            <div>
              <h1 className="font-bold text-gray-900">{navItems.find(n => n.id === tab)?.label}</h1>
              <p className="text-xs text-gray-500">রবিবার, ২৯ জুন ২০২৫</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer">
              <Bell className="w-5 h-5 text-gray-500"/>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-white text-[10px] flex items-center justify-center">৩</span>
            </div>
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&auto=format" alt="Doctor" className="w-8 h-8 rounded-full object-cover bg-gray-200"/>
          </div>
        </div>

        <div className="p-6">
          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "আজকের রোগী", value: "৩২", trend: "+৮%", icon: <Users className="w-5 h-5"/>, bg: "bg-blue-50 text-blue-600" },
                  { label: "সফল ফলো-আপ", value: "২৮", trend: "+১২%", icon: <CheckCircle className="w-5 h-5"/>, bg: "bg-green-50 text-green-600" },
                  { label: "লাইভ কল", value: "৩টি", trend: "Active", icon: <PhoneCall className="w-5 h-5"/>, bg: "bg-orange-50 text-orange-600" },
                  { label: "রেটিং", value: "৪.৯★", trend: "Google", icon: <Star className="w-5 h-5"/>, bg: "bg-yellow-50 text-yellow-600" },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg}`}>{s.icon}</div>
                      <span className="text-xs text-green-500 font-semibold">{s.trend}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-1">সাপ্তাহিক পেশেন্ট ট্র্যাকিং</h3>
                  <p className="text-xs text-gray-500 mb-4">রোগী ও ফলো-আপ তুলনা</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="day" tick={{ fontSize: 11 }}/><YAxis tick={{ fontSize: 11 }}/><Tooltip/>
                      <Line type="monotone" dataKey="patients" stroke="#FF5E13" strokeWidth={2.5} dot={false} name="রোগী"/>
                      <Line type="monotone" dataKey="followups" stroke="#22c55e" strokeWidth={2.5} dot={false} name="ফলো-আপ"/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-1">এজেন্ট পারফরম্যান্স</h3>
                  <p className="text-xs text-gray-500 mb-4">সাপ্তাহিক কল হ্যান্ডেল</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={PERF_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="day" tick={{ fontSize: 11 }}/><YAxis tick={{ fontSize: 11 }}/><Tooltip/>
                      <Bar dataKey="calls" fill="#FF5E13" radius={[4,4,0,0]} name="কল"/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">সাম্প্রতিক রোগী</h3>
                  <button onClick={() => setTab("patients")} className="text-sm font-medium hover:underline" style={{ color: "#FF5E13" }}>সব দেখুন →</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {PATIENTS.slice(0, 3).map(p => (
                    <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">{p.name[0]}</div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.phone} · বয়স {p.age}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.status === "urgent" ? "bg-red-100 text-red-600" : p.status === "follow-up" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}>
                          {p.status === "urgent" ? "⚠ জরুরি" : p.status === "follow-up" ? "ফলো-আপ" : "✓ স্থিতিশীল"}
                        </span>
                        <div className="text-xs text-gray-400 mt-1">পরবর্তী: {p.nextFollowup}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PATIENT LOGS */}
          {tab === "patients" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                  <input type="text" placeholder="রোগী খুঁজুন..." className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 w-64"/>
                </div>
                <button className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all" style={{ background: "#FF5E13" }}>
                  <Plus className="w-4 h-4"/> নতুন রোগী
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        {["রোগী","ফোন","শেষ ভিজিট","পরবর্তী ফলো-আপ","স্ট্যাটাস","ডাক্তারের নোট"].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {PATIENTS.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">{p.name[0]}</div>
                              <div><div className="font-semibold text-sm text-gray-900">{p.name}</div><div className="text-xs text-gray-400">বয়স: {p.age}</div></div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{p.phone}</td>
                          <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{p.lastVisit}</td>
                          <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{p.nextFollowup}</td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${p.status === "urgent" ? "bg-red-100 text-red-600" : p.status === "follow-up" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}>
                              {p.status === "urgent" ? "⚠ জরুরি" : p.status === "follow-up" ? "ফলো-আপ" : "✓ স্থিতিশীল"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-500 max-w-[200px] truncate">{p.doctorNote}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MY TEAM */}
          {tab === "team" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { name: "রাফি হাসান", avatar: "র", status: "live", calls: 42 },
                  { name: "সুমাইয়া খানম", avatar: "স", status: "available", calls: 38 },
                ].map((a, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">{a.avatar}</div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${a.status === "live" ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}/>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{a.name}</div>
                        <div className={`text-xs font-medium ${a.status === "live" ? "text-green-600" : "text-gray-400"}`}>
                          {a.status === "live" ? "● Live" : "○ Available"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500">আজকের কল</span>
                      <span className="font-bold text-gray-900">{a.calls}টি</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(a.calls / 60) * 100}%`, background: "#FF5E13" }}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">আজকের কল ভলিউম</h3>
                <div className="space-y-3">
                  {[
                    { label: "ইনকামিং কল", val: 125, max: 150, color: "#3b82f6" },
                    { label: "সফল ফলো-আপ", val: 98, max: 125, color: "#22c55e" },
                    { label: "মিসড কল", val: 0, max: 10, color: "#ef4444" },
                  ].map(b => (
                    <div key={b.label} className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 w-36 flex-shrink-0">{b.label}</span>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: b.max > 0 ? `${(b.val / b.max) * 100}%` : "0%", background: b.color }}/>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-8 text-right">{b.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">কল রেকর্ড ও অ্যাকশন লগ</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        {["রোগী","সময়","এজেন্ট নোট","রেকর্ডিং","আপলোড"].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {CALLS.map(c => (
                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-sm text-gray-900">{c.patient}</div>
                            <div className="text-xs text-gray-400">{c.phone}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-sm text-gray-600 whitespace-nowrap">{c.time}</div>
                            <div className="text-xs text-gray-400">{c.duration}</div>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-600 max-w-[200px]">{c.note}</td>
                          <td className="px-5 py-4">
                            {c.hasRec ? (
                              <button onClick={() => setPlayingCall(playingCall === c.id ? null : c.id)}
                                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${playingCall === c.id ? "bg-orange-100 text-orange-700" : "text-white hover:opacity-90"}`}
                                      style={playingCall !== c.id ? { background: "#FF5E13" } : {}}>
                                {playingCall === c.id ? <Pause className="w-3 h-3"/> : <Play className="w-3 h-3"/>}
                                {playingCall === c.id ? "Pause" : "Play"}
                              </button>
                            ) : <span className="text-xs text-gray-400">নেই</span>}
                          </td>
                          <td className="px-5 py-4">
                            <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                              <Upload className="w-4 h-4"/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* QR GENERATOR */}
          {tab === "qr" && (
            <div className="flex flex-col items-center py-8">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">আপনার QR কোড</h3>
                <p className="text-sm text-gray-500 mb-8">রোগীরা এই QR কোড স্ক্যান করে প্রেসক্রিপশন জমা দিতে পারবেন।</p>
                <div className="flex justify-center mb-8">
                  <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-lg">
                    <QRCodeSVG size={200} color="#FF5E13"/>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-6 bg-orange-50 rounded-xl p-4">
                  <strong className="text-orange-600">ডা. আহমেদ করিম</strong><br/>
                  কার্ডিওলজিস্ট · ধানমন্ডি, ঢাকা<br/>
                  <button onClick={() => go("qrscan")} className="text-xs text-orange-500 hover:underline mt-1 block">medicare-bd.com/dr/ahmed-karim →</button>
                </div>
                <button className="w-full py-4 rounded-2xl text-white font-bold text-sm hover:opacity-90 shadow-lg transition-all" style={{ background: "linear-gradient(135deg, #FF5E13, #D84315)" }}>
                  <Download className="w-4 h-4 inline mr-2"/>Download Ready Print Standee (PDF)
                </button>
                <div className="mt-4 flex gap-3">
                  <button className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-50 transition-all">শেয়ার করুন</button>
                  <button className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-50 transition-all">প্রিন্ট করুন</button>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === "settings" && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-bold text-gray-900">প্রোফাইল সেটিংস</h3></div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&auto=format" alt="Doctor" className="w-16 h-16 rounded-full object-cover bg-gray-200"/>
                    <div>
                      <div className="font-bold text-gray-900">ডা. আহমেদ করিম</div>
                      <div className="text-sm text-gray-500">dr.karim@example.com</div>
                      <button className="mt-1 text-xs font-semibold hover:underline" style={{ color: "#FF5E13" }}>ছবি পরিবর্তন করুন</button>
                    </div>
                  </div>
                  {[["পূর্ণ নাম","ডা. আহমেদ করিম"],["বিশেষজ্ঞতা","কার্ডিওলজি"],["চেম্বারের ঠিকানা","ধানমন্ডি ২৭, ঢাকা ১২০৯"],["মোবাইল নম্বর","01712345678"]].map(([l,v]) => (
                    <div key={l}>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">{l}</label>
                      <input defaultValue={v} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"/>
                    </div>
                  ))}
                  <button className="px-6 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all" style={{ background: "#FF5E13" }}>পরিবর্তন সেভ করুন</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ============================================================
// PATIENT DASHBOARD
// ============================================================
function PatientDashboard({ go, setAuth }: { go: (v: View) => void; setAuth: (u: null) => void }) {
  const [urgentOpen, setUrgentOpen] = useState(false);
  const [urgentMsg, setUrgentMsg] = useState("");
  const [urgentSent, setUrgentSent] = useState(false);

  const meds = [
    { name: "Amlodipine 5mg", morning: true, noon: false, night: true },
    { name: "Losartan 50mg", morning: true, noon: false, night: false },
    { name: "Aspirin 75mg", morning: false, noon: false, night: true },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #FF5E13 0%, #D84315 60%, #BF360C 100%)", fontFamily: "'Hind Siliguri', 'Inter', sans-serif" }}>
      <div className="px-4 pt-10 pb-4">
        <div className="flex items-center justify-between text-white mb-2">
          <div>
            <p className="text-sm text-orange-200">স্বাগতম,</p>
            <h1 className="text-xl font-bold">মো. রহিম উদ্দিন</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
              <Bell className="w-5 h-5 text-white"/>
            </button>
            <button onClick={() => { setAuth(null); go("landing"); }} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
              <LogOut className="w-5 h-5 text-white"/>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-t-3xl min-h-screen px-4 pt-6 pb-32">
        {/* Active Doctor Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div className="flex items-center gap-4">
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&auto=format" alt="Doctor" className="w-16 h-16 rounded-2xl object-cover bg-gray-200"/>
            <div className="flex-1">
              <div className="text-xs text-orange-500 font-semibold mb-0.5">আপনার ডাক্তার</div>
              <div className="font-bold text-gray-900">ডা. আহমেদ করিম</div>
              <div className="text-xs text-gray-500">কার্ডিওলজিস্ট · ধানমন্ডি, ঢাকা</div>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4">
            <div className="text-xs text-gray-500 mb-2">আপনার ডেডিকেটেড সাপোর্ট এজেন্ট</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">র</div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"/>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">রাফি হাসান</div>
                  <div className="text-xs text-gray-500">01712345678</div>
                </div>
              </div>
              <a href="tel:01712345678" className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md" style={{ background: "#22c55e" }}>
                <PhoneCall className="w-4 h-4"/> কল করুন
              </a>
            </div>
          </div>
        </div>

        {/* Follow-up countdown */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">পরবর্তী ফলো-আপ</h3>
            <span className="text-xs bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full font-semibold">১২ জুলাই ২০২৫</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">আমাদের এজেন্ট আপনাকে যথাসময়ে কল করে স্লট বুক করে দেবে।</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>শেষ ভিজিট: ২০ জুন</span>
              <span className="font-semibold text-orange-600">আর ১২ দিন বাকি</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "55%", background: "linear-gradient(90deg, #FF5E13, #FF7A00)" }}/>
            </div>
          </div>
        </div>

        {/* Medication Schedule */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <h3 className="font-bold text-gray-900 mb-4">ওষুধের সময়সূচি</h3>
          <div className="space-y-3">
            {meds.map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm font-medium text-gray-800">{m.name}</span>
                <div className="flex gap-1.5">
                  {[["সকাল", m.morning], ["দুপুর", m.noon], ["রাত", m.night]].map(([l, v]) => (
                    <div key={l as string} className={`text-xs px-2 py-1 rounded-lg font-medium ${v ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{l}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-2 font-medium">ডাক্তারের পরামর্শ:</div>
            <div className="text-sm text-gray-700 bg-blue-50 rounded-xl p-3">রক্তচাপ নিয়ন্ত্রণে আছে। ওষুধ চালিয়ে যান এবং লবণ কম খান।</div>
          </div>
        </div>

        {/* Prescription upload */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <h3 className="font-bold text-gray-900 mb-3">প্রেসক্রিপশন আপলোড করুন</h3>
          <div className="border-2 border-dashed border-orange-200 rounded-2xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all">
            <Camera className="w-10 h-10 text-orange-400 mx-auto mb-2"/>
            <p className="text-sm text-gray-600 font-medium">এখানে ক্লিক করে আপনার প্রেসক্রিপশনের ছবি তুলুন বা আপলোড করুন</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG বা PDF</p>
          </div>
        </div>
      </div>

      {/* Floating Emergency Button */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-30">
        <button onClick={() => setUrgentOpen(true)} className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-2xl hover:scale-105 transition-all" style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
          🚨 ডক্টরকে জানান (Urgent Query)
        </button>
      </div>

      {/* Urgent Modal */}
      {urgentOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6">
            {urgentSent ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">পাঠানো হয়েছে!</h3>
                <p className="text-gray-500 text-sm">আমাদের এজেন্ট শীঘ্রই আপনার সাথে যোগাযোগ করবেন।</p>
                <button onClick={() => { setUrgentOpen(false); setUrgentSent(false); setUrgentMsg(""); }}
                        className="mt-6 px-8 py-3 rounded-xl text-white font-semibold" style={{ background: "#FF5E13" }}>ঠিক আছে</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">জরুরি সমস্যা জানান</h3>
                  <button onClick={() => setUrgentOpen(false)}><X className="w-5 h-5 text-gray-500"/></button>
                </div>
                <textarea value={urgentMsg} onChange={e => setUrgentMsg(e.target.value)}
                          placeholder="আপনার সমস্যা বা সাইড-ইফেক্টের কথা লিখুন..."
                          className="w-full h-32 border border-gray-200 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"/>
                <button onClick={() => setUrgentSent(true)} disabled={!urgentMsg.trim()}
                        className={`w-full mt-3 py-3.5 rounded-xl font-bold text-white text-sm transition-all ${urgentMsg.trim() ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"}`}
                        style={{ background: urgentMsg.trim() ? "#ef4444" : "#cbd5e1" }}>
                  🚨 জরুরি বার্তা পাঠান
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// AGENT DASHBOARD
// ============================================================
function AgentDashboard({ go, setAuth }: { go: (v: View) => void; setAuth: (u: null) => void }) {
  const [tab, setTab] = useState("queue");
  const [selectedItem, setSelectedItem] = useState<typeof QUEUE[0] | null>(null);
  const [calling, setCalling] = useState(false);
  const [followupDate, setFollowupDate] = useState("");
  const [note, setNote] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: "queue", label: "Active Queue", icon: <Activity className="w-5 h-5"/> },
    { id: "patients", label: "My Patients", icon: <Users className="w-5 h-5"/> },
    { id: "doctors", label: "Doctors Directory", icon: <ClipboardList className="w-5 h-5"/> },
    { id: "performance", label: "Performance", icon: <BarChart2 className="w-5 h-5"/> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#FF5E13" }}>
              <Headphones className="w-5 h-5 text-white"/>
            </div>
            {sidebarOpen && <span className="font-bold text-gray-900 text-sm">Agent Workspace</span>}
          </div>
        </div>
        {sidebarOpen && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">র</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse"/>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">রাফি হাসান</div>
                <div className="text-xs text-green-600 font-medium">● Live</div>
              </div>
            </div>
          </div>
        )}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setTab(item.id); if (item.id !== "queue") setSelectedItem(null); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === item.id ? "text-white shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                    style={tab === item.id ? { background: "linear-gradient(135deg, #FF5E13, #D84315)" } : {}}>
              {item.icon}{sidebarOpen && item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => { setAuth(null); go("landing"); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut className="w-5 h-5"/>{sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700"><Menu className="w-5 h-5"/></button>
            <h1 className="font-bold text-gray-900">{navItems.find(n => n.id === tab)?.label}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-orange-100">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"/>{QUEUE.length} নতুন কুয়েরি
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {/* ACTIVE QUEUE */}
          {tab === "queue" && (
            <div className="flex h-full">
              <div className="w-80 flex-shrink-0 border-r border-gray-100 bg-white overflow-y-auto">
                <div className="p-4 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">ইনকামিং কুয়েরি</div>
                  <div className="text-xs text-gray-400 mt-0.5">{QUEUE.length}টি নতুন</div>
                </div>
                <div className="divide-y divide-gray-50">
                  {QUEUE.map(q => (
                    <button key={q.id} onClick={() => setSelectedItem(q)}
                            className={`w-full text-left p-4 hover:bg-gray-50 transition-all border-l-4 ${selectedItem?.id === q.id ? "bg-orange-50 border-orange-500" : "border-transparent"}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900 truncate">{q.patient}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{q.phone}</div>
                          <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1.5 font-medium ${q.type === "prescription" ? "bg-blue-100 text-blue-600" : q.type === "call" ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"}`}>
                            {q.type === "prescription" ? "📄 প্রেসক্রিপশন" : q.type === "call" ? "📞 কল রিকোয়েস্ট" : "❓ প্রশ্ন"}
                          </div>
                        </div>
                        {q.urgent && <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 animate-ping mt-1"/>}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{q.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {selectedItem ? (
                  <div className="space-y-5 max-w-2xl">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 font-bold text-xl">{selectedItem.patient[0]}</div>
                        <div>
                          <div className="font-bold text-lg text-gray-900">{selectedItem.patient}</div>
                          <div className="text-sm text-gray-500">{selectedItem.phone}</div>
                          <div className="text-xs text-gray-400 mt-0.5">ডাক্তার: {selectedItem.doctor}</div>
                        </div>
                      </div>
                    </div>
                    {selectedItem.type === "prescription" && (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-gray-900">প্রেসক্রিপশন ভিউয়ার</h3>
                          <div className="flex gap-2">
                            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs text-gray-600">Zoom +</button>
                            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs text-gray-600">↻ Rotate</button>
                          </div>
                        </div>
                        <div className="bg-gray-100 rounded-xl flex items-center justify-center" style={{ height: "180px" }}>
                          <div className="text-center text-gray-400"><FileText className="w-12 h-12 mx-auto mb-2"/><p className="text-sm">প্রেসক্রিপশনের ছবি এখানে দেখাবে</p></div>
                        </div>
                      </div>
                    )}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <h3 className="font-bold text-gray-900 mb-4">ডেটা এন্ট্রি ফর্ম</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 block mb-1.5">পরবর্তী ফলো-আপ ডেট</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                            <input type="date" value={followupDate} onChange={e => setFollowupDate(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"/>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 block mb-1.5">স্পেশাল নোট</label>
                          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="রোগীর সম্পর্কে গুরুত্বপূর্ণ তথ্য লিখুন..." className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300" rows={3}/>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setCalling(!calling)}
                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm transition-all shadow-lg ${calling ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
                      {calling ? <PhoneOff className="w-5 h-5"/> : <PhoneCall className="w-5 h-5"/>}
                      {calling ? "End Call & Save Records" : "Call Patient"}
                    </button>
                    {calling && (
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                          <PhoneCall className="w-4 h-4 animate-pulse"/> কল চলছে... {selectedItem.phone}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Headphones className="w-16 h-16 mx-auto mb-4 opacity-20"/>
                      <p className="text-lg font-medium text-gray-500">বাম থেকে একটি কুয়েরি সিলেক্ট করুন</p>
                      <p className="text-sm mt-1">রোগীর তথ্য এখানে দেখাবে</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MY PATIENTS */}
          {tab === "patients" && (
            <div className="p-6 overflow-y-auto h-full">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">আমার রোগীগণ</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                    <input type="text" placeholder="খুঁজুন..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 w-48"/>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {PATIENTS.map(p => (
                    <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">{p.name[0]}</div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.phone} · বয়স {p.age}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.status === "urgent" ? "bg-red-100 text-red-600" : p.status === "follow-up" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}>
                          {p.status === "urgent" ? "জরুরি" : p.status === "follow-up" ? "ফলো-আপ" : "স্থিতিশীল"}
                        </span>
                        <div className="text-xs text-gray-400 mt-1">ফলো-আপ: {p.nextFollowup}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DOCTORS DIRECTORY */}
          {tab === "doctors" && (
            <div className="p-6 overflow-y-auto h-full">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: "ডা. আহমেদ করিম", spec: "কার্ডিওলজিস্ট", chamber: "ধানমন্ডি, ঢাকা", patients: 342, phone: "01712345678" },
                  { name: "ডা. সাবিনা ইসলাম", spec: "মেডিসিন বিশেষজ্ঞ", chamber: "গুলশান, ঢাকা", patients: 215, phone: "01898765432" },
                  { name: "ডা. মাহমুদ রহমান", spec: "শিশু বিশেষজ্ঞ", chamber: "মিরপুর, ঢাকা", patients: 198, phone: "01556789012" },
                ].map((d, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">{d.name[4]}</div>
                      <div>
                        <div className="font-bold text-gray-900">{d.name}</div>
                        <div className="text-xs text-gray-500">{d.spec}</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-gray-400 flex-shrink-0"/> {d.chamber}</div>
                      <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400 flex-shrink-0"/> {d.patients} রোগী</div>
                      <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400 flex-shrink-0"/> {d.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PERFORMANCE */}
          {tab === "performance" && (
            <div className="p-6 overflow-y-auto h-full space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "আজকের কল", val: "৪২টি", bg: "bg-blue-50 text-blue-600", icon: <PhoneCall className="w-5 h-5"/> },
                  { label: "সফলতার হার", val: "৯৪%", bg: "bg-green-50 text-green-600", icon: <CheckCircle className="w-5 h-5"/> },
                  { label: "গড় কল সময়", val: "৩:৪২", bg: "bg-orange-50 text-orange-600", icon: <Clock className="w-5 h-5"/> },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>{s.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">{s.val}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">সাপ্তাহিক কল পারফরম্যান্স</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={PERF_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                    <XAxis dataKey="day" tick={{ fontSize: 11 }}/><YAxis tick={{ fontSize: 11 }}/><Tooltip/>
                    <Bar dataKey="calls" fill="#FF5E13" radius={[4,4,0,0]} name="কল"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">কল আউটকাম</h3>
                <div className="flex items-center gap-8">
                  <ResponsiveContainer width="50%" height={160}>
                    <PieChart>
                      <Pie data={CALL_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                        <Cell fill="#FF5E13"/><Cell fill="#e5e7eb"/>
                      </Pie><Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"/><span className="text-sm text-gray-600">সফল কল: <strong>৯৪%</strong></span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-200"/><span className="text-sm text-gray-600">মিসড: <strong>৬%</strong></span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function AdminDashboard({ go, setAuth, agentList, setAgentList }: {
  go: (v: View) => void; setAuth: (u: null) => void;
  agentList: Agent[]; setAgentList: (a: Agent[]) => void;
}) {
  const [tab, setTab] = useState("doctors");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: "doctors", label: "Doctor Management", icon: <User className="w-5 h-5"/> },
    { id: "agents", label: "Agent Management", icon: <UserCheck className="w-5 h-5"/> },
    { id: "billing", label: "Billing & Revenue", icon: <CreditCard className="w-5 h-5"/> },
    { id: "system", label: "System Health", icon: <Activity className="w-5 h-5"/> },
  ];

  const updateAgent = (id: string, status: AgentStatus) => setAgentList(agentList.map(a => a.id === id ? { ...a, status } : a));

  const statusLabels: Record<AgentStatus, string> = { pending: "পেন্ডিং", interview: "ইন্টারভিউ", approved: "অ্যাপ্রুভড", suspended: "সাসপেন্ড" };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 border-r border-white/10 flex flex-col transition-all duration-300`} style={{ background: "#1E293B" }}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#FF5E13" }}>
              <Shield className="w-5 h-5 text-white"/>
            </div>
            {sidebarOpen && <span className="font-bold text-white text-sm">Admin Control</span>}
          </div>
        </div>
        {sidebarOpen && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "#FF5E13" }}>A</div>
              <div><div className="text-sm font-bold text-white">Super Admin</div><div className="text-xs text-gray-400">admin@medicare-bd.com</div></div>
            </div>
          </div>
        )}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === item.id ? "text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/10"}`}
                    style={tab === item.id ? { background: "#FF5E13" } : {}}>
              {item.icon}{sidebarOpen && item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => { setAuth(null); go("landing"); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5"/>{sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto" style={{ background: "#0f172a" }}>
        <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b border-white/10" style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition-colors"><Menu className="w-5 h-5"/></button>
            <div>
              <h1 className="font-bold text-white">{navItems.find(n => n.id === tab)?.label}</h1>
              <p className="text-xs text-gray-500">Central Control Room</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>System Live
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Global Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "নিবন্ধিত ডাক্তার", val: "৫০২", trend: "+১২", icon: <User className="w-5 h-5"/> },
              { label: "অ্যাক্টিভ এজেন্ট", val: "৩৮", trend: "+৩", icon: <Headphones className="w-5 h-5"/> },
              { label: "মোট কল হ্যান্ডেল", val: "২৪,৮৯১", trend: "+৫৪৫", icon: <PhoneCall className="w-5 h-5"/> },
              { label: "এই মাসের রেভিনিউ", val: "৩.৮২L৳", trend: "+১৮%", icon: <CreditCard className="w-5 h-5"/> },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-5 border border-white/10" style={{ background: "#1E293B" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,94,19,0.15)", color: "#FF5E13" }}>{s.icon}</div>
                  <span className="text-xs text-green-400 font-semibold">{s.trend}</span>
                </div>
                <div className="text-xl font-bold text-white">{s.val}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* DOCTOR MANAGEMENT */}
          {tab === "doctors" && (
            <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: "#1E293B" }}>
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-white">Doctor Management</h3>
                <button className="text-xs text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all" style={{ background: "#FF5E13" }}>+ নতুন ডাক্তার</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {["ডাক্তার","বিশেষজ্ঞতা","রোগী","স্ট্যাটাস","অ্যাকশন"].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { name: "ডা. আহমেদ করিম", spec: "কার্ডিওলজি", patients: 342, status: "active" },
                      { name: "ডা. সাবিনা ইসলাম", spec: "মেডিসিন", patients: 0, status: "pending" },
                      { name: "ডা. মাহমুদ রহমান", spec: "শিশু রোগ", patients: 198, status: "active" },
                    ].map((d, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-semibold text-sm text-white">{d.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{d.spec}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{d.patients}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${d.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                            {d.status === "active" ? "Active" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {d.status === "pending" ? (
                            <button className="text-xs text-white font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 whitespace-nowrap" style={{ background: "#22c55e" }}>✓ Approve & Generate QR</button>
                          ) : (
                            <div className="flex gap-2">
                              <button className="text-xs text-gray-400 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all">View</button>
                              <button className="text-xs text-red-400 px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-all">Suspend</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AGENT MANAGEMENT */}
          {tab === "agents" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "#1E293B" }}>
                <h3 className="font-bold text-white mb-4">এজেন্ট–ডাক্তার অ্যাসাইনমেন্ট</h3>
                <div className="flex items-center gap-4">
                  <select className="flex-1 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={{ background: "#0f172a" }}>
                    {agentList.filter(a => a.status === "approved").map(a => <option key={a.id} className="bg-gray-900">{a.name}</option>)}
                  </select>
                  <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0"/>
                  <select className="flex-1 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={{ background: "#0f172a" }}>
                    {["ডা. আহমেদ করিম","ডা. সাবিনা ইসলাম","ডা. মাহমুদ রহমান"].map(d => <option key={d} className="bg-gray-900">{d}</option>)}
                  </select>
                  <button className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 flex-shrink-0 transition-all" style={{ background: "#FF5E13" }}>Assign</button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: "#1E293B" }}>
                <div className="px-6 py-4 border-b border-white/10">
                  <h3 className="font-bold text-white">এজেন্ট আবেদন ও ভেরিফিকেশন</h3>
                  <p className="text-xs text-gray-500 mt-0.5">pending → interview → approved/suspended</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["এজেন্ট","যোগ্যতা","অভিজ্ঞতা","আবেদনের তারিখ","স্ট্যাটাস","অ্যাকশন"].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {agentList.map(agent => (
                        <tr key={agent.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-sm text-white">{agent.name}</div>
                            <div className="text-xs text-gray-500">{agent.email}</div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-400 whitespace-nowrap">{agent.qualification}</td>
                          <td className="px-5 py-4 text-sm text-gray-400 whitespace-nowrap">{agent.workExp}</td>
                          <td className="px-5 py-4 text-sm text-gray-400 whitespace-nowrap">{agent.appliedDate}</td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                              agent.status === "approved" ? "bg-green-500/20 text-green-400" :
                              agent.status === "interview" ? "bg-blue-500/20 text-blue-400" :
                              agent.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-red-500/20 text-red-400"
                            }`}>{statusLabels[agent.status]}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2 flex-nowrap">
                              {agent.status === "pending" && (
                                <button onClick={() => updateAgent(agent.id, "interview")} className="text-xs text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/30 hover:bg-blue-500/10 transition-all whitespace-nowrap">ইন্টারভিউ শিডিউল</button>
                              )}
                              {agent.status === "interview" && (
                                <button onClick={() => updateAgent(agent.id, "approved")} className="text-xs text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-all whitespace-nowrap" style={{ background: "#22c55e" }}>✓ Approve & Activate</button>
                              )}
                              {agent.status === "approved" && (
                                <button onClick={() => updateAgent(agent.id, "suspended")} className="text-xs text-red-400 px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-all">Suspend</button>
                              )}
                              {agent.status === "suspended" && (
                                <button onClick={() => updateAgent(agent.id, "approved")} className="text-xs text-green-400 px-3 py-1.5 rounded-lg border border-green-500/20 hover:bg-green-500/10 transition-all">Reactivate</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* BILLING */}
          {tab === "billing" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "#1E293B" }}>
                <h3 className="font-bold text-white mb-4">পার-পেশেন্ট বিলিং</h3>
                <div className="space-y-3">
                  {[
                    { doctor: "ডা. আহমেদ করিম", patients: 342, amount: "৫,১৩০৳" },
                    { doctor: "ডা. মাহমুদ রহমান", patients: 198, amount: "২,৯৭০৳" },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                      <div>
                        <div className="text-sm font-semibold text-white">{b.doctor}</div>
                        <div className="text-xs text-gray-500">{b.patients} রোগী · Per-Patient Model</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-orange-400">{b.amount}</div>
                        <button className="text-xs text-gray-400 mt-1 hover:text-white transition-colors">Generate Invoice →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "#1E293B" }}>
                <h3 className="font-bold text-white mb-4">রেভিনিউ সারসংক্ষেপ</h3>
                <div className="space-y-4">
                  {[
                    { label: "পার-পেশেন্ট রেভিনিউ", val: "১,৮২,৫০০৳", color: "text-orange-400", bold: false },
                    { label: "সাবস্ক্রিপশন রেভিনিউ", val: "২,০০,০০০৳", color: "text-green-400", bold: false },
                    { label: "মোট এই মাসে", val: "৩,৮২,৫০০৳", color: "text-white", bold: true },
                  ].map((r, i) => (
                    <div key={i} className={`flex justify-between ${r.bold ? "border-t border-white/10 pt-4 font-bold" : ""}`}>
                      <span className="text-sm text-gray-400">{r.label}</span>
                      <span className={`text-sm font-bold ${r.color}`}>{r.val}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all" style={{ background: "#FF5E13" }}>
                  📲 Generate Invoice & Send to WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* SYSTEM HEALTH */}
          {tab === "system" && (
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: "API Status", val: "99.9% Uptime", detail: "Last checked: 2 min ago" },
                { label: "Database", val: "Healthy", detail: "2.3ms avg query time" },
                { label: "Call System", val: "Operational", detail: "42 active calls right now" },
                { label: "QR Service", val: "Operational", detail: "1,240 QR codes generated" },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-white/10 p-6" style={{ background: "#1E293B" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">{s.label}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                      <span className="text-xs text-green-400 font-semibold">Operational</span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-green-400">{s.val}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.detail}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ============================================================
// QR SCAN PAGE (Patient entry via QR)
// ============================================================
function QRScanPage({ go }: { go: (v: View) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isValid = name.trim().length > 0 && phone.length >= 11 && fileName.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "linear-gradient(135deg, #FF5E13 0%, #D84315 100%)", fontFamily: "'Hind Siliguri', 'Inter', sans-serif" }}>
      {submitted ? (
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/>
          <h2 className="text-xl font-bold text-gray-900 mb-2">সফলভাবে জমা হয়েছে!</h2>
          <p className="text-gray-500 text-sm mb-6">আমাদের এজেন্ট শীঘ্রই আপনার সাথে যোগাযোগ করবেন।</p>
          <button onClick={() => go("patient")} className="w-full py-3 rounded-xl text-white font-bold hover:opacity-90 transition-all" style={{ background: "#FF5E13" }}>
            আমার পোর্টালে যান →
          </button>
          <button onClick={() => go("landing")} className="w-full mt-3 py-2.5 rounded-xl text-gray-600 text-sm border border-gray-200 hover:bg-gray-50 transition-all">হোম পেজে ফিরুন</button>
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&auto=format" alt="Doctor"
                 className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-white shadow-xl bg-gray-200"/>
            <h2 className="text-white text-xl font-bold">ডক্টর আহমেদ করিম-এর</h2>
            <p className="text-orange-200 text-sm mt-1">ডিজিটাল ফলো-আপ অ্যাসিস্ট্যান্সে আপনাকে স্বাগতম।</p>
          </div>
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl p-6">
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm font-semibold block mb-1.5">আপনার নাম লিখুন</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="পূর্ণ নাম"
                       className="w-full bg-white/15 border border-white/30 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/60"/>
              </div>
              <div>
                <label className="text-white/80 text-sm font-semibold block mb-1.5">মোবাইল নম্বর</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="01XXXXXXXXX"
                       className="w-full bg-white/15 border border-white/30 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/60"/>
              </div>
              <div>
                <label className="text-white/80 text-sm font-semibold block mb-1.5">প্রেসক্রিপশন আপলোড করুন</label>
                <div onClick={() => fileRef.current?.click()}
                     className="border-2 border-dashed border-white/40 rounded-2xl p-8 text-center cursor-pointer hover:border-white/60 hover:bg-white/5 transition-all">
                  <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
                         onChange={e => setFileName(e.target.files?.[0]?.name || "")}/>
                  {fileName ? (
                    <div className="text-white"><CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-300"/><p className="text-sm font-medium truncate">{fileName}</p></div>
                  ) : (
                    <div className="text-white/60"><Camera className="w-10 h-10 mx-auto mb-2"/><p className="text-sm">এখানে ক্লিক করে আপনার প্রেসক্রিপশনের ছবি তুলুন বা আপলোড করুন</p></div>
                  )}
                </div>
              </div>
              <button onClick={() => setSubmitted(true)} disabled={!isValid}
                      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${isValid ? "bg-white hover:bg-orange-50 shadow-lg" : "bg-white/20 text-white/50 cursor-not-allowed"}`}
                      style={isValid ? { color: "#FF5E13" } : {}}>
                জমা দিন (Submit)
              </button>
            </div>
          </div>
          <button onClick={() => go("landing")} className="mt-5 w-full text-center text-white/70 text-sm hover:text-white transition-colors">← হোম পেজে ফিরুন</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN APP (FINAL CLEAN VERSION)
// ============================================================
export default function App() {
  const [view, setView] = useState<View>("landing");
  const [authUser, setAuthUser] = useState<{ name: string; role: Role } | null>(null);
  const [agentList, setAgentList] = useState<Agent[]>(INITIAL_AGENTS);

  const go = (v: View) => setView(v);
  
  const setAuth = (u: { name: string; role: Role } | null) => {
    setAuthUser(u);
    if (u) {
      setView(u.role); // লগইন হলে সরাসরি সেই ড্যাশবোর্ডে যাবে
    } else {
      setView("landing"); // লগআউট হলে হোমপেজে যাবে
    }
  };

  if (view === "landing") return <LandingPage go={go} />;
  if (view === "login") return <LoginPage go={go} setAuth={setAuth} />;
  if (view === "register") return <RegisterPage go={go} />;
  if (view === "pending") return <PendingApprovalPage go={go} />;
  
  if (view === "doctor") return <DoctorDashboard go={go} setAuth={setAuth} />;
  if (view === "patient") return <PatientDashboard go={go} setAuth={setAuth} />;
  if (view === "agent") return <AgentDashboard go={go} setAuth={setAuth} />;
  if (view === "admin") return <AdminDashboard go={go} setAuth={setAuth} agentList={agentList} setAgentList={setAgentList} />;
  if (view === "qrscan") return <QRScanPage go={go} />;

  return <LandingPage go={go} />;
}