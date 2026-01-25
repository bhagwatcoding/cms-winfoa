'use client';

import { QuickActionsGrid } from './quick-actions';
import { quickActions } from './quick-action-items';

export function QuickActionCard() {
  return (
    <>
      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <QuickActionsGrid actions={quickActions} />
      </div>
    </>
  );
}
