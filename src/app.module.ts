import { Module } from '@nestjs/common';
import { EligibilityModule } from './modules/eligibility/eligibility.module';

@Module({
  imports: [EligibilityModule],
  providers: [],
})
export class AppModule {}
