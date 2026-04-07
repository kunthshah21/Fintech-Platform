import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const stepLabels = ['PAN', 'Aadhaar', 'Bank', 'Review'];

export default function KYCBanner() {
  const { kyc, isKycVerified } = useApp();
  const navigate = useNavigate();

  if (isKycVerified) return null;

  const completedSteps = kyc.currentStep;

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-soft">
            <ShieldCheck className="h-5 w-5 text-amber" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {kyc.status === 'pending_verification' ? 'KYC under review' : 'Complete your KYC to start investing'}
            </h3>
            <p className="mt-0.5 text-xs text-text-secondary">
              {kyc.status === 'pending_verification'
                ? 'We are verifying your documents. This usually takes 2-5 minutes.'
                : `${completedSteps} of 4 steps completed — takes about ${4 - completedSteps} minutes`
              }
            </p>
          </div>
        </div>

        {kyc.status !== 'pending_verification' && (
          <button
            onClick={() => navigate('/dashboard/kyc')}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 shrink-0"
          >
            {completedSteps > 0 ? 'Resume KYC' : 'Complete KYC'}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {kyc.status !== 'pending_verification' && (
        <div className="mt-4 flex gap-1.5">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full ${i < completedSteps ? 'bg-green' : i === completedSteps ? 'bg-accent/30' : 'bg-border'}`} />
              <span className="mt-1 block text-[10px] font-medium text-text-muted">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
