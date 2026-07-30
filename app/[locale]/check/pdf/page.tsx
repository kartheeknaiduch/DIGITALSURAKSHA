'use client';

import { useState, useCallback, type ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import CheckResult from '@/components/CheckResult';
import { useDropzone } from 'react-dropzone';

type CheckResultData = Omit<ComponentProps<typeof CheckResult>, 'onReset'>;

export default function PdfCheck() {
  const t = useTranslations('pdfCheck');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResultData | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/check/pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return <CheckResult {...result} onReset={() => { setResult(null); setFile(null); }} />;
  }

  return (
    <div className="bg-panel rounded-3xl border border-line p-8 md:p-12 animate-fadein shadow-card">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-ink mb-2">{t('h1')}</h2>
        <p className="text-ink/60">{t('p')}</p>
      </div>

      <div 
        {...getRootProps()} 
        className={`mt-4 border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group
          ${isDragActive ? 'border-marigold bg-marigold/5' : 'border-line hover:border-marigold/50 hover:bg-marigold/5'}`}
      >
        <input {...getInputProps()} />
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors
          ${isDragActive ? 'bg-marigold/20' : 'bg-ink/5 group-hover:bg-marigold/10'}`}>
          <svg className={`w-8 h-8 transition-colors ${isDragActive ? 'text-marigold' : 'text-ink/40 group-hover:text-marigold'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div className={`font-bold mb-2 transition-colors ${isDragActive ? 'text-marigold-deep' : 'text-ink group-hover:text-marigold-deep'}`}>
          {isDragActive ? 'Drop file here' : t('dropzone')}
        </div>
        <div className="text-sm text-ink/50">{t('hint')}</div>
      </div>

      {file && (
        <div className="mt-6 flex items-center justify-between p-4 bg-ink/5 rounded-xl border border-line animate-fadein">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-ink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="truncate text-sm font-medium text-ink">{file.name}</div>
          </div>
          <button 
            className="text-danger hover:text-danger-deep p-2"
            onClick={(e) => { e.stopPropagation(); setFile(null); }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="mt-8 flex">
        <button 
          className="btn-primary w-full sm:w-auto" 
          onClick={handleScan}
          disabled={!file || loading}
        >
          {loading ? 'Scanning File...' : t('scanBtn')}
        </button>
      </div>
    </div>
  );
}
