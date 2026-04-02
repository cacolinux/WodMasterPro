import React from 'react';
import { Dumbbell, ArrowRight, Github, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';

export function Login() {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-100/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-100/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-8 space-y-4">
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center shadow-2xl shadow-zinc-100/10">
            <Dumbbell className="text-zinc-950 w-8 h-8" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">WODMaster</h1>
            <p className="text-zinc-400">Elevate your box management.</p>
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-zinc-100">
              {isSignUp ? 'Create an account' : 'Sign in'}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {isSignUp 
                ? 'Enter your details to join the community.' 
                : 'Enter your credentials to access your dashboard.'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="fullName" className="text-zinc-400">Full Name</Label>
                    <Input 
                      id="fullName" 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe" 
                      className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-zinc-700"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-400">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-400">Password</Label>
                  {!isSignUp && (
                    <button type="button" className="text-xs text-zinc-500 hover:text-zinc-100 transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-zinc-700"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                  {error}
                </div>
              )}

              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-bold h-11"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    {isSignUp ? 'Sign Up' : 'Sign In'} <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-800">
                  <Github className="mr-2 h-4 w-4" /> Github
                </Button>
                <Button type="button" variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-800">
                  <Mail className="mr-2 h-4 w-4" /> Google
                </Button>
              </div>
            </CardContent>
          </form>
          <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-zinc-500">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-zinc-100 font-medium hover:underline underline-offset-4"
            >
              {isSignUp ? 'Sign in' : 'Sign up for free'}
            </button>
          </CardFooter>
        </Card>

        <p className="mt-8 text-center text-xs text-zinc-600 px-8">
          By clicking continue, you agree to our 
          <button className="underline underline-offset-4 hover:text-zinc-400 mx-1">Terms of Service</button> 
          and 
          <button className="underline underline-offset-4 hover:text-zinc-400 mx-1">Privacy Policy</button>.
        </p>
      </motion.div>
    </div>
  );
}

