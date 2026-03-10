export function PageShell({ title, subtitle, children }) {
  return (
    <section className="min-h-[70vh] pt-28 pb-20">
      
      <div className="max-w-5xl mx-auto px-4">
        
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          
          {title}
        </h1>
        <p className="text-gray-600 text-lg">{subtitle}</p>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
export function ProfilePage() {
  return (
    <PageShell
      title="Profile"
      subtitle="Candidate profile and account settings go here."
    />
  );
}
export function DocumentationPage() {
  return (
    <PageShell
      title="Documentation"
      subtitle="Product documentation and onboarding guides."
    />
  );
}
export function SupportPage() {
  return (
    <PageShell
      title="Support"
      subtitle="Create tickets, contact support, or explore help articles."
    />
  );
}
export function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      subtitle="Add your privacy policy content here."
    />
  );
}
export function AdminPage() {
  return (
    <PageShell
      title="Admin Dashboard"
      subtitle="Admin-only controls and system overview."
    />
  );
}

