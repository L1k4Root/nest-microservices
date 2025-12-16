import { IsEnum } from "class-validator";
import { OrderStatusList } from "../enum/order.enum";



export class ChangeOrderStatusDto {
  @IsEnum( OrderStatusList, {
    message: `Status must be one of the following values: ${OrderStatusList.join(', ')}`
  } )
  status: string;
}