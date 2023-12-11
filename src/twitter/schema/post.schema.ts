import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Postt {
  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  comment: string;
}

export const PostSchema = SchemaFactory.createForClass(Postt);
