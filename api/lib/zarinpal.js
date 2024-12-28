import ZarinpalCheckout from "zarinpal-checkout";
import dotenv from "dotenv";

dotenv.config();

export const zarinpal = ZarinpalCheckout.create(
  process.env.ZARINPAL_SECRET_MERCHANTID,
  true,
  "IRR"
);
