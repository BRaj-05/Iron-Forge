import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { exerciseImageForSlot, exercises, muscleGroups } from "@/lib/exercise-data";

const sections = [
  { id: "upper", title: "Upper Body", copy: "Build pressing, pulling and arm strength with focused movement guides.", slugs: ["chest", "back", "shoulders", "biceps", "triceps"] },
  { id: "lower", title: "Lower Body", copy: "Train resilient legs with beginner-friendly strength and control.", slugs: ["legs"] },
  { id: "core", title: "Core & Mobility", copy: "Develop trunk control, athletic movement and complete-body capacity.", slugs: ["core", "full-body"] },
] as const;

export default function TrainingLibrarySections() {
  return <div className="training-library">
    <nav className="training-category-tabs" aria-label="Exercise categories">
      {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
    </nav>
    {sections.map((section) => {
      const groups = section.slugs.map((slug) => muscleGroups.find((group) => group.slug === slug)).filter((group): group is (typeof muscleGroups)[number] => Boolean(group));
      return <section className="training-library-section" id={section.id} key={section.id}>
        <header><div><p className="if-kicker">TRAINING CATEGORY</p><h2>{section.title}</h2><p>{section.copy}</p></div><span>{groups.length} guides</span></header>
        <div className="training-card-row">
          {groups.map((group) => {
            const count = exercises.filter((exercise) => exercise.muscleSlug === group.slug).length;
            return <Link href={`/gym/${group.slug}`} className="training-muscle-card" key={group.slug}>
              <div className="training-card-image"><Image src={exerciseImageForSlot(group.imageSlot)} alt={`${group.name} training`} fill sizes="(max-width: 700px) 82vw, 340px" unoptimized /></div>
              <div className="training-card-content"><small>{count} exercises · {group.difficulty}</small><h3>{group.name}</h3><p>{group.focus}</p><div><span>{group.targetMuscles.slice(0, 2).join(" · ")}</span><b>Explore <ArrowUpRight size={15} /></b></div></div>
            </Link>;
          })}
        </div>
      </section>;
    })}
  </div>;
}
