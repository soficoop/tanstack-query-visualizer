import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { QueryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  list: QueryItem["queryKey"];
  className?: string;
}

function isPlainObject(val: unknown): val is object {
  return (
    typeof val === "object" &&
    val !== null &&
    !Array.isArray(val) &&
    !(val instanceof Date)
  );
}

function stringifyKeyPart(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";

  if (typeof value === "string") {
    return `'${value}'`;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value instanceof Date) {
    return `Date(${value.toISOString()})`;
  }

  if (isPlainObject(value)) {
    return "{...}";
  }

  // arrays & other objects
  try {
    return JSON.stringify(value);
  } catch {
    return "[Unserializable]";
  }
}

function toStringTQueryKeys(list: QueryItem["queryKey"]) {
  return list.map((key, idx) => {
    if (isPlainObject(key)) {
      return (
        <Tooltip key={idx}>
          <TooltipTrigger asChild>
            <span className="cursor-pointer">{"{...}"}</span>
          </TooltipTrigger>
          <TooltipContent>
            <pre className="max-w-xs whitespace-pre-wrap text-xs">
              {JSON.stringify(key, null, 2)}
            </pre>
          </TooltipContent>
        </Tooltip>
      );
    }
    return <span key={idx}>{stringifyKeyPart(key)}</span>;
  });
}

export function QueryKeys({ list, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-start gap-1",
        className
      )}
    >
      <span>[</span>
      {toStringTQueryKeys(list).map((el, idx, arr) => (
        <span key={idx}>
          {el}
          {idx < arr.length - 1 && <span>,&nbsp;</span>}
        </span>
      ))}
      <span>]</span>
    </div>
  );
}
