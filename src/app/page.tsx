import { Metadata } from 'next';
import { isAuthenticated } from '@/lib/auth';
import ClientPage from '@/components/ClientPage';

export const metadata: Metadata = {
  title: 'Rams Cal',
  description: 'A beautiful calendar app for Ramsee',
};

export default async function Home() {
  const isAuth = await isAuthenticated();
  return <ClientPage isAuth={isAuth} />;
}
