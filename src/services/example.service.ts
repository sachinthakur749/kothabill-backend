import logger from '../config/logger';

export class ExampleService {
  static async performAction(data: any): Promise<any> {
    logger.info('Performing action with data:', data);
    // Add your business logic here
    return { success: true, data };
  }
}