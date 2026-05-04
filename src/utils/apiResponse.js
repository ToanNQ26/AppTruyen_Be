// dtos/apiResponse.dto.js
export class ApiResponse {
  constructor({ code = 1000, message = 'Sucessfully', result = null } = {}) {
    this.code = code;
    this.message = message;
    this.result = result;
  }
}
