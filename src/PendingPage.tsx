import React from 'react';
import { ClipboardList } from 'lucide-react';

// আপনার প্রজেক্টের টাইপ অনুযায়ী এগুলো এখানে ডিফাইন করে নেবেন
type Role = "doctor" | "patient" | "agent" | "admin";
type View = "landing" | "login" | "register" | "pending" | "doctor" | "patient" | "agent" | "admin";

export function PendingPage({ go, role }: { go: (v: View) => void; role: Role }) {
  return (
    <div className="min-h-screen flex items-center justify-center py-10 relative overflow-hidden"
         style={{ background: "linear-gradient(135deg, #FF5E13 0%, #D84315 100%)" }}>
      
      <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl p-8 text-center">
        
        {/* আইকন বক্স */}
        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ClipboardList className="w-9 h-9 text-orange-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">আবেদন সফলভাবে জমা হয়েছে!</h2>
        
        {/* ডাক্তার ও এজেন্টদের জন্য কন্ডিশনাল মেসেজ */}
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          {role === "doctor" 
            ? "আপনার প্রদানকৃত তথ্য এবং চেম্বারের ঠিকানা আমাদের অ্যাডমিন টিম ভেরিফিকেশন করছে। সফল হলে আপনি লগইন করতে পারবেন।" 
            : "আপনার আবেদন ম্যানেজমেন্ট টিম রিভিউ করছে। পরবর্তী ধাপগুলো নিচে দেওয়া হলো:"}
        </p>

        {/* ধাপসমূহ */}
        <div className="space-y-4 text-left mb-8">
          {role === "doctor" ? (
            <>
              <div className="flex gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">১</div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">তথ্য ও লাইসেন্স যাচাইকরণ</h4>
                  <p className="text-xs text-gray-500 mt-0.5">আপনার বিএমডিসি (BMDC) তথ্য চেক করা হচ্ছে।</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl opacity-60">
                <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">২</div>
                <div>
                  <h4 className="font-bold text-gray-700 text-sm">অ্যাডমিন অনুমোদন</h4>
                  <p className="text-xs text-gray-400 mt-0.5">অনুমোদন সম্পন্ন হওয়া মাত্রই প্রোফাইল লাইভ হবে।</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">১</div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">ডকুমেন্ট ভেরিফিকেশন</h4>
                  <p className="text-xs text-gray-500 mt-0.5">সিভি ও সার্টিফিকেট যাচাই করা হচ্ছে।</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl opacity-60">
                <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">২</div>
                <div>
                  <h4 className="font-bold text-gray-700 text-sm">ইন্টারভিউ</h4>
                  <p className="text-xs text-gray-400 mt-0.5">আপনাকে ইন্টারভিউয়ের জন্য ডাকা হবে।</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* বোতাম */}
        <button type="button" onClick={() => go("login")} className="w-full py-3 rounded-xl font-bold text-white text-sm shadow-md"
                style={{ background: "linear-gradient(135deg, #FF5E13, #D84315)" }}>
          লগইন পেজে যান
        </button>

      </div>
    </div>
  );
}