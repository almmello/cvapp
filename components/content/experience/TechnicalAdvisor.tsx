function SkillBadge({ label }: { label: string }) {
  return (
    <li className="list-none">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-interactive/10 text-interactive border border-interactive/30">
        {label}
      </span>
    </li>
  )
}

export default function TechnicalAdvisor() {
  return (
    <article className="pl-8 pb-8 relative">
      <span className="absolute left-0 top-2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-navy ring-2 ring-white border border-navy/30" />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
        <div>
          <h3 className="text-base font-bold text-navy mb-0.5">Technical Advisor</h3>
          <div className="text-sm text-gray-400">2003 – 2010</div>
        </div>
        <div className="sm:text-right mt-1 sm:mt-0">
          <div className="text-sm font-semibold text-navy-dark">TIM S/A</div>
          <div className="text-sm text-gray-400">Londrina</div>
        </div>
      </div>

      <ul className="list-disc list-outside ml-4 text-sm text-gray-700 space-y-2 mb-4 leading-relaxed">
        <li>I supported a team of 5 Key Account Managers responsible for 300 clients and 3M USD in annual revenue. I successfully launched the M2M segment using hybrid GSM and satellite location modules for the first time in Brazil, resulting in 45,000 gross adds. In addition, I achieved an average mean target of 227% over 63 months, 47% above company results.</li>
      </ul>

      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Skills:</h4>
      <ul className="flex flex-wrap gap-1.5">
        <SkillBadge label="Technical Sales" />
        <SkillBadge label="Presentation Techniques" />
        <SkillBadge label="Team Management" />
        <SkillBadge label="VAS" />
        <SkillBadge label="Mobile Devices" />
      </ul>
    </article>
  )
}
