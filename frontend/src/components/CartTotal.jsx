import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subTotalFun } from "../slices/cartSlice";
import Title from "./Title";

const CartTotal = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const currency = "₹";

  const calculateSubTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return total + price * quantity;
    }, 0);
  };

  const calculateShipping = () => {
    return cartItems.reduce((total, item) => {
      const delivery = parseFloat(item.deliveryCharge) || 0;
      return total + delivery;
    }, 0);
  };

  const subTotal = calculateSubTotal();
  const shippingFee = calculateShipping();
  const totalAmount = subTotal === 0 ? 0 : subTotal + shippingFee;

  useEffect(() => {
    dispatch(subTotalFun(subTotal));
  }, [subTotal, dispatch]);

  return (
    <div className="w-full bg-white border p-4 rounded-xl shadow-md">
      <div className="text-2xl mb-5">
        <Title text1="CART" text2="TOTAL" />
      </div>
      <div className="flex flex-col gap-4 text-sm sm:text-base">
        <div className="flex justify-between items-center">
          <span className="font-medium">Sub Total</span>
          <span>
            {currency}
            {subTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <hr />

        <div className="flex justify-between items-center">
          <span className="font-medium">Shipping Fee</span>
          <span>
            {currency}
            {shippingFee.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <hr />

        <div className="flex justify-between items-center font-semibold text-lg">
          <span>Total Amount</span>
          <span>
            {currency}
            {totalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
