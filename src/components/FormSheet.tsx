import { type ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { QueryItemFormHandle } from "@/components/QueryItemForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FormProps<T> {
  ref?: React.Ref<QueryItemFormHandle>;
  defaultValues: T;
  onSubmit: (value: T) => void;
}

interface FormSheetProps<T> {
  current: T;
  children: ReactNode;
  FormComponent: React.ComponentType<FormProps<T>>;
  onSave: (value: T) => void;
  title: string;
  side: React.ComponentProps<typeof SheetContent>["side"];
  toastString: string;
  variant: "red" | "blue";
}

export function FormSheet<T>({
  children,
  variant,
  current,
  toastString,
  FormComponent,
  onSave,
  title,
  side,
}: FormSheetProps<T>) {
  const formRef = useRef<QueryItemFormHandle>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = (value: T) => {
    onSave(value);
    toast.success(toastString);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        formRef.current?.submit?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="bg-background/60" side={side}>
        {/* This is to remove warning */}
        <SheetDescription className="hidden" />

        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <FormComponent
            defaultValues={current}
            onSubmit={handleSubmit}
            ref={formRef}
          />
        </div>
        <SheetFooter>
          <Button asChild variant="outline">
            <SheetClose>Cancel</SheetClose>
          </Button>
          <Button
            onClick={() => formRef.current?.submit()}
            type="button"
            variant={variant}
          >
            Submit
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
