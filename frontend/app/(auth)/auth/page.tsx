'use client';

import { Role } from '@/src/domain/entity/role.enum';
import { useAuth } from '@/src/presentation/hooks/useAuth';
import { AuthService } from '@/src/presentation/services/auth.service';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currUser } = useAuth();

  const router = useRouter();

  useEffect(() => {
    // Nếu người dùng đã đăng nhập, chuyển hướng về trang chủ
    if (currUser) {
      router.push('/');
    }
  }, [currUser, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = isLogin
        ? await AuthService.loginWithEmail(email, password, Role.CUSTOMER)
        : await AuthService.signUpWithEmail(email, password, Role.CUSTOMER); // Truyền role để đăng ký

      if (!user) throw new Error("Không có thông tin người dùng được trả về");

      if (isLogin) {
        router.push('/');
      } else {
        setIsLogin(true);
      }
    } catch (e) {
      console.error('auth', e);
      setError('Xác thực thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const user = await AuthService.loginWithGoogle(Role.CUSTOMER);
    setLoading(false);
    if (user) {
      router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
        </h2>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Địa chỉ Email"
            className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:bg-emerald-300"
          >
            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
          </button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <hr className="w-full border-gray-300" />
          <span className="px-3 text-xs uppercase text-gray-400">Hoặc</span>
          <hr className="w-full border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 transition hover:bg-gray-50 text-black"
        >
          <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={20} height={20} alt="Google" />
          Tiếp tục với Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-emerald-600 hover:underline"
          >
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập tại đây'}
          </button>
        </p>
      </div>
    </div>
  );
}
