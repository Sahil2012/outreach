import { coldEmailStrategy } from "./stratergy/coldEmail.js";
import { followupEmailStrategy } from "./stratergy/followupMail.js";
import { referralEmailStrategy } from "./stratergy/referralMail.js";
import { thankyouEmailStrategy } from "./stratergy/thankyouMail.js";

export const emailStrategy = {
  cold: coldEmailStrategy,
  followup: followupEmailStrategy,
  referral: referralEmailStrategy,
  thankyou: thankyouEmailStrategy,
} as any;