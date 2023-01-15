const SSLCommerz = require("ssl-commerz-node");
const PaymentSession = SSLCommerz.PaymentSession;
const shortid = require("short-id");
require("dotenv").config();

const payment = new PaymentSession(
  true,
  process.env.STORE_ID,
  process.env.STORE_PASSWORD
);

exports.SSLCommerz_payment_init = async (req, res) => {
  console.log("hellop");

  const { totalAmount, numItem } = req.body;

  const transactionId = `transaction_${shortid.generate()}`;
  // let paymentDone = false;

  if (totalAmount) {
    return res.json({ message: "All filled must be required" });
  } else {
    try {
      payment.setUrls({
        // success: "yoursite.com/success", // If payment Succeed
        success: `${process.env.SERVER_URL}/api/payment/checkout/success?transactionId=${transactionId}`, // If payment Succeed
        fail: `${process.env.SERVER_URL}/api/payment/checkout/fail`, // If payment failed
        cancel: `${process.env.SERVER_URL}/api/payment/checkout/cancel`, // If user cancel payment
        ipn: `${process.env.SERVER_URL}/ipn`, // SSLCommerz will send http post request in this link
      });
      // Set order details
      payment.setOrderInfo({
        total_amount: 20, // Number field
        currency: "BDT", // Must be three character string
        tran_id: transactionId, // Unique Transaction id
        emi_option: 0, // 1 or 0
        multi_card_name: "internetbank", // Do not Use! If you do not customize the gateway list,
        allowed_bin: "371598,371599,376947,376948,376949", // Do not Use! If you do not control on transaction
        emi_max_inst_option: 3, // Max instalment Option
        emi_allow_only: 0, // Value is 1/0, if value is 1 then only EMI transaction is possible
      });

      payment.setCusInfo({
        name: "cusName",
        email: "cusEmail",
        add1: "cusAdd1",
        add2: "cusAdd2",
        city: "cusCity",
        state: "cusState",
        postcode: "cusPostcode",
        country: "cusCountry",
        phone: "cusPhone",
        fax: "cusFax",
      });

      // Set shipping info
      payment.setShippingInfo({
        method: "deliveryMethod",
        num_item: "numItem",
        name: "name",
        add1: "shippingAdd1",
        add2: "shippingAdd2",
        city: "shippingCity",
        state: "shippingState",
        postcode: "shippingPostcode",
        country: "shippingCountry",
      });

      // Set Product Profile
      payment.setProductInfo({
        product_name: "udoy",
        product_category: "Electronics",
        product_profile: "general",
      });

      // Initiate Payment and Get session key
      payment.paymentInit().then(async (response) => {
        console.log(response["GatewayPageURL"]);
        res.send(response["GatewayPageURL"]);
        return res.redirect(response["GatewayPageURL"]);
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
};

exports.SSLCommerz_payment_success = async (req, res) => {
  const { transactionId } = req.query;
  res.redirect(`${process.env.CLIENT_URL}/success`);
  return res.redirect(`${process.env.CLIENT_URL}/success`);
};

exports.SSLCommerz_payment_fail = (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/checkout/fail`);
  return res.redirect(`${process.env.CLIENT_URL}/checkout/fail`);
};

exports.SSLCommerz_payment_cancel = (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/checkout/cancel`);
  return res.redirect(`${process.env.CLIENT_URL}/checkout/cancel`);
};

// -------------------------------- After Success

// console.log(response["sessionkey"]);
// D37CD2C0A0D322991531D217E194F981;

// console.log(response["GatewayPageURL"]);
// //sandbox.sslcommerz.com/EasyCheckOut/testcded37cd2c0a0d322991531d217e194f981

// // -------------------------------- After Failure (Wrong Store ID)

// // console.log(response['status']);
// https: FAILED;

// // console.log(response['failedreason']);
// // Store Credential Error Or Store is De-active
