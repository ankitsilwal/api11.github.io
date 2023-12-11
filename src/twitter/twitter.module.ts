import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Postt, PostSchema } from "./schema/post.schema";
import { TwitterController } from "./twitter.controller";
import { TwitterService } from "./twitter.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Postt.name, schema: PostSchema }]),
  ],
  controllers: [TwitterController],
  providers: [TwitterService, AuthGuard,JwtService],
})
export class TwitterModule {}
