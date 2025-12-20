import { coldEmailStrategy } from "./stratergy/coldEmail.js";
import { followupEmailStrategy } from "./stratergy/followupMail.js";
import { tailoredEmailStrategy } from "./stratergy/tailoredEmailStrategy.js";
import { thankyouEmailStrategy } from "./stratergy/thankyouMail.js";

export const emailStrategy = {
  cold: coldEmailStrategy,
  followup: followupEmailStrategy,
  tailored: tailoredEmailStrategy,
  thankyou: thankyouEmailStrategy,
} as any;