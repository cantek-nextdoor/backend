import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleService } from './sale.service';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Controller('sale')
export class SaleController {
  constructor(private _SaleService: SaleService) {}

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto) {
    return this._SaleService.create(createSaleDto);
  }

  @Get('/:saleId')
  async findSaleById(@Param('saleId') saleId: string) {
    const foundSale = await this._SaleService.findSalesBySaleId(saleId);
    return foundSale;
  }

  //search ALL sale related with one user id
  @Get('/searchSales/:userid')
  async findSalesByUserId(@Param('userid') userId: string) {
    const SaleList = await this._SaleService.findSalesByUserId(userId);
    return SaleList;
  }

  //search ALL sale belong to one tag
  @Get('/searchSales/:tag')
  async findSalesByTag(@Param('tag') tag: string) {
    const SaleList = await this._SaleService.findSalesByTag(tag);
    return SaleList;
  }

  @Patch('/update')
  async updateSale(
    @Query('saleId') saleId: string,
    @Body() updateSaleDto: UpdateSaleDto,
  ) {
    return this._SaleService.updateSale(saleId, updateSaleDto);
  }

  @Patch('/liked')
  async addLikedUser(
    @Query('userId') userId: string,
    @Query('saleId') saleId: string,
  ) {
    return this._SaleService.addLikedUser(userId, saleId);
  }

  @Patch('/unliked')
  async removeLikedUser(
    @Query('userId') userId: string,
    @Query('saleId') saleId: string,
  ) {
    return this._SaleService.removeLikedUser(userId, saleId);
  }

  @Delete('/delete')
  async deleteSale(@Query('saleId') saleId: string) {
    return this._SaleService.deleteSale(saleId);
  }
}
