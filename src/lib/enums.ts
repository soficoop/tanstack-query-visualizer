export const typeEnum = {
  Null: "Null",
  Number: "Number",
  Object: "Object",
  String: "String",
  Undefined: "Undefined",
} as const;

export type TypeEnum = (typeof typeEnum)[keyof typeof typeEnum];
