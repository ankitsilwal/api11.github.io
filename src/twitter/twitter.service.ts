import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Postt } from "./schema/post.schema";
import mongoose, { Model } from "mongoose";
import { PostDto } from "./dto/post.dto";

@Injectable()
export class TwitterService {
  constructor(@InjectModel(Postt.name) private twittermodel: Model<Postt>) {}

  async create(postdto: PostDto) {
    const postcreation = await this.twittermodel.create(postdto);
    if (!postcreation) {
      throw new BadRequestException(`Invalid Details`);
    }
    return postcreation;
  }

  async get(): Promise<Postt[]> {
    return await this.twittermodel.find();
  }

  async getbyid(id: mongoose.Types.ObjectId) {
    const getbyid = await this.twittermodel.findById(id);
    if (!getbyid) {
      throw new NotFoundException(`Post not Found`);
    }
    return getbyid;
  }

  async updatebyid(id: mongoose.Types.ObjectId, updatedto: PostDto) {
    const update = await this.twittermodel.findByIdAndUpdate(id, updatedto, {
      new: true,
    });
    if (!update) {
      throw new BadRequestException(`Please enter valid Details`);
    }
    return update;
  }

  async deletebyid(id: mongoose.Types.ObjectId) {
    const deleted = await this.twittermodel.findByIdAndDelete(id);
    if (!deleted) {
      throw new BadRequestException(`Please enter valid details`);
    }
    return deleted;
  }
}
