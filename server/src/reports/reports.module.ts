import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AiAnalysisModule } from '../ai-analysis/ai-analysis.module';

@Module({
    imports: [PrismaModule, AiAnalysisModule],
    providers: [ReportsService],
    controllers: [ReportsController],
    exports: [ReportsService],
})
export class ReportsModule { }
