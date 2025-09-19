import React from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import imageEmpty from "../assets/empty_cart.webp";
import toast from "react-hot-toast";

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const redirectToCheckOutPage = () => {
    if (user?._id) {
      navigate("/checkout");
      if (close) close();
      return;
    }
    toast.error("Please login to continue");
  };

  return (
    <section className="bg-neutral-900/70 fixed top-0 bottom-0 right-0 left-0 z-50">
      <div className="bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center p-4 shadow-md gap-3 justify-between">
          <h2 className="font-semibold">Cart</h2>
          <button onClick={close}>
            <IoClose size={25} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 h-full bg-blue-50 p-2 flex flex-col gap-4 overflow-hidden">
          {cartItem.length > 0 ? (
            <>
              {/* Savings info */}
              <div className="flex items-center px-4 py-2 bg-blue-100 text-blue-500 rounded-full justify-between">
                <p>Your total savings</p>
                <p>
                  {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}
                </p>
              </div>

              {/* Cart Items */}
              <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto flex-1">
                {cartItem.map((item) => {
                  const product = item?.product || {};
                  const variant = item?.variant || {};

                  const discountedPrice = priceWithDiscount(
                    variant?.price || 0,
                    variant?.discount || 0
                  );

                  return (
                    <div
                      key={item?._id}
                      className="flex w-full gap-4 border-b pb-3"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 min-h-16 min-w-16 border rounded bg-white flex items-center justify-center">
                        <img
                          src={product?.image || ""}
                          alt={product?.name || "product"}
                          className="object-scale-down max-w-full max-h-full"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 text-xs">
                        <p className="text-xs line-clamp-2 font-medium">
                          {product?.name}
                        </p>

                        {/* Size & Color */}
                        <p className="text-neutral-400">
                          {variant?.size ? `Size: ${variant.size}` : ""}
                          {variant?.color ? ` | Color: ${variant.color}` : ""}
                        </p>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {DisplayPriceInRupees(discountedPrice)}
                          </span>
                          {variant?.discount > 0 && (
                            <span className="line-through text-neutral-400 text-xs">
                              {DisplayPriceInRupees(variant.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div>
                        <AddToCartButton
                          data={item?.product}
                          selectedVariant={item?.variant}   // ✅ pass the exact size & color
                          inCartItem={item}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bill Details */}
              <div className="bg-white p-4">
                <h3 className="font-semibold">Bill details</h3>

                <div className="flex justify-between text-sm mt-2">
                  <p>Total Items</p>
                  <p>{totalQty} item(s)</p>
                </div>

                <div className="flex justify-between text-sm">
                  <p>Subtotal</p>
                  <p>
                    <span className="line-through text-neutral-400 mr-2">
                      {DisplayPriceInRupees(notDiscountTotalPrice)}
                    </span>
                    <span>{DisplayPriceInRupees(totalPrice)}</span>
                  </p>
                </div>

                <div className="flex justify-between text-sm">
                  <p>Delivery Charge</p>
                  <p className="text-green-600">Free</p>
                </div>

                <div className="font-semibold flex justify-between mt-2">
                  <p>Grand Total</p>
                  <p>{DisplayPriceInRupees(totalPrice)}</p>
                </div>
              </div>
            </>
          ) : (
            /* Empty Cart */
            <div className="bg-white flex-1 flex flex-col justify-center items-center">
              <img
                src={imageEmpty}
                className="w-48 h-48 object-contain"
                alt="empty cart"
              />
              <Link
                onClick={close}
                to={"/"}
                className="mt-4 bg-green-600 px-4 py-2 text-white rounded"
              >
                Shop now
              </Link>
            </div>
          )}
        </div>

        {/* Checkout Footer */}
        {cartItem.length > 0 && (
          <div className="p-2">
            <div className="bg-green-700 text-neutral-100 px-4 font-bold text-base py-4 rounded flex items-center gap-4 justify-between">
              <div>{DisplayPriceInRupees(totalPrice)}</div>
              <button
                onClick={redirectToCheckOutPage}
                className="flex items-center gap-1 cursor-pointer"
              >
                Proceed
                <span>
                  <FaCaretRight />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DisplayCartItem;
