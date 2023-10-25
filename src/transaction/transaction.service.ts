import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { UpdatePointDto } from './dto/update-points.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private _transactionModel: Model<TransactionDocument>,
  ) {}

  async createTransactionRecord(updatePointDto: UpdatePointDto) {
    return await this._transactionModel.create(updatePointDto);
  }

  async getUserTransactions(uuid: string): Promise<Transaction[]> {
    return this._transactionModel.find({ uuid });
  }
}
