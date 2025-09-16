import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import AllApi from "../common/commonApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";

export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cartItem.cart || []);
  const user = useSelector((state) => state.user);

  const [totalPrice, setTotalPrice] = useState(0);
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);

  // Fetch cart items
  const fetchCartItem = async () => {
    try {
      const response = await Axios({ ...AllApi.getCartItem });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (id, qty) => {
    try {
      const response = await Axios({
        ...AllApi.updateCartItemQty,
        data: { _id: id, qty },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        fetchCartItem();
        return responseData;
      }
    } catch (error) {
      AxiosToastError(error);
      return { success: false, message: error.message };
    }
  };

  // Delete cart item
  const deleteCartItem = async (id) => {
    try {
      const response = await Axios({
        ...AllApi.deleteCartItem,
        data: { _id: id },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Calculate total quantity and prices
  useEffect(() => {
    if (!cartItem || cartItem.length === 0) {
      setTotalQty(0);
      setTotalPrice(0);
      setNotDiscountTotalPrice(0);
      return;
    }

    let qtyTotal = 0;
    let priceTotal = 0;
    let originalPriceTotal = 0;

    cartItem.forEach((item) => {
      const variant = item.variant || {};
      const qty = Number(item.quantity ?? 1);
      const price = Number(variant.price ?? 0);
      const discount = Number(variant.discount ?? 0);

      qtyTotal += qty;
      priceTotal += priceWithDiscount(price, discount) * qty;
      originalPriceTotal += price * qty;
    });

    setTotalQty(qtyTotal);
    setTotalPrice(priceTotal);
    setNotDiscountTotalPrice(originalPriceTotal);
  }, [cartItem]);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    dispatch(handleAddItemCart([]));
  };

  // Fetch addresses
  const fetchAddress = async () => {
    try {
      const response = await Axios({ ...AllApi.getAddress });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Fetch cart & address when user logs in
  useEffect(() => {
    if (user && user._id) {
      fetchCartItem();
      fetchAddress();
    }
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItem,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        totalPrice,
        totalQty,
        notDiscountTotalPrice,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
