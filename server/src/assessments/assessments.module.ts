import { Module } from '@nestjs/common';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { ScoringService } from './scoring.service';
import { CareersService } from './careers.service';
import { SectorMatchingService } from './sector-matching.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiAnalysisModule } from '../ai-analysis/ai-analysis.module';

@Module({
    imports: [PrismaModule, AiAnalysisModule],
    controllers: [AssessmentsController],
    providers: [AssessmentsService, ScoringService, CareersService, SectorMatchingService],
    exports: [AssessmentsService, ScoringService, CareersService, SectorMatchingService],
})
export class AssessmentsModule { }


