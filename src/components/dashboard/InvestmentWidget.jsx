import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Check, X, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function InvestmentWidget({ opportunity }) {
  const { isKycVerified, walletBalance } = useApp();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [investStep, setInvestStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const o = opportunity;
  const investAmount = Number(amount) || 0;
  const expectedReturn = Math.round(investAmount * (o.returnRate / 100) * (o.tenureMonths / 12));
  const maturityValue = investAmount + expectedReturn;
  const monthlyIncome = o.paymentFrequency === 'Monthly' ? Math.round(expectedReturn / o.tenureMonths) : 0;

  const handleInvest = () => {
    if (!isKycVerified) {
      setShowKycModal(true);
      return;
    }
    setShowModal(true);
    setInvestStep(0);
  };

  const handleConfirm = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setInvestStep(5);
    }, 2000);
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-white p-5 sticky top-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Invest in this opportunity</h3>

        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">Investment amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Min ₹${o.minInvestment.toLocaleString('en-IN')}`}
            className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            min={o.minInvestment}
            max={o.maxInvestment}
          />
          <div className="flex justify-between text-[10px] text-text-muted mt-1">
            <span>Min ₹{o.minInvestment.toLocaleString('en-IN')}</span>
            <span>Max ₹{o.maxInvestment.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {investAmount > 0 && (
          <div className="mt-4 space-y-2 rounded-lg bg-bg-alt p-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Expected returns</span>
              <span className="font-medium text-green">₹{expectedReturn.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Maturity value</span>
              <span className="font-medium text-text-primary">₹{maturityValue.toLocaleString('en-IN')}</span>
            </div>
            {monthlyIncome > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Est. monthly income</span>
                <span className="font-medium text-text-primary">₹{monthlyIncome.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleInvest}
          disabled={investAmount < o.minInvestment || investAmount > o.maxInvestment}
          className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:bg-border disabled:text-text-muted disabled:cursor-not-allowed"
        >
          Invest Now
        </button>

        {!isKycVerified && (
          <p className="mt-2 text-[10px] text-text-muted text-center">KYC verification required before investing</p>
        )}
      </div>

      {/* KYC Required Modal */}
      <AnimatePresence>
        {showKycModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/30" onClick={() => setShowKycModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl border border-border p-6 max-w-sm w-full shadow-xl text-center">
              <button onClick={() => setShowKycModal(false)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-bg-alt"><X className="h-4 w-4 text-text-muted" /></button>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-soft">
                <ShieldCheck className="h-7 w-7 text-amber" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Complete your KYC</h3>
              <p className="mt-2 text-sm text-text-secondary">You need to verify your identity before making investments. It only takes a few minutes.</p>
              <button
                onClick={() => { setShowKycModal(false); navigate('/dashboard/kyc'); }}
                className="mt-5 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                Complete KYC <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => setShowKycModal(false)} className="mt-2 text-xs text-text-muted hover:text-text-secondary transition-colors">
                Maybe later
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Investment Flow Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/30" onClick={() => investStep < 5 && setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl border border-border p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-bg-alt"><X className="h-4 w-4 text-text-muted" /></button>

              {investStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-text-primary">Confirm investment</h3>
                  <div className="rounded-lg bg-bg-alt p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-muted">Opportunity</span><span className="font-medium text-text-primary">{o.issuer}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Amount</span><span className="font-medium text-text-primary">₹{investAmount.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Expected return</span><span className="font-medium text-green">{o.returnRate}% p.a.</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Tenure</span><span className="font-medium text-text-primary">{o.tenure}</span></div>
                  </div>
                  <button onClick={() => setInvestStep(1)} className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90">
                    Continue
                  </button>
                </div>
              )}

              {investStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-text-primary">Select payment method</h3>
                  {[
                    { id: 'wallet', label: 'Wallet Balance', sub: `₹${walletBalance.toLocaleString('en-IN')} available` },
                    { id: 'upi', label: 'UPI', sub: 'Pay via UPI ID or QR' },
                    { id: 'netbanking', label: 'Net Banking', sub: 'All major banks supported' },
                    { id: 'neft', label: 'NEFT/RTGS', sub: 'Bank transfer' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full text-left rounded-lg border p-4 transition-colors ${paymentMethod === m.id ? 'border-accent bg-accent-soft' : 'border-border hover:bg-bg-alt'}`}
                    >
                      <p className="text-sm font-medium text-text-primary">{m.label}</p>
                      <p className="text-xs text-text-muted">{m.sub}</p>
                    </button>
                  ))}
                  <div className="flex gap-3">
                    <button onClick={() => setInvestStep(0)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-alt">Back</button>
                    <button onClick={() => setInvestStep(2)} className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90">Continue</button>
                  </div>
                </div>
              )}

              {investStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-text-primary">Review & confirm</h3>
                  <div className="rounded-lg bg-bg-alt p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-muted">Investment</span><span className="font-medium">₹{investAmount.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Return</span><span className="font-medium text-green">{o.returnRate}% p.a.</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Maturity value</span><span className="font-medium">₹{maturityValue.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Payment</span><span className="font-medium">{paymentMethod === 'wallet' ? 'Wallet' : paymentMethod.toUpperCase()}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Platform fee</span><span className="font-medium">{o.platformFee}</span></div>
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 rounded border-border" />
                    <span className="text-xs text-text-secondary">I have read and agree to the investment terms, risk disclosures, and platform fee structure.</span>
                  </label>
                  <div className="flex gap-3">
                    <button onClick={() => setInvestStep(1)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-alt">Back</button>
                    <button
                      onClick={handleConfirm}
                      disabled={!agreed || processing}
                      className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:bg-border disabled:text-text-muted inline-flex items-center justify-center gap-2"
                    >
                      {processing ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : 'Confirm & Pay'}
                    </button>
                  </div>
                </div>
              )}

              {investStep === 5 && (
                <div className="text-center space-y-4 py-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-soft">
                    <Check className="h-7 w-7 text-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Investment successful</h3>
                  <p className="text-sm text-text-secondary">Your investment of ₹{investAmount.toLocaleString('en-IN')} in {o.issuer} has been confirmed.</p>
                  <div className="rounded-lg bg-bg-alt p-3 text-xs text-text-muted">
                    Confirmation ID: INV-{Date.now().toString(36).toUpperCase()}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => navigate('/dashboard/portfolio')} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-alt">
                      View Portfolio
                    </button>
                    <button onClick={() => { setShowModal(false); navigate('/dashboard/marketplace'); }} className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90">
                      Explore More
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
