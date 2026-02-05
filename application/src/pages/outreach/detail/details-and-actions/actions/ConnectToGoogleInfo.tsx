import ConnectToGmailButton from "@/components/function/send-email-button/ConnectToGmail";
import { useGoogle } from "@/hooks/auth/useGoogleData";
import { useThread } from "@/hooks/threads/useThreadData";
import { PropsWithId } from "@/lib/types/commonTypes";
import { Thread } from "@/lib/types/threadsTypes";

const checkGoogleSync = (thread: Thread) => {
  const googleSync = thread?.sync;
  let googleReauthorizationNeeded = false;
  let insufficientPermissions = false;

  if (
    !googleSync?.status &&
    (googleSync?.code?.includes("refresh_token_not_found") ||
      googleSync?.code?.includes("thread_not_found_in_external_source"))
  ) {
    googleReauthorizationNeeded = true;
  }
  if (
    !googleSync?.status &&
    googleSync?.code?.includes("insufficient_permissions")
  ) {
    insufficientPermissions = true;
  }

  return [googleReauthorizationNeeded, insufficientPermissions];
};

const ConnectToGoogleInfo = ({ id }: PropsWithId) => {
  const { data: thread } = useThread(id);
  const { hasGmailScope } = useGoogle();

  if (!thread) {
    return null;
  }

  const [reauthNeeded, insufficientPermissions] = checkGoogleSync(thread);
  if (!hasGmailScope || !reauthNeeded || !insufficientPermissions) {
    return null;
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-5 rounded-3xl border border-yellow-100 dark:border-yellow-900/20">
      <div className="flex flex-col items-start gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
            {insufficientPermissions
              ? "Insufficient permissions"
              : "Thread not synced"}
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            {insufficientPermissions
              ? "Your account is connected to Google but the permissions to access the thread is not granted. Please connect your Google account with required permissions to sync your emails and track your outreach."
              : "Your account is not connected to Google. Please connect your Google account to sync your emails and track your outreach."}
          </p>
        </div>
        <ConnectToGmailButton variant="outline" className="w-full" size="sm" />
      </div>
    </div>
  );
};

export default ConnectToGoogleInfo;
