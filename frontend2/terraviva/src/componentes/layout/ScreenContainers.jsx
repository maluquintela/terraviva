import React from "react";
import { cn } from "../../utils/cn";

export function SafeAreaView({ children, className = "" }) {
  return (
    <div className={cn("flex min-h-screen w-full justify-center bg-white", className)}>
      <div className="flex w-full max-w-[420px] flex-1">{children}</div>
    </div>
  );
}

export function ScrollView({ children, className = "" }) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-y-auto px-6 pb-14 pt-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

