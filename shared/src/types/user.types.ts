/**
 * User Role Enumeration
 */
export enum UserRole {
    STUDENT = 'STUDENT',
    JOB_SEEKER = 'JOB_SEEKER',
    EMPLOYER = 'EMPLOYER',
    ADMIN = 'ADMIN'
}

/**
 * Base User Interface
 */
export interface User {
    id: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
    isActive: boolean;
    fullName?: string;
    companyName?: string;
    createdAt: Date;
    updatedAt: Date;
    studentProfile?: StudentProfile;
    jobSeekerProfile?: JobSeekerProfile;
    employerProfile?: EmployerProfile;
}

/**
 * Student Profile
 */
export interface StudentProfile {
    id: string;
    userId: string;
    fullName: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: string;
    schoolName?: string;
    grade?: string;
    location?: string;
    state?: string;
    profilePictureUrl?: string;
    isPragyaVerified: boolean;
    verificationDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Job Seeker Profile
 */
export interface JobSeekerProfile {
    id: string;
    userId: string;
    fullName: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: string;
    location?: string;
    state?: string;
    educationLevel?: string;
    fieldOfStudy?: string;
    currentStatus?: string;
    yearsOfExperience?: number;
    resumeUrl?: string;
    profilePictureUrl?: string;
    isPragyaVerified: boolean;
    verificationDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Employer Profile
 */
export interface EmployerProfile {
    id: string;
    userId: string;
    companyName: string;
    companySize?: string;
    industry?: string;
    website?: string;
    contactPerson?: string;
    phone?: string;
    companyLogoUrl?: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Registration Data Transfer Objects
 */
export interface RegisterDTO {
    email: string;
    password: string;
    role: UserRole;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}
