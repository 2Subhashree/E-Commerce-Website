// export const priceWithDiscount = (price,dis = 1)=> {
//   const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100)
//   const actualPrice = Number(price) -Number(discountAmount)
//   return actualPrice
// }

export const priceWithDiscount = (price = 0, dis = 0) => {
  const p = Number(price) || 0;
  const d = Number(dis) || 0;

  const discountAmount = Math.ceil((p * d) / 100);
  const actualPrice = p - discountAmount;

  return actualPrice;
};
