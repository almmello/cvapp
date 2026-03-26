function SkillBadge({ label }: { label: string }) {
  return (
    <li className="list-none">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-interactive/10 text-interactive border border-interactive/30">
        {label}
      </span>
    </li>
  )
}

export default function ProjectManager() {
  return (
    <article className="pl-8 pb-8 relative">
      <span className="absolute left-0 top-2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-navy ring-2 ring-white border border-navy/30" />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
        <div>
          <h3 className="text-base font-bold text-navy mb-0.5">Project Manager</h3>
          <div className="text-sm text-gray-400">2010 – 2014</div>
        </div>
        <div className="sm:text-right mt-1 sm:mt-0">
          <div className="text-sm font-semibold text-navy-dark">TIM S/A</div>
          <div className="text-sm text-gray-400">Rio de Janeiro</div>
        </div>
      </div>

      <ul className="list-disc list-outside ml-4 text-sm text-gray-700 space-y-2 mb-4 leading-relaxed">
        <li>I have a proven track record of leading successful projects, such as the Blah app development, which resulted in 4,000 hours of coordination with more than 35 different departments, from Legal to IT, and a multicultural team. In addition, I have conducted the design agency&apos;s activities, producing 1,400 layouts, including wireframes and prototypes.</li>
        <li>I developed an Excel VBA-based KPI analysis platform to receive and process 3,900 services&apos; weekly data, achieving 95% cancellation efficiency.</li>
      </ul>

      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Skills:</h4>
      <ul className="flex flex-wrap gap-1.5">
        <SkillBadge label="Project Management" />
        <SkillBadge label="User Experience (UX)" />
        <SkillBadge label="PMBOK" />
        <SkillBadge label="Jira" />
        <SkillBadge label="Branding &amp; Identity" />
        <SkillBadge label="VBA" />
      </ul>
    </article>
  )
}
