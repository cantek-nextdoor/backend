import { Controller, Get, Header } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  @Header('content-type', 'application/json')
  findAll(): Record<string, string> {
    return { hi: 'cats' };
  }
}
