export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#f8fafc", fontFamily: "Cairo, sans-serif", flexDirection: "column", gap: "16px" }}>
      <h1 style={{ fontSize: "72px", fontWeight: 900, color: "#10b981" }}>404</h1>
      <p style={{ fontSize: "20px", color: "#94a3b8" }}>الصفحة غير موجودة</p>
      <a href="/" style={{ padding: "12px 28px", borderRadius: "12px", background: "linear-gradient(135deg, #059669, #10b981)", color: "white", textDecoration: "none", fontWeight: 700, fontFamily: "Cairo" }}>العودة للرئيسية</a>
    </div>
  );
}
