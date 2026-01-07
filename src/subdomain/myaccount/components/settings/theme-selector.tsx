'use client'

import { updateTheme } from '@/myaccount/actions/settings'
import { Label } from '@/components/ui'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useState, useTransition } from 'react'

interface ThemeSelectorProps {
    currentTheme: 'light' | 'dark' | 'system'
}

export function ThemeSelector({ currentTheme }: ThemeSelectorProps) {
    const [theme, setTheme] = useState(currentTheme)
    const [isPending, startTransition] = useTransition()

    const themes = [
        { value: 'light', label: 'Light', icon: Sun, description: 'Light mode' },
        { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark mode' },
        { value: 'system', label: 'System', icon: Monitor, description: 'Use system setting' },
    ] as const

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme)

        startTransition(async () => {
            await updateTheme(newTheme)

            // Apply theme to document (optional - you can integrate with your theme system)
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark')
            } else if (newTheme === 'light') {
                document.documentElement.classList.remove('dark')
            } else {
                // System preference
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                if (isDark) {
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                }
            }
        })
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                    Customize how the app looks to you
                </p>
            </div>

            <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                    {themes.map((option) => {
                        const Icon = option.icon
                        const isSelected = theme === option.value

                        return (
                            <button
                                key={option.value}
                                onClick={() => handleThemeChange(option.value)}
                                disabled={isPending}
                                className={`
                  relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all
                  ${isSelected
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50 hover:bg-accent'
                                    }
                  ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                            >
                                <Icon className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                                <div className="text-center">
                                    <div className={`font-medium ${isSelected ? 'text-primary' : ''}`}>
                                        {option.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        {option.description}
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className="absolute top-2 right-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            <p className="text-xs text-muted-foreground">
                Your theme preference is saved automatically
            </p>
        </div>
    )
}
