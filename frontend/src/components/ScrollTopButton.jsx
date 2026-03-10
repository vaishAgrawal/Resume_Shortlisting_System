export default function ScrollTopButton({ visible, onClick }) {
  return (
    <button
      id="scrollTopBtn"
      onClick={onClick}
      className={`fixed bottom-8 right-8 z-50 bg-brand-primary text-white p-4 rounded-full shadow-lg transition-all duration-500 hover:bg-brand-primary hover:shadow-brand-primary/50 focus:outline-none transform hover:scale-110 hover:-translate-y-1 ${visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`}
      type="button"
      aria-label="Scroll to top"
    >
      
      <i className="fas fa-arrow-up"></i>
    </button>
  );
}

