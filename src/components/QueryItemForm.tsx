import { useForm } from "@tanstack/react-form";
import { Plus, XIcon } from "lucide-react";
import {
  type ChangeEvent,
  type ComponentProps,
  type FormEvent,
  type Ref,
  type RefObject,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TypeEnum } from "@/lib/enums";
import { queryItemFormSchema } from "@/lib/schemas";
import type { QueryItem } from "@/lib/types";

const typeSelect: Array<{ label: TypeEnum; value: TypeEnum }> = [
  { label: "String", value: "String" },
  { label: "Number", value: "Number" },
  { label: "Object", value: "Object" },
  { label: "Null", value: "Null" },
  { label: "Undefined", value: "Undefined" },
] as const;

export type FormValues = z.infer<typeof queryItemFormSchema>;

export interface QueryItemFormHandle {
  submit: () => void;
}

export interface QueryItemFormProps {
  defaultValues: QueryItem;
  onSubmit: (v: QueryItem) => void;
  ref?: Ref<QueryItemFormHandle>;
}

export function QueryItemForm({
  defaultValues,
  onSubmit,
  ref,
}: QueryItemFormProps) {
  const form = useForm({
    defaultValues: queryItemToForm(defaultValues),
    onSubmit: ({ value }) => {
      const v = formToQueryItem(value);
      onSubmit(v);
    },
    validators: {
      onSubmit: queryItemFormSchema,
      // TODO onBlur
    },
  });

  const selectRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useImperativeHandle(ref, () => ({
    submit: () => form.handleSubmit(),
  }));

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    // We never use the form onSubmit handler so we want to disable it's auto actions like the "Enter" key interaction.
    e.preventDefault();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <form.Field name="label">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <FormValueInput
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={field.handleChange}
                  value={field.state.value}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Field mode="array" name="queryKey">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet>
                <FieldLegend variant="label">Query Keys</FieldLegend>
                <FieldGroup className="flex items-center">
                  {field.state.value.map((_, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: not other key
                    <div className="flex items-start gap-2" key={index}>
                      <form.Field
                        listeners={{
                          onChange: ({ value }) => {
                            if (value === "Null") {
                              form.setFieldValue(
                                `queryKey[${index}].value`,
                                "null"
                              );
                            }
                            if (value === "Undefined") {
                              form.setFieldValue(
                                `queryKey[${index}].value`,
                                "undefined"
                              );
                            }
                          },
                        }}
                        name={`queryKey[${index}].type`}
                      >
                        {(subField) => {
                          const isSubFieldInvalid =
                            subField.state.meta.isTouched &&
                            !subField.state.meta.isValid;
                          return (
                            <Field
                              className="w-30"
                              data-invalid={isSubFieldInvalid}
                            >
                              <QueryKeyTypeSelect
                                index={index}
                                isInvalid={isInvalid}
                                name={subField.name}
                                onValueChange={subField.handleChange}
                                selectRefs={selectRefs}
                                value={subField.state.value}
                              />

                              {isSubFieldInvalid ? (
                                <FieldError
                                  errors={subField.state.meta.errors}
                                />
                              ) : null}
                            </Field>
                          );
                        }}
                      </form.Field>

                      <form.Field
                        name={`queryKey[${index}].value`}
                        validators={{
                          // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: typing will stay only in inline
                          onChange: ({ value }) => {
                            const type = form.getFieldValue(
                              `queryKey[${index}].type`
                            );
                            if (
                              type === "Number" &&
                              (value === "" || Number.isNaN(Number(value)))
                            ) {
                              return {
                                message: "Value must be a valid number",
                              };
                            }
                            if (type === "Object") {
                              try {
                                const parsed = JSON.parse(value as string);
                                if (
                                  typeof parsed !== "object" ||
                                  parsed === null ||
                                  Array.isArray(parsed)
                                ) {
                                  return new Error(
                                    "Value must be a valid JSON object"
                                  );
                                }
                              } catch (e) {
                                return e;
                              }
                            }
                          },
                          onChangeListenTo: [`queryKey[${index}].type`],
                        }}
                      >
                        {(valueField) => {
                          const isValueInvalid =
                            valueField.state.meta.isTouched &&
                            !valueField.state.meta.isValid;
                          const currentType = field.state.value[index]?.type;
                          const isDisabled =
                            currentType === "Null" ||
                            currentType === "Undefined";

                          return (
                            <Field
                              className="flex-1"
                              data-invalid={isValueInvalid}
                            >
                              <InputGroup>
                                <FormValueInput
                                  aria-invalid={isValueInvalid}
                                  autoComplete="off"
                                  disabled={isDisabled}
                                  grouped
                                  id={`form-QueryItem-value-${index}`}
                                  name={valueField.name}
                                  onBlur={valueField.handleBlur}
                                  onValueChange={valueField.handleChange}
                                  placeholder={"Enter value"}
                                  value={String(valueField.state.value ?? "")}
                                />
                                {field.state.value.length > 1 ? (
                                  <InputGroupAddon align="inline-end" />
                                ) : null}
                              </InputGroup>
                              {isValueInvalid ? (
                                <FieldError
                                  errors={
                                    valueField.state.meta.errors as Error[]
                                  }
                                />
                              ) : null}
                            </Field>
                          );
                        }}
                      </form.Field>

                      <RemoveQueryKeyButton
                        index={index}
                        onRemove={field.removeValue}
                      />
                    </div>
                  ))}
                  <AddQueryKeyButton
                    count={field.state.value.length}
                    onAdd={field.pushValue}
                    selectRefs={selectRefs}
                  />
                </FieldGroup>
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </FieldSet>
            );
          }}
        </form.Field>
      </FieldGroup>
    </form>
  );
}

