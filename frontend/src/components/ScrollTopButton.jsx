export default function ScrollTopButton({ visible, onClick }) {
  return (
    <button
      id="scrollTopBtn"
      onClick={onClick}
      className={`fixed bottom-8 right-8 z-50 bg-[#8b5cf6] text-white p-4 rounded-full shadow-[0_18px_45px_-20px_rgba(139,92,246,0.75)] transition-all duration-500 hover:bg-[#8b5cf6] hover:shadow-[0_22px_55px_-20px_rgba(139,92,246,0.9)] focus:outline-none transform hover:scale-110 hover:-translate-y-1 ${visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`}
      type="button"
      aria-label="Scroll to top"
    >
      
      <i className="fas fa-arrow-up"></i>
    </button>
  );
}

