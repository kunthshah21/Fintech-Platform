import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, CreditCard, Fingerprint, Landmark, FileCheck,
  Loader2, Upload, ArrowRight, ArrowLeft, Sparkles, Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const steps = [
  { id: 'pan', label: 'PAN verification', icon: CreditCard, time: '~1 min' },
  { id: 'aadhaar', label: 'Aadhaar verification', icon: Fingerprint, time: '~1 min' },
  { id: 'bank', label: 'Bank account', icon: Landmark, time: '~1 min' },
  { id: 'review', label: 'Review & submit', icon: FileCheck, time: '~30 sec' },
];

function ProgressStepper({ currentStep, kycStatus }) {
  return (
    <div className="flex gap-2 mb-8">
      {steps.map((step, i) => {
        const done = i < currentStep || kycStatus === 'verified';
        const active = i === currentStep && kycStatus !== 'verified';
        return (
          <div key={step.id} className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                done ? 'bg-green text-white' : active ? 'bg-accent text-white' : 'bg-border text-text-muted'
              }`}>
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full ${done ? 'bg-green' : 'bg-border'}`} />
              )}
            </div>
            <p className={`text-[11px] font-medium ${done ? 'text-green' : active ? 'text-text-primary' : 'text-text-muted'}`}>
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function FieldLabel({ children, hint }) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <label className="text-sm font-medium text-text-primary">{children}</label>
      {hint && (
        <span className="group relative">
          <Info className="h-3.5 w-3.5 text-text-muted cursor-help" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-48 rounded-lg bg-accent text-white text-xs p-2 shadow-lg z-10">{hint}</span>
        </span>
      )}
    </div>
  );
}

function PANStep({ data, onChange, onVerify }) {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(data.verified);
  const [error, setError] = useState('');

  const formatPAN = (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  const isValidPAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.number);

  const handleVerify = () => {
    if (!isValidPAN) { setError('Please enter a valid PAN (e.g., ABCDE1234F)'); return; }
    setError('');
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      onChange({ ...data, name: data.name || 'Kunth Shah', verified: true });
      onVerify({ ...data, name: data.name || 'Kunth Shah' });
    }, 1500);
  };

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel hint="Your PAN is required under SEBI regulations for investor verification.">PAN number</FieldLabel>
        <input
          type="text"
          value={data.number}
          onChange={(e) => { onChange({ ...data, number: formatPAN(e.target.value) }); setVerified(false); }}
          placeholder="ABCDE1234F"
          className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent font-mono tracking-wider"
          maxLength={10}
          disabled={verified}
        />
        {error && <p className="mt-1 text-xs text-red">{error}</p>}
      </div>

      <div>
        <FieldLabel>Full name (as per PAN)</FieldLabel>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Will be auto-filled after verification"
          className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          disabled={verified}
        />
      </div>

      <div>
        <FieldLabel>Date of birth</FieldLabel>
        <input
          type="date"
          value={data.dob}
          onChange={(e) => onChange({ ...data, dob: e.target.value })}
          className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          disabled={verified}
        />
      </div>

      {verified ? (
        <div className="flex items-center gap-2 rounded-lg bg-green-soft px-4 py-3 text-sm font-medium text-green">
          <Check className="h-4 w-4" /> PAN verified successfully
        </div>
      ) : (
        <button
          onClick={handleVerify}
          disabled={verifying || !data.number}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:bg-border disabled:text-text-muted disabled:cursor-not-allowed"
        >
          {verifying ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</> : 'Verify PAN'}
        </button>
      )}
    </div>
  );
}

function AadhaarStep({ data, onChange, onVerify }) {
  const [method, setMethod] = useState(data.method || '');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(data.verified);

  const handleDigiLocker = () => {
    setMethod('digilocker');
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      onChange({ ...data, method: 'digilocker', verified: true });
      onVerify({ method: 'digilocker' });
    }, 2000);
  };

  const handleUpload = () => {
    setMethod('manual');
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      onChange({ ...data, method: 'manual', verified: true });
      onVerify({ method: 'manual' });
    }, 1500);
  };

  if (verified) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg bg-green-soft px-4 py-3 text-sm font-medium text-green">
          <Check className="h-4 w-4" /> Aadhaar verified via {method === 'digilocker' ? 'DigiLocker' : 'manual upload'}
        </div>
        <p className="text-xs text-text-muted">Last 8 digits have been masked per UIDAI norms. Only XXXX-XXXX-1234 is stored.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border p-5 text-center space-y-3">
        <Fingerprint className="h-8 w-8 text-text-secondary mx-auto" />
        <h4 className="text-sm font-semibold text-text-primary">Verify with DigiLocker</h4>
        <p className="text-xs text-text-secondary">Securely fetch your Aadhaar via the government DigiLocker service. This is the fastest method.</p>
        <button
          onClick={handleDigiLocker}
          disabled={verifying}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:bg-border disabled:text-text-muted"
        >
          {verifying && method === 'digilocker' ? <><Loader2 className="h-4 w-4 animate-spin" /> Fetching...</> : 'Fetch via DigiLocker'}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="rounded-xl border border-border p-5 space-y-3">
        <h4 className="text-sm font-semibold text-text-primary">Upload manually</h4>
        <p className="text-xs text-text-secondary">Upload front and back of your Aadhaar card (PDF or JPG, max 5MB each).</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleUpload}
            disabled={verifying}
            className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-4 hover:bg-bg-alt transition-colors"
          >
            <Upload className="h-5 w-5 text-text-muted" />
            <span className="text-xs text-text-secondary">Front side</span>
          </button>
          <button
            onClick={handleUpload}
            disabled={verifying}
            className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-4 hover:bg-bg-alt transition-colors"
          >
            <Upload className="h-5 w-5 text-text-muted" />
            <span className="text-xs text-text-secondary">Back side</span>
          </button>
        </div>
        {verifying && method === 'manual' && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Loader2 className="h-4 w-4 animate-spin" /> Processing upload...
          </div>
        )}
      </div>

      <p className="text-xs text-text-muted">Your Aadhaar number will be masked per UIDAI norms. We only store the last 4 digits.</p>
    </div>
  );
}

