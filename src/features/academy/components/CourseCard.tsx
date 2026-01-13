'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/ui/card'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import {
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  DollarSign,
  PlayCircle,
  ChevronRight
} from 'lucide-react'

interface CourseCardProps {
  course: {
    _id: string
    title: string
    description?: string
    code: string
    category: string
    level: 'beginner' | 'intermediate' | 'advanced'
    duration: number
    price: number
    originalPrice?: number
    currency: string
    thumbnail?: string
    instructor: {
      name: string
      email: string
      avatar?: string
    }
    enrolledStudents: number
    averageRating: number
    totalRatings: number
    isFeatured: boolean
    hasCertificate: boolean
    slug: string
    discountPercentage?: number
    totalLessons?: number
  }
  variant?: 'default' | 'compact' | 'featured'
  showEnrollButton?: boolean
  onEnroll?: (courseId: string) => void
  isEnrolled?: boolean
}

const levelColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
}

const levelLabels = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced'
}

export function CourseCard({
  course,
  variant = 'default',
  showEnrollButton = true,
  onEnroll,
  isEnrolled = false
}: CourseCardProps) {
  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ))
  }

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={levelColors[course.level]}>
                  {levelLabels[course.level]}
                </Badge>
                {course.isFeatured && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Featured
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                by {course.instructor.name}
              </p>
            </div>
            {course.thumbnail && (
              <div className="relative w-16 h-12 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.duration}h
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {course.enrolledStudents}
              </span>
            </div>
            <div className="font-semibold text-foreground">
              {formatPrice(course.price, course.currency)}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'featured') {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
        <div className="relative">
          {course.thumbnail ? (
            <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className="bg-blue-600 text-white">Featured</Badge>
                <Badge className={levelColors[course.level]}>
                  {levelLabels[course.level]}
                </Badge>
              </div>
              <div className="absolute bottom-3 right-3">
                <Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                  <PlayCircle className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-blue-300" />
            </div>
          )}
        </div>
        <CardHeader>
          <div className="space-y-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {course.description}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                by {course.instructor.name}
              </p>
              <div className="flex items-center gap-1">
                {renderStars(course.averageRating)}
                <span className="text-sm text-muted-foreground ml-1">
                  ({course.totalRatings})
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{course.duration} hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{course.enrolledStudents} students</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>{course.totalLessons || 0} lessons</span>
            </div>
            {course.hasCertificate && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>Certificate</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-0">
          <div className="flex flex-col items-start">
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(course.originalPrice, course.currency)}
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(course.price, course.currency)}
              </span>
              {course.discountPercentage && course.discountPercentage > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {course.discountPercentage}% OFF
                </Badge>
              )}
            </div>
          </div>
          {showEnrollButton && (
            <Button
              onClick={() => onEnroll?.(course._id)}
              disabled={isEnrolled}
              className="px-6"
            >
              {isEnrolled ? 'Enrolled' : 'Enroll Now'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 h-full flex flex-col">
      <div className="relative">
        {course.thumbnail ? (
          <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute top-2 left-2 flex gap-1">
              <Badge className={levelColors[course.level]} variant="secondary">
                {levelLabels[course.level]}
              </Badge>
              {course.isFeatured && (
                <Badge className="bg-blue-600 text-white">
                  Featured
                </Badge>
              )}
            </div>
            {course.discountPercentage && course.discountPercentage > 0 && (
              <div className="absolute top-2 right-2">
                <Badge variant="destructive">
                  {course.discountPercentage}% OFF
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-t-lg flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-slate-400" />
            <div className="absolute top-2 left-2 flex gap-1">
              <Badge className={levelColors[course.level]} variant="secondary">
                {levelLabels[course.level]}
              </Badge>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="flex-shrink-0">
        <div className="space-y-2">
          <Link
            href={`/academy/courses/${course.slug}`}
            className="block group-hover:text-blue-600 transition-colors"
          >
            <h3 className="font-semibold leading-tight line-clamp-2">
              {course.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">
            by {course.instructor.name}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-3">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {renderStars(course.averageRating)}
            </div>
            <span className="text-sm text-muted-foreground">
              {course.averageRating.toFixed(1)} ({course.totalRatings})
            </span>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{course.duration}h</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{course.enrolledStudents}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{course.totalLessons || 0} lessons</span>
            </div>
            {course.hasCertificate && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Certificate</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0 mt-auto">
        <div className="flex flex-col">
          {course.originalPrice && course.originalPrice > course.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(course.originalPrice, course.currency)}
            </span>
          )}
          <span className="font-bold text-lg">
            {formatPrice(course.price, course.currency)}
          </span>
        </div>

        {showEnrollButton && (
          <Button
            size="sm"
            onClick={() => onEnroll?.(course._id)}
            disabled={isEnrolled}
            variant={isEnrolled ? "secondary" : "default"}
          >
            {isEnrolled ? 'Enrolled' : 'Enroll'}
            {!isEnrolled && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default CourseCard
