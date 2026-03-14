import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateStudentProfileDto {
    @IsString() @IsOptional() fullName?: string;
    @IsString() @IsOptional() grade?: string;
    @IsString() @IsOptional() schoolName?: string;
    @IsString() @IsOptional() gender?: string;
    @IsString() @IsOptional() location?: string;
}

export class UpdateJobSeekerProfileDto {
    @IsString() @IsOptional() fullName?: string;
    @IsString() @IsOptional() gender?: string;
    @IsString() @IsOptional() location?: string;
    @IsString() @IsOptional() state?: string;
    @IsString() @IsOptional() phone?: string;
    @IsString() @IsOptional() educationLevel?: string;
    @IsString() @IsOptional() fieldOfStudy?: string;
    @IsString() @IsOptional() currentStatus?: string;
    @IsInt() @IsOptional() yearsOfExperience?: number;
}

export class UpdateEmployerProfileDto {
    @IsString() @IsOptional() companyName?: string;
    @IsString() @IsOptional() companySize?: string;
    @IsString() @IsOptional() industry?: string;
    @IsString() @IsOptional() website?: string;
    @IsString() @IsOptional() contactPerson?: string;
    @IsString() @IsOptional() phone?: string;
    @IsString() @IsOptional() address?: string;
}
