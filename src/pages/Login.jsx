import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(""); // hilangkan error saat user mulai mengetik ulang
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      const data = response.data;

      if (data.success) {
        // Simpan user ke localStorage lewat AuthContext
        login(data.user);

        // Simpan token juga jika backend mengirimkannya (opsional, untuk Sanctum)
        if (data.token) {
          localStorage.setItem("pos_token", data.token);
        }

        // Redirect berdasarkan role
        const normalizedRole = data.user.role?.toLowerCase?.() || "";
        if (normalizedRole === "admin") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/kasir", { replace: true });
        }
      } else {
        setError(data.message || "Email atau password salah.");
      }
    } catch (err) {
      // Menangani error dari server (401, 422, dll) maupun error jaringan
      const message =
        err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">POS</div>
          <h1>Selamat Datang</h1>
          <p>Silakan masuk untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="spin" size={20} />
                <span>Memproses...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}