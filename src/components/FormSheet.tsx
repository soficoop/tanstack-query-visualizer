import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
  defaultValues: T;
  onSubmit: (value: T) => void;
  ref?: React.Ref<QueryItemFormHandle>;
}

interface FormSheetProps<T> {
  children: ReactNode;
  current: T;
  FormComponent: React.ComponentType<FormProps<T>>;
  onSave: (value: T) => void;
  side: React.ComponentProps<typeof SheetContent>["side"];
  title: string;
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
  const formRef = useRef<QueryItemFormHandle | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = useCallback(
    (value: T) => {
      onSave(value);
      toast.success(toastString);
      setOpen(false);
    },
    [onSave, toastString]
  );

  const submitForm = useCallback(() => {
    formRef.current?.submit();
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        submitForm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, submitForm]);

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
          <Button onClick={submitForm} type="button" variant={variant}>
            Submit
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
