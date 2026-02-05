import { useUser } from "@clerk/clerk-react";

export const useGoogle = () => {
  const { user } = useUser();

  const googleAccount = user?.externalAccounts.find(
    (acc) => acc.provider === "google",
  );

  const hasGmailScope = !!googleAccount?.approvedScopes?.includes(
    "https://www.googleapis.com/auth/gmail.modify",
  );

  const isConnectedToGoogle = !!googleAccount;

  return {
    account: googleAccount,
    isConnectedToGoogle,
    hasGmailScope,
  };
};
