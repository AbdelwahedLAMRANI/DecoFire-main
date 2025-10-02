'use client';

import { useState, useActionState, Suspense } from 'react';
import { handleLogin } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface ActionResult {
  success: boolean;
  error?: string;
}

const initialState: ActionResult = {
  success: false,
};

function LoginFormContent() {
  const [state, formAction, isPending] = useActionState(handleLogin, initialState);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <form action={formAction} className="space-y-6">
       {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Log In
      </Button>
    </form>
  );
}


export function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  )
}
