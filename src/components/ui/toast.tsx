"use client";

import { CheckCircle2 } from "lucide-react"; // icon
import { toast as sonnerToast } from "sonner";

interface SuccessToastProps {
  id: string | number;
  title: string;
  description?: string;
}

export function showSuccessToast({
  title,
  description,
}: Omit<SuccessToastProps, "id">) {
  return sonnerToast.custom((id) => (
    <SuccessToast id={id} title={title} description={description} />
  ));
}

function SuccessToast({ id, title, description }: SuccessToastProps) {
  return (
    <div className="flex w-[350px] max-w-full items-center gap-3 rounded-md border-2 border-emerald-300 bg-emerald-50 px-4 py-3 shadow-md">
      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />

      <div className="flex-1 leading-tight">
        <p className="text-sm font-bold text-gray-600">{title}</p>
        {description && (
          <p className="text-xs text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
}

