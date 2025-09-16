import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import Axios from "../utils/Axios";
import AllApi from "../common/commonApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const { fetchCartItem, updateCartItem } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);

  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemDetails] = useState(null);

  // ✅ Add to Cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!data?.selectedColor || !data?.selectedSize) {
        toast.error("Please select color & size");
        return;
      }

      setLoading(true);

      const response = await Axios({
        ...AllApi.addToCart,
        data: {
          productId: data._id,
          colorId: data.selectedColor._id,
          sizeId: data.selectedSize._id,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ check if this product + color + size is in cart
  useEffect(() => {
    if (!data?._id || !data?.selectedColor?._id || !data?.selectedSize?._id)
      return;

    const productInCart = cartItem.find(
      (item) =>
        item.productId._id === data._id &&
        item.selectedColor._id === data.selectedColor._id &&
        item.selectedSize._id === data.selectedSize._id
    );

    if (productInCart) {
      setIsAvailableCart(true);
      setQty(productInCart.quantity);
      setCartItemDetails(productInCart);
    } else {
      setIsAvailableCart(false);
      setQty(0);
      setCartItemDetails(null);
    }
  }, [data, cartItem]);

  // ✅ Increase quantity
  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const response = await updateCartItem(cartItemDetails?._id, qty + 1);

    if (response.success) {
      toast.success("Item added");
      fetchCartItem();
    }
  };

  // ✅ Decrease quantity
  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newQty = qty - 1;
    const response = await updateCartItem(cartItemDetails?._id, newQty);

    if (response.success) {
      if (newQty <= 0) {
        toast.success("Item removed");
      } else {
        toast.success("Item updated");
      }
      fetchCartItem();
    }
  };

  return (
    <div className="w-full max-w-[150px]">
      {isAvailableCart ? (
        <div className="flex w-full h-full">
          <button
            onClick={decreaseQty}
            className="bg-green-600 hover:bg-green-700 text-white p-1 rounded flex-1 w-full flex items-center justify-center"
          >
            <FaMinus />
          </button>
          <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">
            {qty}
          </p>
          <button
            onClick={increaseQty}
            className="bg-green-600 hover:bg-green-700 text-white p-1 rounded flex-1 w-full flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded"
        >
          {loading ? <Loading /> : "Add"}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
