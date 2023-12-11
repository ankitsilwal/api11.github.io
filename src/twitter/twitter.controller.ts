import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { TwitterService } from "./twitter.service";
import { PostDto } from "./dto/post.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";
import mongoose from "mongoose";

@UseGuards(AuthGuard)
@Controller("twitter")
export class TwitterController {
  constructor(private twitterservice: TwitterService) {}

  @Post("post")
  async create(@Body() postdto: PostDto) {
    try {
      return await this.twitterservice.create(postdto);
    } catch (error) {
      throw new HttpException(error.message, error.statuscode ?? 400);
    }
  }

  @Get()
  async get() {
    return await this.twitterservice.get();
  }

  @Get(":id")
  async getbyid(@Param("id") id: mongoose.Types.ObjectId) {
    try {
      return await this.twitterservice.getbyid(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(":id")
  async updatebyid(
    @Param("id") id: mongoose.Types.ObjectId,
    @Body() dto: PostDto
  ) {
    try {
      return await this.twitterservice.updatebyid(id,dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(":id")
  async deletebyid(@Param("id") id: mongoose.Types.ObjectId) {
    try {
      const deleted = await this.twitterservice.deletebyid(id);
      return { message: "Post Deleted" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
