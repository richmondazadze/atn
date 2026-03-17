import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../components/ui/input-otp';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function PhoneOTP() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

  function handleVerify() {
    if (otp.length < 6) {
      toast.error('Enter the 6-digit code');
      return;
    }
    toast.success('Phone verified!');
    navigate('/customer');
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background border border-border rounded-lg p-6 sm:p-8 text-center">
        <Link to="/login" className="inline-flex items-center gap-2 text-muted hover:text-foreground text-xs font-medium mb-6">
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4" aria-hidden="true">
          <Smartphone size={32} className="text-primary" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Enter verification code</h1>
        <p className="text-sm text-muted mb-8">
          We sent a 6-digit code to<br />
          <strong className="text-foreground break-all">{user.phone ?? 'your phone'}</strong>
        </p>

        <div className="flex justify-center mb-8" aria-label="One-time verification code">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full h-11"
            onClick={handleVerify}
            disabled={otp.length < 6}
          >
            Verify
          </Button>
          <Button variant="ghost" className="w-full h-11" onClick={() => toast.success('Code resent')} aria-label="Resend verification code">
            Resend code
          </Button>
          <Link to="/login" className="block text-sm text-muted hover:text-foreground py-2">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
