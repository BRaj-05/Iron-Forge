import type { ReactNode } from "react";
import Card from "@/components/ui/Card";

export default function Panel({ title, description, action, children, className = "" }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <Card className={`dashboard-panel ${className}`}><div className="dashboard-panel-heading"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>{children}</Card>;
}
