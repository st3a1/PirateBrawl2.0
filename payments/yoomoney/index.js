const axios = require("axios");
const qs = require("qs");

class YooMoney {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  async sendAuthenticatedRequest({ method = "POST", url, data = {}, params = {} }) {
    try {
      const response = await axios({
        method,
        url: `https://yoomoney.ru${url}`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        },
        data: qs.stringify(data),
        params
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        };
      } else if (error.request) {
        throw error.request;
      }

      throw error.message;
    }
  }

  async getAccountInfo() {
    return this.sendAuthenticatedRequest({ url: "/api/account-info" });
  }

  async getOperationInfo(data) {
    return this.sendAuthenticatedRequest({ url: "/api/operation-history", data });
  }

  async getOperationDetails(operation_id) {
    return this.sendAuthenticatedRequest({ url: "/api/operation-details", data: { operation_id } });
  }

  async requestPayment(data) {
    return this.sendAuthenticatedRequest({ url: "/api/request-payment", data });
  }

  async processPayment(data) {
    return this.sendAuthenticatedRequest({ url: "/api/process-payment", data });
  }

  async searchShowcase(data) {
    return this.sendAuthenticatedRequest({ url: "/api/showcase-search", data });
  }

  async getShowcase(pattern_id) {
    return this.sendAuthenticatedRequest({ url: `/api/showcase/${pattern_id}` });
  }
}

module.exports = YooMoney;