// app/reset-password/page.tsx
import { Suspense } from 'react';
import ResetPasswordPage from './ResetPasswordClient'; // move your component to a separate client file

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
