'use client'

import { useState } from 'react'
import { Button, Label } from '@/components/ui'
import { Upload, Camera, Loader2, X } from 'lucide-react'
import Image from 'next/image'

interface AvatarUploadProps {
    currentAvatar?: string
    userName: string
}

export function AvatarUpload({ currentAvatar, userName }: AvatarUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentAvatar || null)
    const [isUploading, setIsUploading] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB')
            return
        }

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // TODO: Upload to server
        setIsUploading(true)
        try {
            // Simulate upload
            await new Promise(resolve => setTimeout(resolve, 1500))

            // In real implementation, upload to your storage service:
            // const formData = new FormData()
            // formData.append('avatar', file)
            // const result = await uploadAvatar(formData)

            console.log('[DEV] Avatar uploaded:', file.name)
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Failed to upload avatar')
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemove = () => {
        setPreview(null)
        // TODO: Remove avatar from server
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">
                    Upload a photo to personalize your account
                </p>
            </div>

            <div className="flex items-start gap-6">
                {/* Avatar Display */}
                <div className="relative">
                    {preview ? (
                        <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted">
                            <Image
                                src={preview}
                                alt={userName}
                                fill
                                className="object-cover"
                            />
                            {!isUploading && (
                                <button
                                    onClick={handleRemove}
                                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                    title="Remove avatar"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                            {getInitials(userName)}
                        </div>
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                    )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                        <Label htmlFor="avatar-upload">Change Profile Picture</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('avatar-upload')?.click()}
                                disabled={isUploading}
                                className="gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Upload Photo
                            </Button>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                        <p>• Recommended: Square image, at least 400x400px</p>
                        <p>• Max file size: 5MB</p>
                        <p>• Formats: JPG, PNG, GIF</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
