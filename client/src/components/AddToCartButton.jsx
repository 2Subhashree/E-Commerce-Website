import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import Axios from '../utils/Axios';
import AllApi from '../common/commonApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from "../components/Loading"
import { useSelector } from 'react-redux';
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data, selectedVariant, inCartItem}) => {
  const [loading, setLoading] = useState(false);
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
  const cartItem = useSelector(state => state.cartItem.cart || []);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemDetails] = useState(null);

  // --- Select first size and color by default ---
  // const [selectedSize, setSelectedSize] = useState(null);
  // const [selectedColor, setSelectedColor] = useState(null);
  const selectedSize = selectedVariant?.unit || null
  const selectedColor = selectedVariant?.color || null

  // select first size and color bydefault
  // useEffect(() => {
  //   if (!data || !data.variants) return;
  //   const firstSize = Object.keys(data.variants)[0];
  //   const firstColor = firstSize ? Object.keys(data.variants[firstSize].colors)[0] : null;
  //   setSelectedSize(firstSize);
  //   setSelectedColor(firstColor);
  // }, [data]);




  // --- Add to cart ---
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize || !selectedColor) {
      toast.error("No size or color available");
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...AllApi.addToCart,
        data: {
          productId: data._id,
          size: selectedSize,
          color: selectedColor,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

    // --- Check if this item is in cart ---
  useEffect(() => {
    if (inCartItem) {
      setIsAvailableCart(true);
      setQty(inCartItem.quantity);   // set correct saved qty
      setCartItemDetails(inCartItem);
    } else {
      // fallback → check redux cart
      const productInCart = cartItem.find(
        item =>
          item.product._id === data._id &&
          item.variant.size === selectedSize &&
          item.variant.color === selectedColor
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
    }
  }, [cartItem, inCartItem, data, selectedSize, selectedColor]);

  

  // --- Increase / decrease qty ---
  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cartItemDetails) return;
    const response = await updateCartItem(cartItemDetails._id, qty + 1);
    if (response.success) toast.success("Item quantity increased");
  };

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cartItemDetails) return;
    const newQty = qty - 1;
    if (newQty <= 0) {
      await deleteCartItem(cartItemDetails._id);
      toast.success("Item removed from cart");
    } else {
      const response = await updateCartItem(cartItemDetails._id, newQty);
      if (response.success) toast.success("Item quantity decreased");
    }
  };

  return (
    <div className="w-full max-w-[150px]">
      {isAvailableCart ? (
        <div className="flex w-full h-full">
          <button
            onClick={decreaseQty}
            className="bg-green-600 hover:bg-green-700 text-white p-1 rounded flex-1 flex items-center justify-center"
          >
            <FaMinus />
          </button>
          <p className="flex-1 font-semibold px-1 flex items-center justify-center">{qty}</p>
          <button
            onClick={increaseQty}
            className="bg-green-600 hover:bg-green-700 text-white p-1 rounded flex-1 flex items-center justify-center"
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
