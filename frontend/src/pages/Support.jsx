import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Support() {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id.replace("support","").toLowerCase()]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const payload = {
      firstName: form.firstname,
      lastName: form.lastname,
      email: form.email,
      message: form.message
    };

    try {

      const baseUrl =
        typeof CONFIG !== "undefined"
          ? CONFIG.API_BASE_URL.replace("/auth", "")
          : "http://localhost:8080/api";

      const response = await fetch(`${baseUrl}/support/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ " + data.message);
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          message: ""
        });
      } else {
        alert("❌ Error: " + (data.error || "Failed to submit request"));
      }

    } catch (error) {
      console.error("Support API Error:", error);
      alert("Network error. Please try again later.");
    }

    setLoading(false);
  };

  return (

    <div className="bg-brand-dark text-gray-900 font-sans">

      {/* HERO */}
      <section className="min-h-[40vh] flex items-center justify-center pt-24 pb-12 relative overflow-hidden">

        <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px]"></div>

        <div className="text-center z-10" data-aos="fade-up">

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How can we <span className="text-gradient">help?</span>
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto">
            Search our knowledge base or contact our support team below.
          </p>

        </div>

      </section>


      <div className="max-w-7xl mx-auto px-4 pb-24 grid lg:grid-cols-2 gap-12">

        {/* FORM */}

        <div
          className="bg-brand-card p-8 rounded-2xl border border-gray-200 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
          data-aos="fade-right"
        >

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Send us a message
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-2 gap-4 mb-4">

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase">
                  First Name
                </label>

                <input
                  id="supportFirstName"
                  value={form.firstname || ""}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-colors"
                  placeholder="John"
                />
              </div>

              <div className="space-y-2">

                <label className="text-xs font-bold text-gray-600 uppercase">
                  Last Name
                </label>

                <input
                  id="supportLastName"
                  value={form.lastname || ""}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-colors"
                  placeholder="Doe"
                />

              </div>

            </div>

            <div className="space-y-2 mb-4">

              <label className="text-xs font-bold text-gray-600 uppercase">
                Email
              </label>

              <input
                type="email"
                id="supportEmail"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-colors"
                placeholder="john@example.com"
              />

            </div>

            <div className="space-y-2 mb-6">

              <label className="text-xs font-bold text-gray-600 uppercase">
                Message
              </label>

              <textarea
                id="supportMessage"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-colors"
                placeholder="Describe your issue..."
              ></textarea>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-primary/20 hover:-translate-y-1"
            >

              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}

            </button>

          </form>

        </div>


        {/* FAQ */}

        <div className="space-y-8" data-aos="fade-left">

          <div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">

              <div className="bg-brand-card p-5 rounded-xl border border-gray-200 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">

                <h3 className="font-bold text-gray-900 mb-2">
                  <i className="fas fa-file-upload text-brand-primary mr-2"></i>
                  How many resumes can I upload?
                </h3>

                <p className="text-sm text-gray-600">
                  For the demo version we recommend uploading up to 20 files at
                  a time for optimal speed.
                </p>

              </div>

              <div className="bg-brand-card p-5 rounded-xl border border-gray-200 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">

                <h3 className="font-bold text-gray-900 mb-2">
                  <i className="fas fa-robot text-brand-primary mr-2"></i>
                  Is the parsing accurate?
                </h3>

                <p className="text-sm text-gray-600">
                  We target ≥85% parsing accuracy using Apache OpenNLP and
                  PDFBox.
                </p>

              </div>

              <div className="bg-brand-card p-5 rounded-xl border border-gray-200 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">

                <h3 className="font-bold text-gray-900 mb-2">
                  <i className="fas fa-lock text-brand-primary mr-2"></i>
                  Is my data secure?
                </h3>

                <p className="text-sm text-gray-600">
                  Yes. We use JWT authentication and do not share candidate data.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* FOOTER */}

      <footer className="text-center text-gray-500 text-sm border-t border-gray-200 p-8">

        © {new Date().getFullYear()} Graphura India Private Limited — All rights
        reserved.

      </footer>

    </div>

  );
}