function BankStep({ data, onChange, onVerify }) {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(data.verified);

  const ifscBankMap = {
    'HDFC': 'HDFC Bank',
    'ICIC': 'ICICI Bank',
    'SBIN': 'State Bank of India',
    'UTIB': 'Axis Bank',
    'KKBK': 'Kotak Mahindra Bank',
    'PUNB': 'Punjab National Bank',
  };

  const derivedBank = data.ifsc?.length >= 4 ? ifscBankMap[data.ifsc.slice(0, 4).toUpperCase()] || '' : '';

  const handleVerify = () => {
    if (!data.accountNumber || !data.ifsc) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      const bankName = derivedBank || 'Bank of India';
      onChange({ ...data, bankName, holderName: data.holderName || 'Kunth Shah', verified: true });
      onVerify({ bankName, holderName: data.holderName || 'Kunth Shah' });
    }, 2000);
  };

  if (verified) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg bg-green-soft px-4 py-3 text-sm font-medium text-green">
          <Check className="h-4 w-4" /> Bank account verified
        </div>
        <div className="rounded-xl border border-border p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Bank</span>
            <span className="font-medium text-text-primary">{data.bankName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Account</span>
            <span className="font-medium text-text-primary font-mono">XXXX{data.accountNumber.slice(-4)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Holder</span>
            <span className="font-medium text-text-primary">{data.holderName}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel hint="We perform a penny-drop verification to confirm your account.">Account number</FieldLabel>
        <input
          type="text"
          value={data.accountNumber}
          onChange={(e) => onChange({ ...data, accountNumber: e.target.value.replace(/\D/g, '') })}
          placeholder="Enter account number"
          className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent font-mono"
        />
      </div>

      <div>
        <FieldLabel>IFSC code</FieldLabel>
        <input
          type="text"
          value={data.ifsc}
          onChange={(e) => onChange({ ...data, ifsc: e.target.value.toUpperCase().slice(0, 11) })}
          placeholder="e.g., HDFC0001234"
          className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent font-mono tracking-wider"
        />
        {derivedBank && (
          <p className="mt-1 text-xs text-green">{derivedBank}</p>
        )}
      </div>

      <div>
        <FieldLabel>Account type</FieldLabel>
        <div className="flex gap-3">
          {['savings', 'current'].map((t) => (
            <button
              key={t}
              onClick={() => onChange({ ...data, type: t })}
              className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                data.type === t ? 'border-accent bg-accent-soft text-accent' : 'border-border text-text-secondary hover:bg-bg-alt'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Account holder name</FieldLabel>
        <input
          type="text"
          value={data.holderName}
          onChange={(e) => onChange({ ...data, holderName: e.target.value })}
          placeholder="Auto-filled from PAN"
          className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        />
      </div>

      <button
        onClick={handleVerify}
        disabled={verifying || !data.accountNumber || !data.ifsc}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:bg-border disabled:text-text-muted disabled:cursor-not-allowed"
      >
        {verifying ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</> : 'Verify bank account'}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button className="flex items-center gap-3 w-full rounded-lg border border-dashed border-border p-4 hover:bg-bg-alt transition-colors">
        <Upload className="h-5 w-5 text-text-muted" />
        <div className="text-left">
          <p className="text-sm font-medium text-text-primary">Upload cancelled cheque</p>
          <p className="text-xs text-text-secondary">PDF or JPG, max 5MB</p>
        </div>
      </button>
    </div>
  );
}

function ReviewStep({ kyc, onSubmit }) {
  const [agreed, setAgreed] = useState(false);
  const [riskDeclared, setRiskDeclared] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmit();
    }, 2500);
  };

  if (submitting) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-10 w-10 text-accent animate-spin" />
        <p className="text-sm text-text-secondary">We are verifying your details. This usually takes 2-5 minutes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border p-4 space-y-3">
        <h4 className="text-sm font-semibold text-text-primary">Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5 border-b border-border-light">
            <span className="text-text-muted">Name</span>
            <span className="font-medium text-text-primary">{kyc.pan.name}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border-light">
            <span className="text-text-muted">PAN</span>
            <span className="font-medium text-text-primary font-mono">{kyc.pan.number.slice(0, 2)}XXXX{kyc.pan.number.slice(-2)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border-light">
            <span className="text-text-muted">Aadhaar</span>
            <span className="font-medium text-text-primary">XXXX-XXXX-1234</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border-light">
            <span className="text-text-muted">Bank</span>
            <span className="font-medium text-text-primary">{kyc.bank.bankName} — XXXX{kyc.bank.accountNumber.slice(-4)}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-text-muted">Verification</span>
            <span className="font-medium text-text-primary">{kyc.aadhaar.method === 'digilocker' ? 'DigiLocker' : 'Manual Upload'}</span>
          </div>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={riskDeclared} onChange={(e) => setRiskDeclared(e.target.checked)} className="mt-0.5 rounded border-border" />
        <span className="text-xs text-text-secondary">I declare that I understand the risks associated with alternative investments and have read the risk profiling disclosures.</span>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 rounded border-border" />
        <span className="text-xs text-text-secondary">I agree to the <span className="text-text-primary underline">Terms & Conditions</span> and <span className="text-text-primary underline">Privacy Policy</span> of YieldVest.</span>
      </label>

      <button
        onClick={handleSubmit}
        disabled={!agreed || !riskDeclared}
        className="w-full rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:bg-border disabled:text-text-muted disabled:cursor-not-allowed"
      >
        Submit KYC
      </button>
    </div>
  );
}

