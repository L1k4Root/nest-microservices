import { IsEnum, IsOptional } from "class-validator";
import { PaginationDTO } from "src/common";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class OrderPaginationDTO extends PaginationDTO {
  @IsOptional()
  @IsEnum( OrderStatusList, {
    message: `Status must be one of the following values: ${OrderStatusList.join(', ')}`
  })
  status: OrderStatus;  
}
