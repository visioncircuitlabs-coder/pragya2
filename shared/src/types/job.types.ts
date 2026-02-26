/**
 * Job Type Enumeration
 */
export enum JobType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    CONTRACT = 'CONTRACT',
    INTERNSHIP = 'INTERNSHIP',
    FREELANCE = 'FREELANCE'
}

/**
 * Job Status
 */
export enum JobStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED',
    EXPIRED = 'EXPIRED'
}

/**
 * Application Status
 */
export enum ApplicationStatus {
    APPLIED = 'APPLIED',
    SHORTLISTED = 'SHORTLISTED',
    INTERVIEWED = 'INTERVIEWED',
    OFFERED = 'OFFERED',
    REJECTED = 'REJECTED',
    WITHDRAWN = 'WITHDRAWN',
    ACCEPTED = 'ACCEPTED'
}

/**
 * Job Interface
 */
export interface Job {
    id: string;
    employerId: string;
    title: string;
    description: string;
    location: string;
    jobType: JobType;
    experienceRequired?: string;
    salaryRange?: string;
    requiredSkills?: string[];
    status: JobStatus;
    postedAt: Date;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Job Application
 */
export interface JobApplication {
    id: string;
    jobId: string;
    jobSeekerId: string;
    coverLetter?: string;
    status: ApplicationStatus;
    matchScore?: number;
    retentionScore?: number;
    appliedAt: Date;
    updatedAt: Date;
}

/**
 * Job Match Result
 */
export interface JobMatchResult {
    job: Job;
    matchScore: number;
    retentionScore: number;
    matchingSkills: string[];
    missingSkills: string[];
    recommendation: string;
}

/**
 * Job Search Filters
 */
export interface JobSearchFilters {
    query?: string;
    location?: string;
    jobType?: JobType[];
    experienceLevel?: string[];
    salaryMin?: number;
    salaryMax?: number;
    skills?: string[];
    page?: number;
    limit?: number;
}

/**
 * Job Posting DTO
 */
export interface CreateJobDTO {
    title: string;
    description: string;
    location: string;
    jobType: JobType;
    experienceRequired?: string;
    salaryRange?: string;
    requiredSkills?: string[];
    expiresAt?: Date;
}

export interface UpdateJobDTO extends Partial<CreateJobDTO> {
    status?: JobStatus;
}
