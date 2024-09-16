import { ChatProps } from "./chat";

export function EmptyScreen({title,subtitle}: ChatProps) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold text-center">
         {title}
        </h1>
        <p className="leading-normal text-muted-foreground text-center">
          {subtitle}
        </p>
      </div>
    </div>
  )
}
