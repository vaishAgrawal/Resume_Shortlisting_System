export default function Footer({ yearText }) {
  return (
    <>
      
      <footer className="glass-nav border-t border-gray-200 pt-16 pb-8 relative shadow-inner">
        
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div data-aos="fade-up" data-aos-delay="0">
            
            <img
              src="/images/graphuralogo.png"
              alt="Graphura"
              className="h-16 mb-4 rounded p-1 transition-colors"
            />
            <p className="text-gray-600 text-sm leading-relaxed">
              
              Helping you shortlist top talent using AI {"\u2014"} fast, fair
              and focused.
            </p>
          </div>
          <div data-aos="fade-up" data-aos-delay="100">
            
            <h3 className="text-gray-900 font-bold mb-4 border-b border-brand-primary/50 inline-block pb-1">
              
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              
              <li>
                
                <a
                  href="/"
                  className="hover:text-brand-primary hover:pl-2 transition-all duration-300 flex items-center"
                >
                  
                  <i className="fas fa-chevron-right text-xs mr-2 opacity-0 hover:opacity-100"></i>
                  Home
                </a>
              </li>
              <li>
                
                <a
                  href="/recruiter"
                  className="hover:text-brand-primary hover:pl-2 transition-all duration-300 flex items-center"
                >
                  
                  <i className="fas fa-chevron-right text-xs mr-2 opacity-0 hover:opacity-100"></i>
                  Recruiter Dashboard
                </a>
              </li>
              <li>
                
                <a
                  href="/dashboard"
                  className="hover:text-brand-primary hover:pl-2 transition-all duration-300 flex items-center"
                >
                  
                  <i className="fas fa-chevron-right text-xs mr-2 opacity-0 hover:opacity-100"></i>
                  Analytics
                </a>
              </li>
            </ul>
          </div>
          <div data-aos="fade-up" data-aos-delay="200">
            
            <h3 className="text-gray-900 font-bold mb-4 border-b border-brand-primary/50 inline-block pb-1">
              
              Resources
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              
              <li>
                
                <a
                  href="/documentation"
                  className="hover:text-brand-primary hover:pl-2 transition-all duration-300 flex items-center"
                >
                  
                  <i className="fas fa-chevron-right text-xs mr-2 opacity-0 hover:opacity-100"></i>
                  Documentation
                </a>
              </li>
              <li>
                
                <a
                  href="/support"
                  className="hover:text-brand-primary hover:pl-2 transition-all duration-300 flex items-center"
                >
                  
                  <i className="fas fa-chevron-right text-xs mr-2 opacity-0 hover:opacity-100"></i>
                  Support
                </a>
              </li>
              <li>
                
                <a
                  href="/privacy"
                  className="hover:text-brand-primary hover:pl-2 transition-all duration-300 flex items-center"
                >
                  
                  <i className="fas fa-chevron-right text-xs mr-2 opacity-0 hover:opacity-100"></i>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div data-aos="fade-up" data-aos-delay="300">
            
            <h3 className="text-gray-900 font-bold mb-4 border-b border-brand-primary/50 inline-block pb-1">
              
              Contact
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              
              support@graphura.in <br /> +91 73780 21327
            </p>
            <div className="flex space-x-4">
              
              <a
                href="#"
                className="group w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              >
                
                <i className="fab fa-twitter group-hover:rotate-12 transition-transform"></i>
              </a>
              <a
                href="#"
                className="group w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              >
                
                <i className="fab fa-linkedin-in group-hover:rotate-12 transition-transform"></i>
              </a>
              <a
                href="#"
                className="group w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              >
                
                <i className="fab fa-facebook-f group-hover:rotate-12 transition-transform"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <div className="text-center text-gray-500 text-sm border-t border-gray-200 p-8 pt-8">
        
        {"\u00a9"} {yearText} Graphura India Private Limited {"\u2014"} All
        rights reserved.
      </div>
    </>
  );
}

