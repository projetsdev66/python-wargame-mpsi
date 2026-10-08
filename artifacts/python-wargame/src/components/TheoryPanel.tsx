import { BookOpen, Clock3, Layers3 } from "lucide-react";
import type { LearningLevel, TheoryBlock } from "@/domain/types";

interface TheoryPanelProps {
  level: LearningLevel;
}

function TheoryContent({ block }: { block: TheoryBlock }) {
  if (block.kind === "heading") return <h3>{block.text}</h3>;
  if (block.kind === "code") return <pre className="wg-code-sample">{block.text}</pre>;
  if (block.kind === "tip") return <div className="wg-tip">{block.text}</div>;
  return <p>{block.text}</p>;
}

export function TheoryPanel({ level }: TheoryPanelProps) {
  return (
    <article className="wg-card" aria-labelledby="theory-heading" data-testid={`panel-theory-${level.id}`}>
      <div className="wg-card-head">
        <h2 className="wg-card-title" id="theory-heading">À retenir</h2>
        <BookOpen size={16} aria-hidden="true" />
      </div>
      <div className="wg-theory">
        {level.theory.length ? (
          level.theory.map((block, index) => <TheoryContent key={`${level.id}-theory-${index}`} block={block} />)
        ) : (
          <p data-testid="empty-theory">Le cours de ce niveau sera bientôt disponible.</p>
        )}
      </div>
      <div className="wg-exercise" data-testid={`text-exercise-${level.id}`}>
        <p className="wg-exercise-title">Le défi</p>
        <p>{level.exercise || "Aucun exercice n’est disponible pour le moment."}</p>
      </div>
      <div className="wg-lesson-facts" style={{ padding: "0 18px 17px" }}>
        <span className="wg-pill"><Clock3 size={12} /> {level.minutes} min</span>
        <span className="wg-pill"><Layers3 size={12} />{" "}
          {level.difficulty === 1 ? "Découverte" : level.difficulty === 2 ? "En pratique" : "Approfondissement"}
        </span>
      </div>
    </article>
  );
}
