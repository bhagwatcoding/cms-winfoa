// Student types
export interface IStudent {
    _id: string
    name: string
    fatherName: string
    motherName: string
    dob: Date
    gender: 'male' | 'female' | 'other'
    centerId: string
    courseId: string
    admissionDate: Date
    profileImage?: string
    status: 'active' | 'completed' | 'dropped'
    createdAt?: Date
    updatedAt?: Date
}

// Course types
export interface ICourse {
    _id: string
    name: string
    code: string
    duration: string
    fee: number
    createdAt?: Date
    updatedAt?: Date
}

// Result types
export interface IResult {
    _id: string
    studentId: string
    courseId: string
    obtainedMarks: number
    totalMarks: number
    percentage: number
    grade: string
    examDate: Date
    createdAt?: Date
    updatedAt?: Date
}

// Certificate types
export interface ICertificate {
    _id: string
    studentId: string
    courseId: string
    certificateNo: string
    issueDate: Date
    validUpto?: Date
    createdAt?: Date
    updatedAt?: Date
}

// Dashboard stats
export interface IDashboardStats {
    students: {
        total: number
        active: number
        completed: number
        dropped: number
    }
    courses: {
        total: number
    }
    employees: {
        total: number
    }
    certificates: {
        total: number
    }
}
