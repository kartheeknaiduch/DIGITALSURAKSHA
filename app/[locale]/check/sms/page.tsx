'use client';

import { useState, type ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import CheckResult from '@/components/CheckResult';

type CheckResultData = Omit<ComponentProps<typeof CheckResult>, 'onReset'>;

export default function SmsCheck() {
  const t = useTranslations('smsCheck');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResultData | null>(null);

  const handleCheck = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/check/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
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
    return <CheckResult {...result} onReset={() => setResult(null)} />;
  }

  return (
    <div className="bg-panel rounded-3xl border border-line p-8 md:p-12 animate-fadein shadow-card">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-ink mb-2">{t('h1')}</h2>
        <p className="text-ink/60">{t('p')}</p>
      </div>

      <div className="mb-6">
        <textarea
          className="textarea-base"
          placeholder={t('placeholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-2 text-xs text-ink/40 text-right">{t('hint')}</div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button 
          className="btn-primary w-full sm:w-auto" 
          onClick={handleCheck}
          disabled={!text.trim() || loading}
        >
          {loading ? 'Scanning...' : t('btn')}
        </button>
        {text && (
          <button className="text-ink/50 hover:text-ink text-sm font-bold transition-colors" onClick={() => setText('')}>
            {t('clearBtn')}
          </button>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-line">
        <div className="text-sm font-bold text-ink/50 mb-4">{t('exampleLabel')}</div>
        <div className="flex flex-wrap gap-2">
          <button 
            className="px-4 py-2 bg-ink/5 hover:bg-ink/10 rounded-full text-sm font-medium transition-colors"
            onClick={() => setText("Dear Customer, Your SBI account KYC has expired today. Your account will be blocked in 24 hours. Click here to update: http://sbi-kyc-update.xyz/login Do not share your OTP.")}
          >
            {t('example1')}
          </button>
          <button 
            className="px-4 py-2 bg-ink/5 hover:bg-ink/10 rounded-full text-sm font-medium transition-colors"
            onClick={() => setText("Congratulations! You have won ₹50,000 in the Amazon Lucky Draw. Send ₹999 as processing fee to UPI ID: scammer@upi to claim your prize immediately.")}
          >
            {t('example2')}
          </button>
          <button 
            className="px-4 py-2 bg-ink/5 hover:bg-ink/10 rounded-full text-sm font-medium transition-colors"
            onClick={() => setText("Your ICICI Bank account has been debited by Rs 50,000. If this was not you, please call immediately on 9876543210 to block the transaction. Enter OTP when asked.")}
          >
            {t('example3')}
          </button>
        </div>
      </div>
    </div>
  );
}
