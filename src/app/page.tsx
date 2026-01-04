
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to EduPortal</h1>
      <p className="text-lg text-slate-600 mb-8">Please visit your center's subdomain to login.</p>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-sm text-slate-500 mb-2">Example:</p>
        <code className="bg-slate-100 px-2 py-1 rounded text-blue-600 font-mono">center1.localhost:3000</code>
      </div>
    </div>
  );
}
