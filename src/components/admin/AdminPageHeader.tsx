import { AppButton } from "@/components/app/AppButton";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: string;
};

export function AdminPageHeader({ eyebrow, title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">{description}</p>
      </div>
      {action ? <AppButton>{action}</AppButton> : null}
    </div>
  );
}
