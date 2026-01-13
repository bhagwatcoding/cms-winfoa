'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Badge } from '@/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Skeleton } from '@/ui/skeleton'
import CourseCard from './CourseCard'
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Star,
  Users,
  Clock,
  DollarSign,
  X
} from 'lucide-react'

interface Course {
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
  tags?: string[]
  createdAt?: string | Date
}

interface CourseListProps {
  initialCourses?: Course[]
  showFilters?: boolean
  showSearch?: boolean
  showSort?: boolean
  showViewToggle?: boolean
  defaultView?: 'grid' | 'list'
  onEnroll?: (courseId: string) => void
  enrolledCourses?: string[]
  featuredOnly?: boolean
  categoryFilter?: string
  levelFilter?: string
  className?: string
}

const categories = [
  'All Categories',
  'Programming',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Design',
  'Marketing',
  'Business',
  'Photography',
  'Music',
  'Language'
]

const levels = ['All Levels', 'beginner', 'intermediate', 'advanced']

const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'duration', label: 'Duration' }
]

export function CourseList({
  initialCourses = [],
  showFilters = true,
  showSearch = true,
  showSort = true,
  showViewToggle = true,
  defaultView = 'grid',
  onEnroll,
  enrolledCourses = [],
  featuredOnly = false,
  categoryFilter,
  levelFilter,
  className = ''
}: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'All Categories')
  const [selectedLevel, setSelectedLevel] = useState(levelFilter || 'All Levels')
  const [sortBy, setSortBy] = useState('popularity')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory !== 'All Categories') params.append('category', selectedCategory)
      if (selectedLevel !== 'All Levels') params.append('level', selectedLevel)
      if (featuredOnly) params.append('featured', 'true')
      params.append('limit', '50')

      const response = await fetch(`/api/academy/courses?${params}`)
      const data = await response.json()

      if (data.success) {
        setCourses(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort courses
  const filteredAndSortedCourses = courses
    .filter(course => {
      // Price range filter
      if (course.price < priceRange[0] || course.price > priceRange[1]) return false

      // Additional search in tags
      if (searchQuery && course.tags) {
        const searchInTags = course.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
        if (!searchInTags &&
            !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !course.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.averageRating - a.averageRating
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'duration':
          return a.duration - b.duration
        case 'popularity':
        default:
          return b.enrolledStudents - a.enrolledStudents
      }
    })

  useEffect(() => {
    fetchCourses()
  }, [searchQuery, selectedCategory, selectedLevel, featuredOnly])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All Categories')
    setSelectedLevel('All Levels')
    setPriceRange([0, 1000])
    setSortBy('popularity')
  }

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All Categories' ||
    selectedLevel !== 'All Levels' ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000

  const renderCourseGrid = () => (
    <div className={`grid gap-6 ${
      viewMode === 'grid'
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        : 'grid-cols-1'
    }`}>
      {filteredAndSortedCourses.map(course => (
        <CourseCard
          key={course._id}
          course={course}
          variant={viewMode === 'list' ? 'compact' : 'default'}
          onEnroll={onEnroll}
          isEnrolled={enrolledCourses.includes(course._id)}
        />
      ))}
    </div>
  )

  const renderLoadingSkeleton = () => (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="h-80">
          <Skeleton className="h-40 w-full rounded-t-lg" />
          <CardContent className="p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            {showSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses, instructors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              {showFilters && (
                <>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level} value={level}>
                          {level === 'All Levels' ? level : level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              {showSort && (
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <div className="flex items-center gap-2">
                      <SortAsc className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {showViewToggle && (
                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {selectedCategory !== 'All Categories' && (
                <Badge variant="secondary">
                  Category: {selectedCategory}
                </Badge>
              )}
              {selectedLevel !== 'All Levels' && (
                <Badge variant="secondary">
                  Level: {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            {loading ? 'Loading...' : `${filteredAndSortedCourses.length} Courses`}
          </h2>
          {featuredOnly && (
            <Badge className="bg-yellow-100 text-yellow-800">
              <Star className="h-3 w-3 mr-1" />
              Featured Only
            </Badge>
          )}
        </div>

        {/* Quick Stats */}
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{filteredAndSortedCourses.reduce((sum, course) => sum + course.enrolledStudents, 0)} students</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{filteredAndSortedCourses.reduce((sum, course) => sum + course.duration, 0)} hours</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>{filteredAndSortedCourses.filter(course => course.price === 0).length} free</span>
          </div>
        </div>
      </div>

      {/* Course Grid/List */}
      {loading ? (
        renderLoadingSkeleton()
      ) : filteredAndSortedCourses.length > 0 ? (
        renderCourseGrid()
      ) : (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse all available courses.
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default CourseList
