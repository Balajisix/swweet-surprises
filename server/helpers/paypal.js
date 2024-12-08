const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "ASdQGlHAb3nrHOhJi59772cDBB6KH50VdVpkMXSeyMpDhzQgF_s-Y1MKLeLWqKfBA-aXtcBTXZWwQpWt",
  client_secret: "EIZmnYJ8UnrvatzGq10_QsuE5jnB1dyD_mpP5XousUq0w9QjEpkUDU2CXBn6HCI3gKj2NG4iZaJ_Ofsp",
});

module.exports = paypal;
