'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

interface CategoryData {
    _id: string;
    total: number;
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4'];

export default function ReportsPage() {
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });

    useEffect(() => {
        api.get('/reports/category-wise').then((res) => setCategoryData(res.data));
        api.get('/reports/summary').then((res) => setSummary(res.data));
    }, []);

    return (
        <div>
            <Navbar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Reports</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-700 p-4 rounded-lg">
                        <h2 className="font-semibold mb-4">Expense by Category</h2>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={categoryData}>
                                    <XAxis dataKey="_id" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip />
                                    <Bar dataKey="total" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-500">No expense data yet</p>
                        )}
                    </div>

                    <div className="border border-gray-700 p-4 rounded-lg">
                        <h2 className="font-semibold mb-4">Income vs Expense</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Income', value: summary.totalIncome },
                                        { name: 'Expense', value: summary.totalExpense },
                                    ]}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {[0, 1].map((i) => <Cell key={i} fill={COLORS[i]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}