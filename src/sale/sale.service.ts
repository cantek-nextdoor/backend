import { CreateSaleDto } from './dto/create-sale.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Sale, SaleDocument } from './schemas/sale.schema';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SaleService {
  constructor(
    @InjectModel(Sale.name) private _saleModel: Model<SaleDocument>,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const saleId = uuid();
    const createdSale = await this._saleModel.create<Sale>({
      ...createSaleDto,
      saleId,
    });
    return createdSale;
  }

  async findSalesByUserId(userID: string) {
    try {
      const sales = await this._saleModel.find({ userId: userID });
      return sales;
    } catch (error) {
      console.log(error);
    }
  }

  async findSalesBySaleId(saleId: string) {
    try {
      const sales = await this._saleModel.find({ saleId: saleId });
      return sales;
    } catch (error) {
      console.log(error);
    }
  }

  async findSalesByTag(tagForSerch: string) {
    try {
      const sales = await this._saleModel.find({ tag: tagForSerch });
      return sales;
    } catch (error) {
      console.log(error);
    }
  }

  async updateSale(saleId: string, updateSaleDto: UpdateSaleDto) {
    try {
      const updateResult = await this._saleModel.updateOne(
        { saleId: saleId },
        updateSaleDto,
      );
      return updateResult;
    } catch (error) {
      console.log(error);
    }
  }

  async addLikedUser(userId: string, saleId: string) {
    try {
      const sale = await this._saleModel
        .findOne({ saleId: saleId })
        .select('likedUserList')
        .exec();

      if (sale) {
        const likedUsers = sale.likedUserList;
        likedUsers.push(userId);
        const updateResult = await this._saleModel.updateOne(
          { saleId: saleId },
          { likedUserList: likedUsers },
        );
        return updateResult;
      } else {
        console.log('Sale not found.');
        return null; // or handle the case where the sale is not found
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removeLikedUser(userId: string, saleId: string) {
    try {
      const sale = await this._saleModel
        .findOne({ saleId: saleId })
        .select('likedUserList')
        .exec();

      if (sale) {
        const likedUsers = sale.likedUserList;
        if (likedUsers.includes(userId)) {
          const updatedList = likedUsers.filter(
            (element) => element !== userId,
          );
          const updateResult = await this._saleModel.updateOne(
            { saleId: saleId },
            { likedUserList: updatedList },
          );
          return updateResult;
        } else {
          console.log('user not found.');
        }
      } else {
        console.log('Sale not found.');
      }
      return null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteSale(saleId: string) {
    try {
      const deleteResult = await this._saleModel.deleteOne({ saleId: saleId });
      return deleteResult;
    } catch (error) {
      console.log(error);
    }
  }
}
