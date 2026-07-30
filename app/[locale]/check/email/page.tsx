'use client';

import { useState, type ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import CheckResult from '@/components/CheckResult';

type CheckResultData = Omit<ComponentProps<typeof CheckResult>, 'onReset'>;

export default function EmailCheck() {
  const t = useTranslations('emailCheck');
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResultData | null>(null);

  const handleCheck = async () => {
    if (!sender && !subject && !body) return;
    setLoading(true);
    try {
      const res = await fetch('/api/check/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, subject, body })
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

  const isFormEmpty = !sender.trim() && !subject.trim() && !body.trim();

  return (
    <div className="bg-panel rounded-3xl border border-line p-8 md:p-12 animate-fadein shadow-card">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-ink mb-2">{t('h1')}</h2>
        <p className="text-ink/60">{t('p')}</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-bold text-ink/70 mb-1">From / Sender</label>
          <input
            type="text"
            className="input-base"
            placeholder={t('senderPlaceholder')}
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-ink/70 mb-1">Subject</label>
          <input
            type="text"
            className="input-base"
            placeholder={t('subjectPlaceholder')}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-ink/70 mb-1">Email Body</label>
          <textarea
            className="textarea-base"
            placeholder={t('bodyPlaceholder')}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="text-xs text-ink/40 text-right">{t('hint')}</div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button 
          className="btn-primary w-full sm:w-auto" 
          onClick={handleCheck}
          disabled={isFormEmpty || loading}
        >
          {loading ? 'Scanning...' : t('scanBtn')}
        </button>
        {!isFormEmpty && (
          <button className="text-ink/50 hover:text-ink text-sm font-bold transition-colors" onClick={() => { setSender(''); setSubject(''); setBody(''); }}>
            Clear all
          </button>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-line">
        <div className="text-sm font-bold text-ink/50 mb-4">{t('exampleLabel')}</div>
        <div className="flex flex-col gap-2">
          <button 
            className="p-3 bg-ink/5 hover:bg-ink/10 rounded-xl text-left transition-colors"
            onClick={() => {
              setSender('alerts@sbi-update.com');
              setSubject('URGENT: Your Account Will Be Suspended');
              setBody('Dear Customer, your KYC details are incomplete. Click the link below to verify your identity within 24 hours to prevent account suspension. http://sbi-verify.xyz');
            }}
          >
            <div className="font-bold text-sm text-ink mb-1">{t('ex1')}</div>
            <div className="text-xs text-ink/60 truncate">alerts@sbi-update.com • URGENT: Your Account Will...</div>
          </button>
          
          <button 
            className="p-3 bg-ink/5 hover:bg-ink/10 rounded-xl text-left transition-colors"
            onClick={() => {
              setSender('support@incometax-gov.in');
              setSubject('Tax Refund Unclaimed');
              setBody('You have an unclaimed tax refund of ₹45,000 for the financial year. Please share your bank account number and UPI PIN immediately to process the refund.');
            }}
          >
            <div className="font-bold text-sm text-ink mb-1">{t('ex2')}</div>
            <div className="text-xs text-ink/60 truncate">support@incometax-gov.in • Tax Refund Unclaimed</div>
          </button>
        </div>
      </div>
    </div>
  );
}
