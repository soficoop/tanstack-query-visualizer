import { useForm } from "@tanstack/react-form";
import { Plus, XIcon } from "lucide-react";
import { forwardRef, useImperativeHandle, useRef } from "react";
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
}

export const QueryItemForm = forwardRef<
  QueryItemFormHandle,
  QueryItemFormProps
>(({ defaultValues, onSubmit }, ref) => {
  const form = useForm({
    defaultValues: queryItemToForm(defaultValues),
    validators: {
      onSubmit: queryItemFormSchema,
      // TODO onBlur
    },
    onSubmit: ({ value }) => {
      const v = formToQueryItem(value);
      onSubmit(v);
    },
  });

  const selectRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useImperativeHandle(ref, () => ({
    submit: () => form.handleSubmit(),
  }));

  return (
    <form
      onSubmit={(e) => {
        // We never use the form onSubmit handler so we want to disable it's auto actions like the "Enter" key interaction.
        e.preventDefault();
      }}
    >
      <FieldGroup>
        <form.Field name="label">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                              <Select
                                name={subField.name}
                                onValueChange={(v: string) =>
                                  subField.handleChange(v as TypeEnum)
                                }
                                value={subField.state.value}
                              >
                                <SelectTrigger
                                  aria-invalid={isInvalid}
                                  id={`form-QueryItem-type-${index}`}
                                  ref={(el) => {
                                    selectRefs.current[index] = el;
                                  }}
                                >
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="item-aligned">
                                  {typeSelect.map((e) => (
                                    <SelectItem key={e.value} value={e.value}>
                                      {e.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {isSubFieldInvalid && (
                                <FieldError
                                  errors={subField.state.meta.errors}
                                />
                              )}
                            </Field>
                          );
                        }}
                      </form.Field>

                      <form.Field
                        name={`queryKey[${index}].value`}
                        validators={{
                          onChangeListenTo: [`queryKey[${index}].type`],
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
                            return undefined;
                          },
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
                                <InputGroupInput
                                  aria-invalid={isValueInvalid}
                                  autoComplete="off"
                                  disabled={isDisabled}
                                  id={`form-QueryItem-value-${index}`}
                                  name={valueField.name}
                                  onBlur={valueField.handleBlur}
                                  onChange={(e) =>
                                    valueField.handleChange(e.target.value)
                                  }
                                  placeholder={"Enter value"}
                                  value={String(valueField.state.value ?? "")}
                                />
                                {field.state.value.length > 1 && (
                                  <InputGroupAddon align="inline-end" />
                                )}
                              </InputGroup>
                              {isValueInvalid && (
                                <FieldError
                                  errors={
                                    valueField.state.meta.errors as Error[]
                                  }
                                />
                              )}
                            </Field>
                          );
                        }}
                      </form.Field>

                      <Button
                        aria-label={`Remove key ${index + 1}`}
                        className="h-8"
                        onClick={() => field.removeValue(index)}
                        size="icon-xs"
                        type="button"
                        variant="ghost"
                      >
                        <XIcon />
                      </Button>
                    </div>
                  ))}
                  <Button
                    disabled={field.state.value.length >= 10}
                    onClick={() => {
                      field.pushValue({ type: "String", value: "" });
                      setTimeout(() => {
                        const lastIndex = field.state.value.length;
                        selectRefs.current[lastIndex - 1]?.focus();
                      }, 0);
                    }}
                    size="icon"
                    type="button"
                    variant="outline"
                  >
                    <Plus />
                  </Button>
                </FieldGroup>
                isInvalid && <FieldError errors={field.state.meta.errors} />
              </FieldSet>
            );
          }}
        </form.Field>
      </FieldGroup>
    </form>
  );
});

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
    queryKey: form.queryKey.map((pair) => {
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

QueryItemForm.displayName = "QueryItemForm";
