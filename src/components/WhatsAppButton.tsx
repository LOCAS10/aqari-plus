"use client";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/212607633144?text=مرحباً%20من%20موقع%20SOLUTION%20Immobilier"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        zIndex: 9998,
        width: "65px",
        height: "65px",
        background: "#25D366",
        borderRadius: "50%",
        color: "white",
        fontSize: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 30px rgba(37, 211, 102, 0.4)",
        transition: "transform 0.3s ease",
        textDecoration: "none",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "scale(1.1)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "scale(1)")
      }
      title="واتساب"
    >
      💬
    </a>
  );
}
