import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderWithIconProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  iconBorderClass?: string;
  className?: string;
}

export function HeaderWithIcon({
  title,
  subtitle,
  icon: Icon,
  iconColorClass = "text-primary",
  iconBgClass = "bg-primary/10",
  iconBorderClass = "border-primary/20",
  className,
}: HeaderWithIconProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
        <div className={cn("p-2 rounded-lg shadow-sm border", iconBgClass, iconBorderClass)}>
          <Icon className={cn("w-8 h-8", iconColorClass)} />
        </div>
        {title}
      </h1>
      {subtitle && (
        <p className="text-muted-foreground text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
}
