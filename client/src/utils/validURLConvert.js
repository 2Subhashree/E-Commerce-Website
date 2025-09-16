export const validURLConvert = (name) => {
  if (!name || typeof name.toString !== "function") return "invalid-url";
  const url = name.toString().replaceAll(" ","").replaceAll(",","").replaceAll("&","")
  return url
}


