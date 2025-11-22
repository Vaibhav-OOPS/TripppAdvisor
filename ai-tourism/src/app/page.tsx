'use client';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PlaceDetails from '../components/PlaceDetails';

export default function Home() {
  const [place, setPlace] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activePlace, setActivePlace] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setActivePlace(place);
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-900 relative">
      {/* Sidebar always visible */}
      <Sidebar />
      {/* Main Content: overlays everything except sidebar */}
      <main className="flex-1 p-6 flex flex-col items-center gap-6 justify-center relative">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover z-0"
          src="/videos/background.mp4"
        />
        <form className="w-full max-w-lg flex gap-3 relative z-10" onSubmit={handleSubmit}>
          <input
            value={place}
            onChange={e => setPlace(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white"
            placeholder="Enter a city or tourist spot..."
            disabled={submitting}
            autoFocus
          />
          <button
            type="submit"
            className="px-5 py-3 rounded padded bg-black text-cream font-bold hover:bg-charcoal transition"

            disabled={submitting}
          >
            {submitting ? '...' : 'Find'}
          </button>
        </form>
        <div className="w-full max-w-3xl relative z-10 mt-8">
          {activePlace && <PlaceDetails place={activePlace} />}
        </div>
      </main>
    </div>
  );
}
