// src/app/profile/activity/page.tsx
import { ActivityLogger } from "@/services/activity.service";
import { getCurrentUser } from "@/actions/auth.actions"; // your auth helper

export default async function ActivityPage() {
  const user = await getCurrentUser();
  
  user = !user? : user.
  const logs = await ActivityLogger.getUserLogs(user.id);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

      <div className="space-y-4">
        {logs.map((log: any) => (
          <div
            key={log._id}
            className="border p-4 rounded bg-gray-50 flex justify-between"
          >
            <div>
              <span className="font-semibold text-blue-600">{log.action}</span>
              <p className="text-sm text-gray-600">{log.details}</p>
              {log.metadata?.before && (
                <p className="text-xs text-gray-500 mt-1">
                  Changed from {log.metadata.before} to {log.metadata.after}
                </p>
              )}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(log.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
