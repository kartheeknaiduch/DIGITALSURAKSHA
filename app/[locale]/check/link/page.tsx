'use client';

import { useCallback, useEffect, useRef, useState, type ComponentProps, type ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Camera, CameraOff, ImagePlus, Link2, LoaderCircle, QrCode, ShieldAlert, X } from 'lucide-react';
import jsQR from 'jsqr';
import CheckResult from '@/components/CheckResult';

type CheckResultData = Omit<ComponentProps<typeof CheckResult>, 'onReset'>;

export default function LinkCheck() {
  const t = useTranslations('linkCheck');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResultData | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [imageError, setImageError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const scanBusyRef = useRef(false);

  const stopCamera = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOpen(false);
    scanBusyRef.current = false;
  }, []);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const handleCheckUrl = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      let submitUrl = url.trim();
      if (!/^https?:\/\//i.test(submitUrl)) submitUrl = 'https://' + submitUrl;
      const res = await fetch('/api/check/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: submitUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to analyse this URL.');
      setResult(data);
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'Unable to analyse this URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const acceptDecoded = useCallback((value: string) => {
    stopCamera();
    setDecodedText(value);
    setImageError('');
    if (/^https?:\/\//i.test(value.trim())) {
      setUrl(value.trim());
    } else {
      setUrl('');
    }
  }, [stopCamera]);

  const startCamera = async () => {
    setCameraError('');
    setImageError('');
    setDecodedText('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is unavailable in this browser or app wrapper. Open the secure website in Chrome or update the APK wrapper to support camera access.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setCameraOpen(true);
      requestAnimationFrame(async () => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        try { await video.play(); } catch { /* wait for the next animation frame */ }

        const scanFrame = () => {
          if (!streamRef.current || !videoRef.current || !canvasRef.current) return;
          const currentVideo = videoRef.current;
          const canvas = canvasRef.current;
          if (!scanBusyRef.current && currentVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && currentVideo.videoWidth > 0) {
            scanBusyRef.current = true;
            canvas.width = currentVideo.videoWidth;
            canvas.height = currentVideo.videoHeight;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(currentVideo, 0, 0, canvas.width, canvas.height);
              const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: 'attemptBoth' });
              if (code?.data) {
                acceptDecoded(code.data);
                return;
              }
            }
            scanBusyRef.current = false;
          }
          frameRef.current = requestAnimationFrame(scanFrame);
        };
        frameRef.current = requestAnimationFrame(scanFrame);
      });
    } catch (error) {
      setCameraError(error instanceof Error && error.name === 'NotAllowedError'
        ? 'Camera permission was denied. Allow camera access in your browser or app settings, then try again.'
        : 'Could not open the camera. Check that another app is not using it and that camera permission is enabled.');
      stopCamera();
    }
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setImageError('');
    setDecodedText('');
    if (!file.type.startsWith('image/')) {
      setImageError('Choose a valid QR code image.');
      return;
    }
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('Image could not be read.');
        ctx.drawImage(image, 0, 0);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: 'attemptBoth' });
        if (!code?.data) setImageError('No readable QR code was found. Try a clearer, well-lit image.');
        else acceptDecoded(code.data);
      } catch {
        setImageError('Could not read this image. Please try another QR image.');
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setImageError('Could not open this image. Please try another file.');
    };
    image.src = objectUrl;
  };

  if (result) return <CheckResult {...result} onReset={() => { setResult(null); setImageError(''); }} />;

  return (
    <div className="bg-panel rounded-3xl border border-line p-5 sm:p-8 md:p-12 animate-fadein shadow-card">
      <div className="mb-8">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-marigold/15 text-marigold-deep"><ShieldAlert className="h-6 w-6" /></div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mb-2">{t('h1')}</h2>
        <p className="text-ink/60">{t('p')}</p>
      </div>

      <form className="mb-6" onSubmit={(event) => { event.preventDefault(); void handleCheckUrl(); }}>
        <label htmlFor="url-to-check" className="mb-2 block text-sm font-bold text-ink">Website URL</label>
        <input
          id="url-to-check"
          type="text"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          className="input-base"
          placeholder={t('urlPlaceholder')}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="btn-primary mt-4 w-full justify-center sm:w-auto" type="submit" disabled={!url.trim() || loading}>
          {loading ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Scanning URL…</> : <><Link2 className="h-4 w-4" /> {t('urlBtn')}</>}
        </button>
      </form>

      <div className="relative flex items-center py-5">
        <div className="flex-grow border-t border-line" />
        <span className="mx-4 flex-shrink-0 text-ink/40 text-xs font-bold uppercase tracking-wider">Scan a QR code</span>
        <div className="flex-grow border-t border-line" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button type="button" onClick={cameraOpen ? stopCamera : startCamera} className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-line bg-white p-4 text-left font-bold text-ink transition hover:border-marigold/60 hover:bg-marigold/5">
          {cameraOpen ? <CameraOff className="h-5 w-5 text-danger" /> : <Camera className="h-5 w-5 text-marigold-deep" />}
          <span>{cameraOpen ? 'Stop camera' : 'Scan with camera'}</span>
        </button>
        <label className="flex min-h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl border border-line bg-white p-4 font-bold text-ink transition hover:border-marigold/60 hover:bg-marigold/5">
          <ImagePlus className="h-5 w-5 text-marigold-deep" />
          <span>Upload QR image</span>
          <input type="file" accept="image/*" className="sr-only" onChange={handleImage} />
        </label>
      </div>

      {cameraOpen && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-ink p-3">
          <div className="relative overflow-hidden rounded-xl bg-black">
            <video ref={videoRef} className="aspect-[4/3] max-h-[55vh] w-full object-cover" playsInline muted aria-label="Live QR scanning camera" />
            <div className="pointer-events-none absolute inset-[16%] rounded-2xl border-2 border-marigold shadow-[0_0_0_999px_rgba(0,0,0,0.16)]" />
          </div>
          <p className="mt-3 text-center text-sm text-white/80">Point your camera at a QR code and hold steady.</p>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
      {!cameraOpen && <canvas ref={canvasRef} className="hidden" />}

      {cameraError && <div role="alert" className="mt-4 rounded-xl border border-danger/20 bg-danger-light p-4 text-sm text-danger-deep">{cameraError}</div>}
      {imageError && <div role="alert" className="mt-4 rounded-xl border border-marigold/30 bg-marigold/10 p-4 text-sm text-ink">{imageError}</div>}

      {decodedText && (
        <div className="mt-5 rounded-2xl border border-line bg-cream p-4 sm:p-5">
          <div className="mb-2 flex items-center gap-2 font-bold text-ink"><QrCode className="h-5 w-5 text-marigold-deep" /> QR code decoded</div>
          <p className="break-all rounded-xl bg-white p-3 text-sm text-ink">{decodedText}</p>
          {/^https?:\/\//i.test(decodedText.trim()) ? (
            <p className="mt-3 text-sm text-ink/65">The link has been placed in the URL field. Scan it to check for known threats and suspicious indicators before opening it.</p>
          ) : (
            <p className="mt-3 text-sm text-ink/65">This QR code does not contain a standard web URL. Review the content carefully; it has not been verified as safe.</p>
          )}
          <button type="button" onClick={() => { setDecodedText(''); setUrl(''); }} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-ink/60 hover:text-ink"><X className="h-4 w-4" /> Clear decoded result</button>
        </div>
      )}

      <p className="mt-5 text-xs leading-relaxed text-ink/50">QR decoding happens on this device. Only a URL you choose to scan is sent to the link-analysis service. A decoded QR code is not automatically safe.</p>
    </div>
  );
}
