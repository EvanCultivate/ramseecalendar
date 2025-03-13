'use client';

import dynamic from 'next/dynamic';

const Calendar = dynamic(() => import('@/components/Calendar'), {
  ssr: false,
});

const LoginForm = dynamic(() => import('@/components/LoginForm'), {
  ssr: false,
});

interface ClientPageProps {
  isAuth: boolean;
}

export default function ClientPage({ isAuth }: ClientPageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-8">
          Rams Cal
        </h1>
        {isAuth ? (
          <Calendar />
        ) : (
          <div className="max-w-md mx-auto">
            <LoginForm />
          </div>
        )}
      </div>
    </main>
  );
} 