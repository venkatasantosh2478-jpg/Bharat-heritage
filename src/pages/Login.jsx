import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, getSystemCredentials } from "@/components/lib/AuthContext";
import { getSiteConfig } from "@/components/lib/siteConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LogIn, Mail, Lock, Loader2, Sparkles, ShieldCheck
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [siteConfig, setSiteConfig] = useState(getSiteConfig);
  const { loginWithEmailPassword, loginWithGoogle, loginWithGoogleEmail, quickSwitchRole } = useAuth();
  const navigate = useNavigate();
  const returnTo = safeReturnTo();

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) setSiteConfig(e.detail);
    };
    window.addEventListener("by-site-config-updated", handleUpdate);
    return () => window.removeEventListener("by-site-config-updated", handleUpdate);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedUser = await loginWithEmailPassword(email, password);
      if (loggedUser.role === "tourist") {
        navigate("/profile");
      } else {
        navigate(returnTo !== "/login" && returnTo !== "/" ? returnTo : "/admin");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const loggedUser = await loginWithGoogle();
      if (loggedUser?.role === "tourist") {
        navigate(returnTo !== "/login" && returnTo !== "/admin" && returnTo !== "/" ? returnTo : "/profile");
      } else {
        navigate(returnTo !== "/login" && returnTo !== "/" ? returnTo : "/admin");
      }
    } catch (err) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDirect = async (accountEmail, accountName) => {
    setError("");
    setLoading(true);
    try {
      const loggedUser = await loginWithGoogleEmail(accountEmail, accountName);
      if (loggedUser?.role === "tourist") {
        navigate(returnTo !== "/login" && returnTo !== "/admin" && returnTo !== "/" ? returnTo : "/profile");
      } else {
        navigate(returnTo !== "/login" && returnTo !== "/" ? returnTo : "/admin");
      }
    } catch (err) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    quickSwitchRole(cred.role);
    if (cred.role === "tourist") {
      navigate("/profile");
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-center max-w-4xl mx-auto space-y-8">
      <div className="w-full max-w-md">
        <AuthLayout
          icon={LogIn}
          title="Sign in to Bharat Yatra"
          subtitle="Access your designated employee cockpit or traveler profile"
          footer={
            <>
              Don't have an account?{" "}
              <Link
                to={"/register" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "")}
                className="text-primary font-medium hover:underline"
              >
                Create one
              </Link>
            </>
          }
        >
          {/* Main Google Sign In Button */}
          <div className="space-y-2 mb-4">
            <Button
              variant="outline"
              className="w-full h-12 text-sm font-medium hover:bg-accent/50 border-border/80 relative group"
              onClick={handleGoogle}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin text-primary" />
              ) : (
                <GoogleIcon className="w-5 h-5 mr-2" />
              )}
              <span>Continue with Google</span>
            </Button>

            {/* Quick Google Account Switcher Dropdown */}
            <div className="flex items-center justify-between px-1 text-xs">
              <button
                type="button"
                onClick={() => setShowGoogleChooser(!showGoogleChooser)}
                className="text-muted-foreground hover:text-primary transition-colors text-[11px] underline underline-offset-2 flex items-center gap-1"
              >
                <span>{showGoogleChooser ? "Hide Google Accounts" : "Choose Google Account"}</span>
              </button>
              <span className="text-[10px] text-muted-foreground">Venkata Santosh & Team</span>
            </div>

            {showGoogleChooser && (
              <div className="p-3 bg-muted/40 rounded-xl border border-border/70 space-y-2 text-xs">
                <p className="text-[11px] font-medium text-foreground">Select an account to continue:</p>
                <button
                  type="button"
                  onClick={() => handleGoogleDirect("venkatasantosh2478@gmail.com", "Venkata Santosh")}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-card hover:bg-primary/5 hover:border-primary/40 border border-border/60 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                      VS
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-xs group-hover:text-primary">Venkata Santosh</div>
                      <div className="text-[10px] text-muted-foreground">venkatasantosh2478@gmail.com</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleDirect("santoshtrade27@gmail.com", "Santosh Trade")}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-card hover:bg-primary/5 hover:border-primary/40 border border-border/60 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                      ST
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-xs group-hover:text-primary">Santosh Trade</div>
                      <div className="text-[10px] text-muted-foreground">santoshtrade27@gmail.com</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">Admin</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground font-semibold">Or Email Credentials</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 text-sm bg-background"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold text-foreground">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 text-sm bg-background"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-bold text-sm" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </form>
        </AuthLayout>

        {/* Quick Demo Credentials for Fast Testing & Verification (Toggled in Admin Settings) */}
        {siteConfig?.showDemoCredentialsInLogin !== false && (
          <div className="mt-6 p-4 bg-card/80 backdrop-blur border border-border/80 rounded-2xl shadow-sm space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">1-Click Test Credentials & Role Switcher</span>
              </div>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider bg-muted px-2 py-0.5 rounded-full">
                Instant Access
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Click any designated role below to auto-fill credentials and test any employee or admin dashboard instantly:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {getSystemCredentials().map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => handleQuickSelect(cred)}
                  className="flex flex-col text-left p-2.5 rounded-xl border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all text-xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-xs truncate">
                      {cred.roleName.split(' ')[0]} {cred.roleName.split(' ')[1] || ''}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-1" />
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {cred.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

