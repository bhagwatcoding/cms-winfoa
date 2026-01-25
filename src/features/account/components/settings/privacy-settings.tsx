'use client';

import { updatePrivacySettings } from '@/actions/account';
import { Label } from '@/ui';
import { Switch } from '@/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui';
import { useState, useTransition } from 'react';
import { Eye, Users, Lock } from 'lucide-react';

interface PrivacySettingsProps {
  initialSettings: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showActivity: boolean;
  };
}

export function PrivacySettings({ initialSettings }: PrivacySettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleVisibilityChange = (value: 'public' | 'private' | 'friends') => {
    setSettings((prev) => ({ ...prev, profileVisibility: value }));

    startTransition(async () => {
      const result = await updatePrivacySettings({
        ...settings,
        profileVisibility: value,
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Privacy settings updated' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update' });
        setSettings((prev) => ({ ...prev, profileVisibility: initialSettings.profileVisibility }));
      }

      setTimeout(() => setMessage(null), 3000);
    });
  };

  const handleToggle = (key: 'showEmail' | 'showActivity') => {
    const newValue = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: newValue }));

    startTransition(async () => {
      const result = await updatePrivacySettings({
        ...settings,
        [key]: newValue,
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Privacy settings updated' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update' });
        setSettings((prev) => ({ ...prev, [key]: !newValue }));
      }

      setTimeout(() => setMessage(null), 3000);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Privacy Settings</h3>
        <p className="text-sm text-muted-foreground">
          Control who can see your profile and activity
        </p>
      </div>

      {message && (
        <div
          className={`p-3 text-sm rounded-lg ${
            message.type === 'success'
              ? 'text-green-600 bg-green-50 border border-green-200'
              : 'text-red-600 bg-red-50 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="visibility">Profile Visibility</Label>
          <Select
            value={settings.profileVisibility}
            onValueChange={handleVisibilityChange}
            disabled={isPending}
          >
            <SelectTrigger id="visibility" className="w-full max-w-xs">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>Public - Anyone can view</span>
                </div>
              </SelectItem>
              <SelectItem value="friends">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Friends - Only friends can view</span>
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Private - Only you can view</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose who can see your profile information
          </p>
        </div>

        <div className="flex items-center justify-between py-3 border-b">
          <div className="space-y-0.5">
            <Label htmlFor="showEmail" className="text-base">
              Show Email Address
            </Label>
            <p className="text-sm text-muted-foreground">
              Display your email on your public profile
            </p>
          </div>
          <Switch
            id="showEmail"
            checked={settings.showEmail}
            onCheckedChange={() => handleToggle('showEmail')}
            disabled={isPending}
          />
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="space-y-0.5">
            <Label htmlFor="showActivity" className="text-base">
              Show Activity
            </Label>
            <p className="text-sm text-muted-foreground">Let others see your recent activity</p>
          </div>
          <Switch
            id="showActivity"
            checked={settings.showActivity}
            onCheckedChange={() => handleToggle('showActivity')}
            disabled={isPending}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Changes are saved automatically</p>
    </div>
  );
}
