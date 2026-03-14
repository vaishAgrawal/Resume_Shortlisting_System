const CARDS = [
  {
    title: "HR Teams & Recruiters",
    description: "Speed up screening and reduce manual effort.",
    image: "/images/job.webp"
  },
  {
    title: "Hiring Managers",
    description: "Get data-backed shortlist recommendations.",
    image: "/images/Job_Interview.webp"
  },
  {
    title: "Recruitment Agencies",
    description: "Process thousands of resumes efficiently for clients.",
    image: "/images/interview.webp"
  }
];

export default function WhoItsFor() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#f7f3ff] via-[#f1edff] to-[#ece7ff]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center justify-center px-6 py-2  rounded-full text-base font-semibold bg-[#ede7ff] text-[#5b3db8] shadow-sm font-body">
            Our users
          </span>
          <h2 className="mt-6 text-6xl md:text-5xl lg:text-6xl font-bold text-[#2a184b] font-display">
            Who It&apos;s For
          </h2>
          <p className="mt-4 text-[#5b4b8a] max-w-3xl mx-auto text-lg font-body">
            Built to simplify hiring workflows and deliver faster, smarter
            shortlisting—no matter the scale or structure of your recruitment
            process.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-2xl bg-[#2a184b] shadow-[0_35px_70px_-45px_rgba(46,16,101,0.6)]"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a184b]/90 via-[#2a184b]/60 to-transparent"></div>
              <div className="relative p-8 md:p-10 min-h-[360px] lg:min-h-[420px] flex flex-col justify-end text-center">
                <h3 className="text-2xl md:text-3xl font-semibold text-white font-display">
                  {card.title === "Hiring Managers" ? (
                    <>
                      Hiring <br />
                      Managers
                    </>
                  ) : (
                    card.title
                  )}
                </h3>
                <p className="mt-3 text-sm md:text-base text-white/85 font-body">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