export default function KYC() {
  const { kyc, updateKyc, completeKycStep, verifyKyc, isKycVerified } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(kyc.currentStep < 4 ? kyc.currentStep : 0);
  const [localKyc, setLocalKyc] = useState(kyc);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (kyc.status === 'verified') setShowSuccess(true);
  }, [kyc.status]);

  const handleStepVerify = (step, data) => {
    completeKycStep(step, data);
    if (step < 3) {
      setTimeout(() => setCurrentStep(step + 1), 400);
    }
  };

  const handleSubmit = () => {
    completeKycStep(3, {});
    setTimeout(() => {
      verifyKyc();
      setShowSuccess(true);
    }, 100);
  };

  if (isKycVerified || showSuccess) {
    return (
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-border bg-white p-8 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-soft">
            <Sparkles className="h-8 w-8 text-green" />
          </div>
          <h2 className="text-2xl font-semibold text-text-primary">KYC verified</h2>
          <p className="mt-2 text-sm text-text-secondary">Your identity has been verified. You can now invest in all available opportunities.</p>
          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-alt transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/dashboard/marketplace')}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
            >
              Start Investing <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const stepContent = [
    <PANStep
      key="pan"
      data={localKyc.pan}
      onChange={(pan) => setLocalKyc((p) => ({ ...p, pan }))}
      onVerify={(data) => handleStepVerify(0, data)}
    />,
    <AadhaarStep
      key="aadhaar"
      data={localKyc.aadhaar}
      onChange={(aadhaar) => setLocalKyc((p) => ({ ...p, aadhaar }))}
      onVerify={(data) => handleStepVerify(1, data)}
    />,
    <BankStep
      key="bank"
      data={localKyc.bank}
      onChange={(bank) => setLocalKyc((p) => ({ ...p, bank }))}
      onVerify={(data) => handleStepVerify(2, data)}
    />,
    <ReviewStep
      key="review"
      kyc={localKyc}
      onSubmit={handleSubmit}
    />,
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">KYC verification</h1>
        <p className="mt-1 text-sm text-text-secondary">Complete these 4 steps to start investing. Your progress is saved automatically.</p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <ProgressStepper currentStep={currentStep} kycStatus={kyc.status} />

        {(() => {
          const StepIcon = steps[currentStep].icon;
          return (
            <div className="flex items-center gap-2 mb-5 rounded-lg bg-bg-alt px-3 py-2">
              <StepIcon className="h-4 w-4 text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">{steps[currentStep].label}</span>
              <span className="text-xs text-text-muted ml-auto">{steps[currentStep].time}</span>
            </div>
          );
        })()}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {stepContent[currentStep]}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between border-t border-border-light pt-4">
          <button
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-alt disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {currentStep < 3 && (
            <button
              onClick={() => setCurrentStep((s) => Math.min(3, s + 1))}
              disabled={currentStep >= kyc.currentStep}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:bg-border disabled:text-text-muted disabled:cursor-not-allowed"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
