import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Login() {
  const [email, setEmail] = useState('demo@moviehub.test');   // บัญชีทดลองของ mock
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');             // 'typing' | 'submitting'
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';                   // ProtectedRoute ส่งมาบอกว่าเดิมจะไปไหน

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      await login(email.trim(), password.trim());
      navigate(from, { replace: true });
    } catch (err) {
      console.log('Error caught in Login.jsx:', err);

      // ดึง status หรือข้อความจาก server
      const status = err?.response?.status;
      const serverMessage = err?.response?.data?.message || err?.response?.data?.error;

      // ถ้าได้รับ status 401 หรือ Unauthorized
      if (status === 401 || serverMessage === 'Unauthorized' || err?.message?.includes('401')) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        setError(typeof serverMessage === 'string' ? serverMessage : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
      }

      setStatus('typing');
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">เข้าสู่ระบบ</h1>
      <p className="mt-1 text-sm text-slate-500">ทดลองด้วย demo@moviehub.test / 1234 หรือสมัครใหม่</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="อีเมล" 
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="รหัสผ่าน" 
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" 
        />
        <button 
          type="submit" 
          disabled={status === 'submitting'}
          className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:bg-slate-300"
        >
          {status === 'submitting' ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
        
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
      </form>

      <p className="mt-6 text-sm text-slate-500">
        ยังไม่มีบัญชี? <Link to="/register" className="text-emerald-600 hover:underline">สมัครสมาชิก</Link>
      </p>
    </div>
  );
}

export default Login;