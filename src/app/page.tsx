import { redirect } from 'next/navigation';

// Root redirects to expo exhibition mode
export default function RootPage() {
  redirect('/expo');
}
