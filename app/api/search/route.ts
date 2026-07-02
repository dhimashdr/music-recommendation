import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

// Inisialisasi koneksi Neon (gunakan pool yang sama dengan rute recommend)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: Request) {
  try {
    // 1. Ambil parameter URL (misal: /api/search?q=mina)
    const { searchParams } = new URL(request.url);
    const queryInput = searchParams.get('q');

    // Jika input kosong atau terlalu pendek, kembalikan array kosong agar menghemat resource
    if (!queryInput || queryInput.length < 2) {
      return NextResponse.json([]);
    }

    // Ubah input pengguna ke huruf kecil agar cocok dengan search_alias kita
    const sanitizedQuery = queryInput.toLowerCase();

    // =================================================================
    // 2. EKSEKUSI QUERY PENCARIAN DENGAN TRIGRAM
    // =================================================================
    
    // Kita menembak kolom 'search_alias' yang sudah berisi gabungan huruf alfabet.
    // similarity() menghasilkan nilai 0.0 hingga 1.0 (semakin mendekati 1 semakin mirip).
    const sqlQuery = `
      SELECT track_id, track_name, artists, track_name_alias, artists_alias 
      FROM tracks 
      WHERE similarity(search_alias, $1) > 0.1 
      ORDER BY similarity(search_alias, $1) DESC
      LIMIT 20;
    `;
    
    const { rows } = await pool.query(sqlQuery, [sanitizedQuery]);

    // =================================================================
    // 3. KEMBALIKAN HASIL KE FRONTEND
    // =================================================================
    
    return NextResponse.json(rows);

  } catch (error) {
    console.error("Terjadi kesalahan di API search:", error);
    return NextResponse.json(
      { error: "Gagal memproses pencarian" }, 
      { status: 500 }
    );
  }
}