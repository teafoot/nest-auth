import { Repository } from 'typeorm';
import { Reset } from './models/reset.interface';
import { ResetEntity } from './reset.entity';
export declare class ResetService {
    private readonly resetRepository;
    constructor(resetRepository: Repository<ResetEntity>);
    create(reset: Reset): Promise<Reset>;
    findOne(condition: any): Promise<Reset>;
}
