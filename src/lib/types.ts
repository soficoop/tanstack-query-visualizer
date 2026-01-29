import type { z } from "zod";

import type { queryItemSchema } from "@/lib/schemas";

export type TQueryKeys = (string | number | object | null | undefined)[];

export type QueryItem = z.infer<typeof queryItemSchema>;
