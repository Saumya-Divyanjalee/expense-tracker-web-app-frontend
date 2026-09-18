'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
    const router = useRouter();
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        api.get('/reports/summary')
            .then((res) => setSummary(res.data))
            .catch(() => router.push('/login'))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div>
            <Navbar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Total Income</p>
                        <p className="text-3xl font-bold text-green-500">Rs. {summary.totalIncome}</p>
                    </div>
                    <div className="border border-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Total Expense</p>
                        <p className="text-3xl font-bold text-red-500">Rs. {summary.totalExpense}</p>
                    </div>
                    <div className="border border-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Balance</p>
                        <p className="text-3xl font-bold">Rs. {summary.balance}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}