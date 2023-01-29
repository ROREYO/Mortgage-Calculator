import { priceFormatter, priceFormatterDecimals } from "./formatters.js";

const maxPrice = 100000000;
const minPrice = 375000;

const inputCost = document.querySelector("#input-cost");
const inputDownPayment = document.querySelector("#input-downpayment");
const inputTerm = document.querySelector("#input-term");

const form = document.querySelector("#form");
const totalCost = document.querySelector("#total-cost");
const totalMonthPayment = document.querySelector("#total-month-payment");

const cleavePriceSettings = {
  numeral: true,
  numeralThousandsGroupStyle: "thousand",
  delimiter: " ",
};

const cleaveCost = new Cleave(inputCost, cleavePriceSettings);
const cleaveDownPayment = new Cleave(inputDownPayment, cleavePriceSettings);
const cleaveTerm = new Cleave(inputTerm, cleavePriceSettings);

calcMortgage();

form.addEventListener("input", function () {
  calcMortgage();
});

function calcMortgage() {
  let cost = +cleaveCost.getRawValue();
  if (cost > maxPrice) {
    cost = maxPrice;
  }

  const totalAmout = cost - cleaveDownPayment.getRawValue();
  totalCost.innerText = priceFormatter.format(totalAmout);

  const creditRate = +document.querySelector("input[name='program']:checked").value;
  const monthRate = (creditRate * 100) / 12;

  const years = +cleaveTerm.getRawValue();
  const months = years * 12;

  const monthPayment = (totalAmout * monthRate) / (1 - (1 + monthRate) * (1 - months));

  totalMonthPayment.innerText = priceFormatterDecimals.format(monthPayment);
}

const sliderCost = document.querySelector("#slider-cost");
noUiSlider.create(sliderCost, {
  start: 12000000,
  connect: "lower",
  step: 25000,
  range: {
    min: minPrice,
    "1%": [400000, 100000],
    "50%": [10000000, 1000000],
    max: maxPrice,
  },
});
sliderCost.noUiSlider.on("slide", function () {
  const sliderValue = parseInt(sliderCost.noUiSlider.get(true));
  cleaveCost.setRawValue(sliderValue);
  calcMortgage();
});

const sliderDownpayment = document.querySelector("#slider-downpayment");
noUiSlider.create(sliderDownpayment, {
  start: 6000000,
  connect: "lower",
  step: 100000,
  range: {
    min: 0,
    max: 10000000,
  },
});
sliderDownpayment.noUiSlider.on("slide", function () {
  const sliderValue = parseInt(sliderDownpayment.noUiSlider.get(true));
  cleaveDownPayment.setRawValue(sliderValue);
  calcMortgage();
});

const sliderTerm = document.querySelector("#slider-term");

noUiSlider.create(sliderTerm, {
  start: 12,
  connect: "lower",
  step: 1,
  range: {
    min: 1,
    max: 30,
  },
});
sliderTerm.noUiSlider.on("slide", function () {
  const sliderValue = parseInt(sliderTerm.noUiSlider.get(true));
  cleaveTerm.setRawValue(sliderValue);
  calcMortgage();
});

inputCost.addEventListener("input", function () {
  const value = +cleaveCost.getRawValue();

  sliderCost.noUiSlider.set(value);

  if (value > maxPrice || value < minPrice) {
    inputCost.closest(".param__details").classList.add("param__details--error");
  }

  const percentMin = value * 0.15;
  const percentMax = value * 0.9;

  sliderDownpayment.noUiSlider.updateOptions({
    range: {
      min: percentMin,
      max: percentMax,
    },
  });
});

inputCost.addEventListener("change", function () {
  const value = +cleaveCost.getRawValue();
  if (value > maxPrice || value < minPrice) {
    inputCost.closest(".param__details").classList.remove("param__details--error");
    cleaveCost.setRawValue(maxPrice);
  }
  if (inputCost.closest(".param__details").classList.contains("param__details--error")) {
    inputCost.closest(".param__details").classList.remove("param__details--error");
  }
});
