'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

interface Income {
    _id: string;
    title: string;
    amount: number;
    source: string;
    date: string;
}

export default function IncomePage() {
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [form, setForm] = useState({ title: '', amount: 0, source: '', date: '' });

    const loadIncomes = () => api.get('/income').then((res) => setIncomes(res.data));

    useEffect(() => { loadIncomes(); }, []);

    const addIncome = async () => {
        if (!form.title || !form.amount || !form.source || !form.date) return;
        await api.post('/income', form);
        setForm({ title: '', amount: 0, source: '', date: '' });
        loadIncomes();
    };

    const deleteIncome = async (id: string) => {
        await api.delete(`/income/${id}`);
        loadIncomes();
    };

    return (
        <div>
            <Navbar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Income</h1>

                <div className="flex flex-wrap gap-2 mb-6 border border-gray-700 p-4 rounded-lg">
                    <input placeholder="Title" className="border border-gray-600 bg-transparent p-2 rounded flex-1"
                           value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    <input placeholder="Amount" type="number" className="border border-gray-600 bg-transparent p-2 rounded w-32"
                           value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
                    <input placeholder="Source" className="border border-gray-600 bg-transparent p-2 rounded w-40"
                           value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
                    <input type="date" className="border border-gray-600 bg-transparent p-2 rounded"
                           value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                    <button onClick={addIncome} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Add</button>
                </div>

                <table className="w-full border border-gray-700">
                    <thead>
                    <tr className="border-b border-gray-700 text-left">
                        <th className="p-2">Title</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Source</th>
                        <th className="p-2">Date</th>
                        <th className="p-2"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {incomes.map((inc) => (
                        <tr key={inc._id} className="border-b border-gray-800">
                            <td className="p-2">{inc.title}</td>
                            <td className="p-2 text-green-500">Rs. {inc.amount}</td>
                            <td className="p-2">{inc.source}</td>
                            <td className="p-2">{new Date(inc.date).toLocaleDateString()}</td>
                            <td className="p-2">
                                <button onClick={() => deleteIncome(inc._id)} className="text-red-500 hover:text-red-400">Delete</button>
                            </td>
                        </tr>
                    ))}
                    {incomes.length === 0 && (
                        <tr><td colSpan={5} className="p-4 text-center text-gray-500">No income yet</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}