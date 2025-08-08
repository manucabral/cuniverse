export class SuccessResponseDto<T = any> {
  success: boolean;
  status: number;
  message: string;
  data?: T;

  constructor(status: number, message: string, data?: T) {
    this.success = true;
    this.status = status;
    this.message = message;
    if (data) this.data = data;
  }
}
