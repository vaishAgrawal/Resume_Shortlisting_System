import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function PrivacyPage() {
  useEffect(() => {
    AOS.init();
    const year = document.getElementById("year");
    if (year) {
      year.textContent = new Date().getFullYear();
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#f7f1ff] via-[#efe7ff] to-[#e9f0ff] text-violet-900 font-sans">

      <div id="nav-placeholder"></div>

      <div className="max-w-4xl mx-auto px-4 pt-28 lg:pt-32 pb-20">
        <div className="text-center mb-16" data-aos="fade-down">
          <h1 className="text-4xl lg:text-5xl font-bold text-violet-900 mb-4">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">Policy</span>
          </h1>
        </div>

        <div
          className="bg-brand-card p-8 lg:p-12 rounded-2xl border border-gray-200 shadow-xl text-left leading-relaxed space-y-5 transition-shadow duration-300 hover:shadow-2xl"
          data-aos="fade-up"
        >
          <p>
            At Graphura ResumeAI, we take your privacy seriously. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website and use our resume
            shortlisting services.
          </p>

          <h2 className="text-xl font-bold text-violet-900 pt-2">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you
            create an account, upload resumes, or create job descriptions.
          </p>

          <ul className="list-disc pl-6 space-y-2 text-violet-700">
            <li>
              <strong>Personal Data:</strong> Name, email address, and contact
              details of recruiters.
            </li>
            <li>
              <strong>Candidate Data:</strong> Information extracted from
              uploaded resumes including names, contact info, education
              history, work experience, and skills.
            </li>
            <li>
              <strong>Usage Data:</strong> Information on how you use the
              dashboard, export features, and scoring tools.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-violet-900 pt-2">2. How We Use Your Information</h2>
          <p>
            The core function of our system is to analyze data to provide hiring
            insights.
          </p>

          <ul className="list-disc pl-6 space-y-2 text-violet-700">
            <li>To parse and score resumes against specific job requirements.</li>
            <li>
              To generate ranked shortlists and visualizations on the dashboard.
            </li>
            <li>To facilitate the export of candidate data to CSV or PDF formats.</li>
            <li>To improve our NLP algorithms and parsing accuracy.</li>
          </ul>

          <h2 className="text-xl font-bold text-violet-900 pt-2">3. Data Security</h2>
          <p>
            We implement enterprise-grade security measures to protect your
            data. This includes JWT (JSON Web Token) authentication for secure
            access and encryption of data at rest and in transit.
          </p>

          <h2 className="text-xl font-bold text-violet-900 pt-2">4. Sharing of Information</h2>
          <p>
            We do not sell, trade, or otherwise transfer your Personally
            Identifiable Information to outside parties. This does not include
            trusted third parties who assist us in operating our website (such
            as cloud hosting providers), so long as those parties agree to keep
            this information confidential.
          </p>

          <h2 className="text-xl font-bold text-violet-900 pt-2">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>

          <p className="text-violet-900 font-bold">
            Graphura India Private Limited <br />
            Email: privacy@graphura.in <br />
            Address: Plot No 35, Sector 3, Gurugram, Haryana.
          </p>
        </div>
      </div>

    </div>
  );
}

