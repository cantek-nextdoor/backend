import { Controller, Get, Header } from '@nestjs/common';

@Controller('cat')
export class CatController {
  @Get()
  @Header('content-type', 'application/json')
  findAll(): Record<string, string> {
    return { hi: 'cat' };
  }
}
