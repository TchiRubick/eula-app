export const priceFormat = (v) => {
  if (Number.isNaN(v)) {
    return '0';
  }

  return new Intl.NumberFormat().format(v);
};

export default priceFormat;
