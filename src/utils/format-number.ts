export const intlUSD = new Intl.NumberFormat("en-US", {
  style: "decimal",
  currency: "USD",
});

export const decimalUSD = new Intl.NumberFormat("en-US", {
  style: "decimal",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

export const decimalUSD3Number = new Intl.NumberFormat("en-US", {
  style: "decimal",
  currency: "USD",
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

export const decimalUSD2Number = new Intl.NumberFormat("en-US", {
  style: "decimal",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatNumber = (value: any) =>
  `${value}`.replace(/\B(?<!\.\d)(?=(\d{3})+(?!\d))/g, ",");
