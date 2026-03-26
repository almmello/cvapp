function SkillBadge({ label }: { label: string }) {
  return (
    <li className="list-none">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-interactive/10 text-interactive border border-interactive/30">
        {label}
      </span>
    </li>
  )
}

export default function Directlink() {
  return (
    <article className="pl-8 pb-0 relative">
      <span className="absolute left-0 top-2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-navy ring-2 ring-white border border-navy/30" />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
        <div>
          <h3 className="text-base font-bold text-navy mb-0.5">CTO</h3>
          <div className="text-sm text-gray-400">2000 – 2003</div>
        </div>
        <div className="sm:text-right mt-1 sm:mt-0">
          <div className="text-sm font-semibold text-navy-dark">DIRECTLINK INTERNET BY RADIO</div>
          <div className="text-sm text-gray-400">Londrina</div>
        </div>
      </div>

      <ul className="list-disc list-outside ml-4 text-sm text-gray-700 space-y-2 mb-4 leading-relaxed">
        <li>I successfully deployed the DirectLink system in 7 cities with an average population of 300,000 and built 150 points of presence on a radio network of 400 servers, supporting 2K subscribers.</li>
        <li>I created a design pattern to reuse my JAVA + JSP + MySQL code and build web applications faster. After this, I used Excel VBA to generate those classes, which reduced development time by 85%.</li>
      </ul>

      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Skills:</h4>
      <ul className="flex flex-wrap gap-1.5">
        <SkillBadge label="Java" />
        <SkillBadge label="JSP" />
        <SkillBadge label="MySQL" />
        <SkillBadge label="HTML" />
        <SkillBadge label="CSS" />
      </ul>
    </article>
  )
}
