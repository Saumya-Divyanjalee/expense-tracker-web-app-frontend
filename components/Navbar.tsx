'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <nav className="flex gap-6 p-4 border-b border-gray-700 items-center bg-black text-white">
            <Link href="/dashboard" className="font-bold text-lg">💰 Expense Tracker</Link>
            <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <Link href="/expenses" className="hover:text-blue-400">Expenses</Link>
            <Link href="/income" className="hover:text-blue-400">Income</Link>
            <Link href="/reports" className="hover:text-blue-400">Reports</Link>
            <button onClick={logout} className="ml-auto text-red-400 hover:text-red-300">Logout</button>
        </nav>
    );
}