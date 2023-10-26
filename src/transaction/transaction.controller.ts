import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  Response,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { ExchangeDetailsDto } from './dto/exchange-details.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionService } from './transaction.service';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { createJsonResponse } from '../utils';
import mongoose from 'mongoose';

@Controller('transaction')
export class TransactionController {
  constructor(
    private _userService: UserService,
    private _transactionService: TransactionService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  @UseGuards(JwtGuard)
  @Get(':uuid')
  async getTransactions(
    @Param('uuid') uuid: string,
    @Request() req,
    @Response() res,
  ) {
    if (req.user.uuid !== uuid) {
      throw new ForbiddenException('User uuid not match!');
    }

    const userTransactions = await this._transactionService.getUserTransactions(
      uuid,
    );

    createJsonResponse(res, { userTransactions });
  }

  @UseGuards(JwtGuard)
  @Post('create')
  async createTransaction(@Body() body, @Request() req, @Response() res) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const user = await this._userService.findUserByProps({
        uuid: req.user.uuid,
      });

      // To be fetched from post
      const points = 1;
      const toPoints = user.points + points;

      await this._transactionService.createTransactionRecord({
        userId: req.user.uuid,
        postId: body.postId,
        postPoints: 1,
        fromPoints: user.points,
        toPoints,
      });

      await this._userService.updateUser({ ...user, points: toPoints });
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      console.log('e', e);
    } finally {
      session.endSession();
    }
  }

  @UseGuards(JwtGuard)
  @Post('exchange')
  async createExchange(
    @Body() body: ExchangeDetailsDto,
    @Request() req,
    @Response() res,
  ) {
    const session = await this.connection.startSession();

    if (!body.counterparty) {
      throw new UnprocessableEntityException('Counterparty not specified');
    }

    if (!body.hasOwnProperty('isCurrentUserSender')) {
      throw new UnprocessableEntityException('Missing isCurrentUserSender');
    }

    const user = await this._userService.findUserByProps({
      uuid: req.user.uuid,
    });

    const counterparty = await this._userService.findUserByProps({
      uuid: body.counterparty,
    });

    if (!counterparty) {
      throw new UnprocessableEntityException('Counterparty not found');
    }

    let sender: User;
    let receiver: User;

    if (body.isCurrentUserSender) {
      sender = user;
      receiver = counterparty;
    } else {
      sender = counterparty;
      receiver = user;
    }

    // TODO: To be fetched from post
    const points = 1;

    if (sender.points < points) {
      throw new UnprocessableEntityException(
        'Insufficient balance from sender',
      );
    }

    try {
      session.startTransaction();

      const senderToPoints = sender.points - points;
      const receiverToPoints = receiver.points + points;

      // Sender's logic
      await this._transactionService.createTransactionRecord({
        userId: sender.uuid,
        postId: body.postId,
        postPoints: 1,
        fromPoints: sender.points,
        toPoints: senderToPoints,
      });

      await this._userService.updateUser({ ...sender, points: senderToPoints });

      // Receiver's logic
      await this._transactionService.createTransactionRecord({
        userId: receiver.uuid,
        postId: body.postId,
        postPoints: 1,
        fromPoints: receiver.points,
        toPoints: receiverToPoints,
      });

      await this._userService.updateUser({
        ...receiver,
        points: receiverToPoints,
      });

      await session.commitTransaction();
      createJsonResponse(res, {
        message: `Updated points for ${sender.displayName} and ${receiver.displayName}`,
      });
    } catch (e) {
      await session.abortTransaction();
      throw new BadRequestException('Could not update points');
      console.log('e', e);
    } finally {
      session.endSession();
    }
  }
}
