export class Order {
  key?: string;
  date?: Date;
  amount?: number;
  charge?: any;
  details?: {
    decoration?: boolean;
    event?: string;
    form?: string;
    gluten?: boolean;
    lactose?: boolean;
    perfum?: string;
    quatity?: number;
  };
  message?: {
    row1?: string;
    row2?: string;
    row3?: string;
  };
  token?: {
    card?: any;
    email?: string;
  };
}
