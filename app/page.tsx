"use client";

import { useState, useEffect, useRef } from 'react';
import { SongCards, SongCardsSkeleton } from './components/song_cards';
import Image from 'next/image';
import Link from 'next/link';

// Struktur data untuk tipe data Lagu (Opsional jika menggunakan TypeScript)
interface Song {
  track_id: string;
  track_name: string;
  artists: string;
  track_name_alias: string;
  artists_alias: string;
  cover_url?: string;
}

export default function SpotifyRecommender() {
  // 1. State Management
  const [inputText, setInputText] = useState("");
  const [dropdownResults, setDropdownResults] = useState<Song[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false); // Loading untuk dropdown
  const [isLoadingRecs, setIsLoadingRecs] = useState(false); // Loading untuk tombol rekomendasi
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2. Efek Debounce untuk Pencarian Otomatis (Neon)
  useEffect(() => {
    // Jika input terlalu pendek atau user baru saja mengklik lagu dari dropdown, jangan cari lagi
    if (inputText.length < 2 || selectedTrackId) {
      setDropdownResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(inputText)}`);
        if (res.ok) {
          const data = await res.json();
          setDropdownResults(data);
        }
      } catch (error) {
        console.error("Gagal memuat hasil pencarian:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Batas tunggu ketikan 300ms

    return () => clearTimeout(timer);
  }, [inputText, selectedTrackId]);

  // 3. Menutup dropdown jika user mengklik di luar area input
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4. Aksi saat lagu di Dropdown diklik
  const handleSelectSong = (lagu: Song) => {
    setInputText(`${lagu.track_name} - ${lagu.artists}`); // Isi kolom input
    setSelectedTrackId(lagu.track_id); // Amankan ID untuk FastAPI
    setDropdownResults([]); // Tutup dropdown
  };

  // 5. Aksi Mengetik Ulang (Reset status pilihan sebelumnya)
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setSelectedTrackId(null); // Reset ID karena lagu lama sudah tidak valid dengan teks baru
  };

  // 6. Trigger Utama: Tombol "Cari Rekomendasi" (FastAPI + Neon)
  const handleFetchRecommendations = async () => {
    if (!selectedTrackId) return;

    setIsLoadingRecs(true);
    setRecommendations([]); // Bersihkan hasil rekomendasi lama jika ada
    
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_id: selectedTrackId }),
      });

      if (!res.ok) throw new Error("Gagal mengambil data");
      
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Gagal mendapatkan rekomendasi:", error);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Nav Bar */}
      <div className='fixed top-0 w-full min-h-16 bg-black/40 backdrop-blur-md z-50 shadow shadow-white/20 flex px-6 md:px-8 lg:px-16 gap-3 items-center-safe'>
        <div className='w-8 aspect-square relative rounded-md overflow-clip'>
          <Image src="/images/dhimashdr.jpg" alt='a' fill sizes='100' loading='eager'></Image>
        </div>
        <div className='ml-auto flex gap-6 text-xs md:text-sm font-medium'>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto space-y-12 mt-16 px-6 md:px-12">

      {/* Hero Section */}
      <div className='w-full flex flex-col md:flex-row justify-center-safe items-center-safe pt-8 gap-8'>
          <div className='flex-2/3 flex flex-col text-center md:text-left'>
            <h1 className='font-bold text-xl md:text-2xl text-green-400'>Music Recommendation Engine</h1>
            <p className='font-light text-[0.5rem] md:text-xs'>Find music recommendations based on your favorite or chosen music.</p>
          </div>
          <div className="flex-1/3 w-1/2 aspect-7/5 relative">
          <Image src="/images/hero-image.png" alt='a' fill draggable={false} sizes='100' loading='eager'></Image>  
        </div>
        </div>

        {/* Zona Input & Dropdown */}
        <div ref={dropdownRef} className="relative max-w-2xl mx-auto flex gap-3">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={inputText}
              onChange={handleTyping}
              placeholder="Type the music title or the artist"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder-neutral-500"
            />
            {(inputText && !isSearching) && (
              <button className='pb-1 h-4 w-4 right-4 top-3.5 absolute bg-neutral-700 flex items-center justify-center rounded-full text-neutral-400 text-sm' onClick={() => {setInputText('')}}>x</button>
            )}
            {/* Animasi Spinner Kecil saat Debounce Mencari */}
            {isSearching && (
              <div className="absolute right-4 top-3.5 w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            )}

            {/* Dropdown Hasil Pencarian */}
            {dropdownResults.length > 0 && (
              <ul className="absolute top-14 left-0 w-full bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl overflow-hidden z-20 max-h-64 overflow-y-auto divide-y divide-neutral-800/50">
                {dropdownResults.map((lagu) => (
                  <li 
                    key={lagu.track_id}
                    onClick={() => handleSelectSong(lagu)}
                    className="p-3 hover:bg-neutral-800/70 cursor-pointer transition-colors space-y-0.5"
                  >
                    <div className="font-semibold text-sm text-neutral-200">{lagu.track_name}</div>
                    <div className="text-xs text-neutral-400 tracking-wide">
                      {lagu.track_name_alias || lagu.track_name} • {lagu.artists_alias || lagu.artists}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Tombol Eksekusi Utama */}
          <button 
            onClick={handleFetchRecommendations}
            disabled={!selectedTrackId || isLoadingRecs}
            className="bg-green-600 hover:bg-green-500 disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-600 px-6 font-bold text-sm rounded-lg transition-all duration-200 flex items-center shadow-lg shadow-green-900/20 disabled:shadow-none"
          >
            {isLoadingRecs ? 'Seaching...' : 'Search'}
          </button>
        </div>

        {/* Zona Tampilan Hasil Rekomendasi */}
        <div className="max-w-2xl mx-auto">

          {isLoadingRecs && (
            <div className="flex flex-col gap-2">
              {[...Array(5)].map((_, i) => (
                <SongCardsSkeleton key={i}/>
              ))}
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="flex flex-col gap-2 mx-auto">
              {recommendations.map((lagu) => (
                <SongCards track_id={lagu.track_id} track_name={lagu.track_name} artists={lagu.artists} track_name_alias={lagu.track_name_alias} artists_alias={lagu.artists_alias} key={lagu.track_id}/>
              ))}
            </div>
          )}

          {/* Kondisi Default Jika Belum Ada Aksi */}
          {/* {!isLoadingRecs && recommendations.length === 0 && (
            <div className="text-center py-16 text-neutral-600 text-sm">
              Silakan pilih lagu di atas dan ketuk tombol eksekusi untuk melihat rekomendasi.
            </div>
          )} */}
        </div>

        <br />
        <br />
      </div>
    </div>
  );
}