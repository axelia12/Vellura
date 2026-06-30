import type { ComponentType } from "react";
import ReputationVisual from "./ReputationVisual";
import CommunicationsVisual from "./CommunicationsVisual";
import BrandStrategyVisual from "./BrandStrategyVisual";
import CultureVisual from "./CultureVisual";
import LeadershipVisual from "./LeadershipVisual";
import DefaultVisual from "./DefaultVisual";

type VisualProps = { className?: string };

const VISUAL_MAP: Record<string, ComponentType<VisualProps>> = {
  Reputation: ReputationVisual,
  Communications: CommunicationsVisual,
  "Brand Strategy": BrandStrategyVisual,
  Culture: CultureVisual,
  Leadership: LeadershipVisual,
};

export default function CategoryVisual({
  category,
  className = "",
}: {
  category?: string | null;
  className?: string;
}) {
  const Visual = (category && VISUAL_MAP[category]) || DefaultVisual;
  return <Visual className={className} />;
}
