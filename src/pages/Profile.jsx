import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Calendar, ShieldCheck, Landmark, SlidersHorizontal,
  Lock, Users, Share2, Copy, Check, ChevronDown, ChevronUp, Trash2, AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const kycStepLabels = ['PAN Verification', 'Aadhaar Verification', 'Bank Account', 'Review & Submit'];

function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-bg-alt/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-alt">
            <Icon className="h-4 w-4 text-text-secondary" />
          </div>
          <span className="text-sm font-semibold text-text-primary">{title}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-border-light pt-4">{children}</div>}
    </div>
  );
}

function FieldRow({ label, value, editable = false }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border-light last:border-0">
      <span className="text-sm text-text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-text-primary">{value}</span>
        {editable && <button className="text-xs text-accent hover:underline">Edit</button>}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, kyc, isKycVerified } = useApp();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [riskAppetite, setRiskAppetite] = useState('moderate');
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [notifications, setNotifications] = useState({
    newOpportunities: true,
    repayments: true,
    performance: false,
    platformNews: false,
  });
  const [notifChannels, setNotifChannels] = useState({
    email: true,
    sms: true,
    whatsapp: false,
    push: true,
  });

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold text-text-primary mb-6">Profile & settings</h1>

      {/* Personal Info */}
      <Section title="Personal information" icon={User}>
        <div>
          <FieldRow label="Full name" value={user.name} editable />
          <FieldRow label="Email" value={user.email} editable />
          <FieldRow label="Mobile" value={user.mobile} editable />
          <FieldRow label="Date of birth" value={new Date(user.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
          <FieldRow label="Member since" value={new Date(user.joinedDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} />
        </div>
      </Section>

      {/* KYC */}
      <Section title="KYC status" icon={ShieldCheck}>
        <div>
          {isKycVerified ? (
            <div className="flex items-center gap-2 rounded-lg bg-green-soft px-4 py-3 text-sm font-medium text-green mb-4">
              <Check className="h-4 w-4" /> KYC verified
            </div>
          ) : (
            <div className="mb-4">
              <div className="flex items-center gap-2 rounded-lg bg-amber-soft px-4 py-3 text-sm font-medium text-amber mb-3">
                <AlertTriangle className="h-4 w-4" /> KYC {kyc.status === 'not_started' ? 'not started' : kyc.status === 'pending_verification' ? 'under review' : 'incomplete'}
              </div>
              <div className="flex gap-2 mb-3">
                {kycStepLabels.map((label, i) => (
                  <div key={label} className="flex-1">
                    <div className={`h-1.5 rounded-full ${i < kyc.currentStep ? 'bg-green' : 'bg-border'}`} />
                    <span className="text-[10px] text-text-muted mt-1 block">{label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/dashboard/kyc')}
                className="text-sm font-medium text-accent hover:underline"
              >
                {kyc.currentStep > 0 ? 'Resume KYC' : 'Start KYC'}
              </button>
            </div>
          )}
          {isKycVerified && (
            <div className="space-y-0">
              <FieldRow label="PAN" value={`${kyc.pan.number.slice(0, 2)}XXXX${kyc.pan.number.slice(-2)}`} />
              <FieldRow label="Aadhaar" value="XXXX-XXXX-1234" />
              <FieldRow label="Bank" value={`${kyc.bank.bankName} — XXXX${kyc.bank.accountNumber.slice(-4)}`} />
            </div>
          )}
        </div>
      </Section>

      {/* Bank Accounts */}
      <Section title="Bank accounts" icon={Landmark} defaultOpen={false}>
        <div>
          {isKycVerified ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <input type="radio" checked readOnly className="text-accent" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{kyc.bank.bankName}</p>
                    <p className="text-xs text-text-muted">XXXX{kyc.bank.accountNumber.slice(-4)} · {kyc.bank.type}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-green-soft text-green rounded-md px-2 py-0.5">Primary</span>
              </div>
              <button className="text-sm font-medium text-accent hover:underline">+ Add new bank account</button>
            </div>
          ) : (
            <p className="text-sm text-text-muted">Complete KYC to add bank accounts.</p>
          )}
        </div>
      </Section>

      {/* Investment Preferences */}
      <Section title="Investment preferences" icon={SlidersHorizontal} defaultOpen={false}>
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Risk appetite</label>
            <div className="flex gap-2">
              {['conservative', 'moderate', 'aggressive'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskAppetite(r)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                    riskAppetite === r ? 'border-accent bg-accent-soft text-accent' : 'border-border text-text-secondary hover:bg-bg-alt'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Notification preferences</label>
            <div className="space-y-2">
              {[
                { key: 'newOpportunities', label: 'New opportunity alerts' },
                { key: 'repayments', label: 'Repayment reminders' },
                { key: 'performance', label: 'Portfolio performance updates' },
                { key: 'platformNews', label: 'Platform news & updates' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-text-secondary">{label}</span>
                  <button
                    onClick={() => setNotifications((p) => ({ ...p, [key]: !p[key] }))}
                    className={`relative h-5 w-9 rounded-full transition-colors ${notifications[key] ? 'bg-green' : 'bg-border'}`}
                  >
                    <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${notifications[key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Channels</label>
            <div className="flex flex-wrap gap-2">
              {['email', 'sms', 'whatsapp', 'push'].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setNotifChannels((p) => ({ ...p, [ch]: !p[ch] }))}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    notifChannels[ch] ? 'border-accent bg-accent-soft text-accent' : 'border-border text-text-muted'
                  }`}
                >
                  {ch === 'whatsapp' ? 'WhatsApp' : ch === 'sms' ? 'SMS' : ch.charAt(0).toUpperCase() + ch.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Security */}
      <Section title="Security settings" icon={Lock} defaultOpen={false}>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-text-primary">Two-factor authentication</p>
              <p className="text-xs text-text-muted">Add an extra layer of security</p>
            </div>
            <button
              onClick={() => setTwoFactor(!twoFactor)}
              className={`relative h-5 w-9 rounded-full transition-colors ${twoFactor ? 'bg-green' : 'bg-border'}`}
            >
              <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${twoFactor ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-text-primary">Biometric login</p>
              <p className="text-xs text-text-muted">Use fingerprint or face ID (mobile)</p>
            </div>
            <button
              onClick={() => setBiometric(!biometric)}
              className={`relative h-5 w-9 rounded-full transition-colors ${biometric ? 'bg-green' : 'bg-border'}`}
            >
              <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${biometric ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border-light pt-3">
            <div>
              <p className="text-sm font-medium text-text-primary">Active sessions</p>
              <p className="text-xs text-text-muted">1 active session (this device)</p>
            </div>
            <button className="text-xs font-medium text-red hover:underline">Logout all</button>
          </div>
        </div>
      </Section>

      {/* Nominee */}
      <Section title="Nominee details" icon={Users} defaultOpen={false}>
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">Add a nominee for your investment accounts.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-muted mb-1 block">Nominee name</label>
              <input type="text" placeholder="Full name" className="w-full rounded-lg border border-border bg-bg-alt px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-text-muted mb-1 block">Relationship</label>
              <select className="w-full rounded-lg border border-border bg-bg-alt px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20">
                <option>Select</option>
                <option>Spouse</option>
                <option>Parent</option>
                <option>Child</option>
                <option>Sibling</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Share percentage</label>
            <input type="number" placeholder="100" max={100} className="w-32 rounded-lg border border-border bg-bg-alt px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20" />
          </div>
          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors">Save Nominee</button>
        </div>
      </Section>

      {/* Referral */}
      <Section title="Referral program" icon={Share2} defaultOpen={false}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Your referral code</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm font-mono font-medium text-text-primary">{user.referralCode}</div>
              <button onClick={handleCopyReferral} className="rounded-lg border border-border px-3 py-2.5 hover:bg-bg-alt transition-colors">
                {copied ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4 text-text-muted" />}
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-alt transition-colors">Share via WhatsApp</button>
            <button className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-alt transition-colors">Share via Email</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-bg-alt p-3 text-center">
              <p className="text-xs text-text-muted">Referrals</p>
              <p className="text-lg font-semibold text-text-primary">3</p>
            </div>
            <div className="rounded-lg bg-bg-alt p-3 text-center">
              <p className="text-xs text-text-muted">Bonus earned</p>
              <p className="text-lg font-semibold text-green">₹1,500</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Account Closure */}
      <div className="pt-4 pb-8">
        <button className="text-xs font-medium text-text-muted hover:text-red transition-colors flex items-center gap-1.5">
          <Trash2 className="h-3 w-3" /> Close my account
        </button>
      </div>
    </div>
  );
}
