import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

// 1. Inisialisasi koneksi ke Neon secara global agar koneksi tidak terputus-putus
// Pastikan kamu sudah menaruh DATABASE_URL di file .env.local
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(request: Request) {
  try {
    // Ambil track_id yang dikirim dari tombol "Cari Rekomendasi" di frontend
    const body = await request.json();
    const { track_id } = body;

    if (!track_id) {
      return NextResponse.json(
        { error: "track_id tidak ditemukan di request body" }, 
        { status: 400 }
      );
    }

    // =================================================================
    // TAHAP A: Minta 5 ID Rekomendasi dari FastAPI (Kalkulasi ML)
    // =================================================================
    
    // Ganti URL ini dengan URL FastAPI-mu nanti (misal URL dari Hugging Face)
    const FASTAPI_URL = process.env.FASTAPI_URL;
    
    const mlResponse = await fetch(`${FASTAPI_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ track_id }),
    });

    if (!mlResponse.ok) {
      throw new Error("Gagal mengambil data dari server ML FastAPI");
    }

    const mlData = await mlResponse.json();
    const recommendedIds: string[] = mlData.recommendations; 
    // Hasilnya: ["id1", "id2", "id3", "id4", "id5"]

    // =================================================================
    // TAHAP B: Ambil Metadata (Judul, Cover, dll) dari Neon Database
    // =================================================================
    
    // Kita menggunakan klausa = ANY($1) untuk mencocokkan array di PostgreSQL.
    // Ini jauh lebih aman dari SQL Injection daripada merakit string manual.
    const query = `
      SELECT track_id, track_name, artists, track_name_alias, artists_alias 
      FROM tracks 
      WHERE track_id = ANY($1)
    `;
    
    const { rows } = await pool.query(query, [recommendedIds]);

    // =================================================================
    // TAHAP C: Urutkan Ulang Sesuai Output ML (Sangat Krusial!)
    // =================================================================
    
    // Database SQL biasanya mengembalikan baris secara acak/tidak berurutan.
    // Kita harus menyusun ulang 'rows' agar urutannya persis seperti 'recommendedIds' 
    // (dari yang jarak audionya paling mirip hingga yang kurang mirip).
    const sortedRecommendations = recommendedIds.map((id) => {
      return rows.find((row) => row.track_id === id);
    }).filter(Boolean); // Filter untuk berjaga-jaga jika ada ID yang tidak ketemu di DB

    // =================================================================
    // TAHAP D: Kirim JSON Akhir ke Layar Pengguna
    // =================================================================
    
    return NextResponse.json({
      status: "success",
      input_track_id: track_id,
      recommendations: sortedRecommendations
    });

  } catch (error) {
    console.error("Terjadi kesalahan di API route:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server internal" }, 
      { status: 500 }
    );
  }
}