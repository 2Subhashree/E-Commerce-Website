export const DisplayPriceInRupees = (price)=>{
  return new Intl.NumberFormat('en-IN',{
    style : 'currency',
    currency : 'INR'
  }).format(price)
}
// export const DisplayPriceInRupees = (price = 0) => {
//   const p = Number(price) || 0;
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR'
//   }).format(p);
// };
