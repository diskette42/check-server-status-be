import { EntityRepository, Repository } from 'typeorm';
import { WebCheck } from './web-check.entity';

@EntityRepository(WebCheck)
export class WebCheckRepository extends Repository<WebCheck> {}
