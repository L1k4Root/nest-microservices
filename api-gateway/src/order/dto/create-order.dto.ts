import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";
import { OrderStatusList } from "../enum/order.enum";
import { OrderStatus } from "../enum/order.enum";

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  totalPrice: number;
  
  @IsNumber()
  @IsPositive()
  totalItems: number;
  
  @IsEnum(OrderStatusList,{
    message: `Status must be one of the following values: ${OrderStatusList.join(', ')}`
  })
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;
  
  @IsBoolean()
  paid: boolean = false;
}