function FormValueInput({
  grouped = false,
  onValueChange,
  ...props
}: Omit<ComponentProps<typeof Input>, "onChange"> & {
  grouped?: boolean;
  onValueChange: (value: string) => void;
}) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onValueChange(event.target.value);
    },
    [onValueChange]
  );
  const Component = grouped ? InputGroupInput : Input;

  return <Component {...props} onChange={handleChange} />;
}

function QueryKeyTypeSelect({
  index,
  isInvalid,
  name,
  onValueChange,
  selectRefs,
  value,
}: {
  index: number;
  isInvalid: boolean;
  name: string;
  onValueChange: (value: TypeEnum) => void;
  selectRefs: RefObject<Array<HTMLButtonElement | null>>;
  value: TypeEnum;
}) {
  const handleValueChange = useCallback(
    (nextValue: string) => onValueChange(nextValue as TypeEnum),
    [onValueChange]
  );
  const setSelectRef = useCallback(
    (element: HTMLButtonElement | null) => {
      selectRefs.current[index] = element;
    },
    [index, selectRefs]
  );

  return (
    <Select name={name} onValueChange={handleValueChange} value={value}>
      <SelectTrigger
        aria-invalid={isInvalid}
        id={`form-QueryItem-type-${index}`}
        ref={setSelectRef}
      >
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent position="item-aligned">
        {typeSelect.map((entry) => (
          <SelectItem key={entry.value} value={entry.value}>
            {entry.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function RemoveQueryKeyButton({
  index,
  onRemove,
}: {
  index: number;
  onRemove: (index: number) => void;
}) {
  const handleClick = useCallback(() => onRemove(index), [index, onRemove]);

  return (
    <Button
      aria-label={`Remove key ${index + 1}`}
      className="h-8"
      onClick={handleClick}
      size="icon-xs"
      type="button"
      variant="ghost"
    >
      <XIcon />
    </Button>
  );
}

function AddQueryKeyButton({
  count,
  onAdd,
  selectRefs,
}: {
  count: number;
  onAdd: (value: FormValues["queryKey"][number]) => void;
  selectRefs: RefObject<Array<HTMLButtonElement | null>>;
}) {
  const handleClick = useCallback(() => {
    onAdd({ type: "String", value: "" });
    setTimeout(() => {
      selectRefs.current[count]?.focus();
    }, 0);
  }, [count, onAdd, selectRefs]);

  return (
    <Button
      disabled={count >= 10}
      onClick={handleClick}
      size="icon"
      type="button"
      variant="outline"
    >
      <Plus />
    </Button>
  );
}

function queryItemToForm(item: QueryItem): FormValues {
  return {
    id: item.id,
    label: item.label,
    queryKey: item.queryKey.map((value) => {
      if (value === null) {
        return { type: "Null" as const, value: "" };
      }
      if (value === undefined) {
        return { type: "Undefined" as const, value: "" };
      }
      if (typeof value === "number") {
        return { type: "Number" as const, value: String(value) };
      }
      if (typeof value === "object") {
        return { type: "Object" as const, value: JSON.stringify(value) };
      }
      return { type: "String" as const, value };
    }),
  };
}

function formToQueryItem(form: FormValues) {
  return {
    id: form.id,
    label: form.label,
    queryKey: form.queryKey.map((pair): QueryItem["queryKey"][number] => {
      switch (pair.type) {
        case "Number":
          return Number(pair.value);
        case "Null":
          return null;
        case "Undefined":
          return undefined;
        case "Object":
          return JSON.parse(pair.value as string);
        default:
          return pair.value;
      }
    }),
  };
}
