import ProductManager from './ProductManager'
import Goalmoon from './Goalmoon'
import ProjectManager from './ProjectManager'
import TechnicalAdvisor from './TechnicalAdvisor'
import Directlink from './Directlink'

export default function ExperienceSection() {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-bold uppercase tracking-widest text-navy pb-3 mb-6 border-b border-navy/20">Experience</h2>
      <div className="relative border-l-2 border-navy/15 ml-1.5">
        <ProductManager />
        <Goalmoon />
        <ProjectManager />
        <TechnicalAdvisor />
        <Directlink />
      </div>
    </section>
  )
}
