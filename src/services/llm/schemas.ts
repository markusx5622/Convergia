import { z } from "zod";

export const StakeholderArgumentSchema = z.object({
  stakeholderId: z.string(),
  text: z.string(),
});

export const StakeholderArgumentArraySchema = z.array(
  StakeholderArgumentSchema,
);

export const RoundObjectionSchema = z.object({
  stakeholderId: z.string(),
  round: z.number(),
  text: z.string(),
});

export const RoundObjectionArraySchema = z.array(RoundObjectionSchema);

export const ConcessionTextSchema = z.object({
  stakeholderId: z.string(),
  round: z.number(),
  text: z.string(),
});

export const ConcessionTextArraySchema = z.array(ConcessionTextSchema);
