'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        try {
            const res = await api.post('/auth/register', form);
            localStorage.setItem('token', res.data.access_token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-6 border border-gray-700 rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Register</h1>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <div className="space-y-3">
                    <input className="w-full border border-gray-600 bg-transparent p-2 rounded" placeholder="Name"
                           onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <input className="w-full border border-gray-600 bg-transparent p-2 rounded" placeholder="Email"
                           onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <input className="w-full border border-gray-600 bg-transparent p-2 rounded" type="password" placeholder="Password"
                           onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <button onClick={handleSubmit} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Register
                    </button>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                    Already have an account? <Link href="/login" className="text-blue-400">Login</Link>
                </p>
            </div>
        </div>
    );
}