import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function VerifyEmail() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-border rounded p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Mail size={32} className="text-primary" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Check your email</h1>
        <p className="text-sm text-muted mb-6">
          We sent a verification link to<br />
          <strong className="text-foreground">{user.email}</strong>
        </p>

        <Alert className="border-accent bg-accent/10 mb-6 text-left">
          <AlertDescription className="text-sm text-foreground">
            Click the link in the email to verify your account and continue.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => toast.success('Verification email resent')}
          >
            Resend verification email
          </Button>
          <Link to="/login">
            <Button variant="outline" className="w-full border-border">Back to login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
