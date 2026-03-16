"use client";

import { Shield } from "lucide-react";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";
import { UI_TEXT } from "@/constants/ui-text";

export default function SecurityPage() {
  return (
    <div className="space-y-8 container max-w-7xl py-8 animate-fade-in pb-20">
      <HeaderWithIcon 
        title={UI_TEXT.navigation.security.title} 
        subtitle={UI_TEXT.navigation.security.subtitle}
        icon={UI_TEXT.navigation.security.icon}
        iconColorClass={UI_TEXT.navigation.security.color}
        iconBgClass={UI_TEXT.navigation.security.bgColor}
        iconBorderClass={UI_TEXT.navigation.security.borderColor}
      />

      <div className="flex flex-col items-center justify-center py-20 bg-secondary/20 border border-dashed border-border rounded-3xl gap-4">
        <div className="p-4 bg-background rounded-full shadow-sm">
          <Shield className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <div className="text-center">
          <p className="text-foreground font-medium">Security settings coming soon</p>
          <p className="text-muted-foreground text-sm">Access control and permission management will be available here.</p>
        </div>
      </div>
    </div>
  );
}
