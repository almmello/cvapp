function SkillBadge({ label }: { label: string }) {
  return (
    <li className="list-none">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-interactive/10 text-interactive border border-interactive/30">
        {label}
      </span>
    </li>
  )
}

export default function Goalmoon() {
  return (
    <article className="pl-8 pb-8 relative">
      <span className="absolute left-0 top-2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-navy ring-2 ring-white border border-navy/30" />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
        <div>
          <h3 className="text-base font-bold text-navy mb-0.5">Founder</h3>
          <div className="text-sm text-gray-400">2008 – Present</div>
        </div>
        <div className="sm:text-right mt-1 sm:mt-0">
          <div className="text-sm font-semibold text-navy-dark">GOALMOON.COM</div>
        </div>
      </div>

      <ul className="list-disc list-outside ml-4 text-sm text-gray-700 space-y-2 mb-4 leading-relaxed">
        <li>I have handled multiple hosting platforms that provide web designers with an easy-to-use solution. I have assisted them with WordPress management, theme selection, plugin management, and maintenance. Adopting the Lean Startup method, I have launched over 20 websites and used customer feedback to identify a profitable business model.</li>
        <li>I have experienced programming an iOS App in Objective-C and publishing it to the Apple App Store.</li>
      </ul>

      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Skills:</h4>
      <ul className="flex flex-wrap gap-1.5">
        <SkillBadge label="Software Development" />
        <SkillBadge label="Cloud Computing" />
        <SkillBadge label="Web Hosting" />
        <SkillBadge label="E-Commerce" />
        <SkillBadge label="SEO" />
        <SkillBadge label="Digital Marketing" />
      </ul>
    </article>
  )
}
