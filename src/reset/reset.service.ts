import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reset } from './models/reset.interface';
import { ResetEntity } from './reset.entity';

@Injectable()
export class ResetService {
    constructor(
        @InjectRepository(ResetEntity) private readonly resetRepository: Repository<ResetEntity>
    ) {

    }

    async create(reset: Reset): Promise<Reset> {
        return await this.resetRepository.save(reset);
    }

    async findOne(condition): Promise<Reset> {
        return await this.resetRepository.findOne(condition);
    }
}
