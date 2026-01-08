import { Prisma } from "@prisma/client";
import { GenerateMailRequest } from "../types/GenerateMailRequest.js";
import { log } from "console";
import EmailType from "../types/EmailType.js";

export async function upsertEmployee(
  tx: Prisma.TransactionClient,
  req: GenerateMailRequest
) {

  if (req.type === EmailType.FOLLOWUP || req.type === EmailType.THANKYOU) {
    return;
  }

  if (req.contactEmail?.trim()) {
    log("Upserting employee with email:", req.contactEmail);
    return tx.employee.upsert({
      where: { email: req.contactEmail },
      update: {
        name: req.contactName,
        company: req.companyName,
        position: req.role ?? undefined,
      },
      create: {
        name: req.contactName,
        email: req.contactEmail,
        company: req.companyName,
        position: req.role ?? "",
      },
    });
  }
  log("Creating new employee without email:", req.contactName);
  return tx.employee.create({
    data: {
      name: req.contactName,
      company: req.companyName,
      position: req.role ?? "",
    },
  });
}
