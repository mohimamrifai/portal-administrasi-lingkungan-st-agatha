import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sanitizeFileName } from '@/lib/uploads';

// Base directory untuk file uploads
const UPLOADS_BASE_DIR = path.join(process.cwd(), 'src', 'uploads');

// Handler untuk GET request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Extract path dari parameter
    const resolvedParams = await params;
    const pathParts = resolvedParams.path || [];
    
    // Validasi: pastikan ada path yang diberikan
    if (!pathParts.length) {
      return new NextResponse('Path not specified', { status: 400 });
    }
    
    // Sanitasi setiap bagian path dan gabungkan
    const sanitizedPathParts = pathParts.map(part => sanitizeFileName(part));
    const filePath = path.join(UPLOADS_BASE_DIR, ...sanitizedPathParts);
    
    // Pastikan file tersebut ada di dalam direktori uploads
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(UPLOADS_BASE_DIR)) {
      return new NextResponse('Invalid file path', { status: 403 });
    }
    
    // Cek apakah file ada
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    // Cek apakah path mengarah ke file (bukan direktori)
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      return new NextResponse('Not a file', { status: 400 });
    }
    
    // Baca file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Tentukan content type berdasarkan ekstensi file
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream'; // Default content type
    
    // Map ekstensi ke content type yang sesuai
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.txt': 'text/plain',
      '.csv': 'text/csv'
    };
    
    if (ext in contentTypeMap) {
      contentType = contentTypeMap[ext];
    }
    
    // Ekstak nama file dari path untuk header Content-Disposition
    const fileName = path.basename(filePath);
    
    // Set nama file untuk didownload
    const headers = {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${fileName}"`,
    };
    
    // Jika PDF atau gambar, default-nya inline, selain itu attachment (download)
    if (!contentType.startsWith('image/') && contentType !== 'application/pdf') {
      headers['Content-Disposition'] = `attachment; filename="${fileName}"`;
    }
    
    return new NextResponse(fileBuffer, { headers });
    
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 