import { Request, Response } from 'express';
import {resolveObjectURL} from "node:buffer";

interface Currency {
    currency: string;
    price_pln: string;
    date: string;
}

// Global array to store currency rates
let currencyRates: Currency[] = [];

// Function to handle currency exchange
export const currencyExchange = (req: Request, res: Response) => {
    // Extract data from request body
    const { from_currency, to_currency, amount, date } = req.body;

    // Check if all required fields are present
    if (!from_currency) {
        return res.status(400).json({ error: 'Missing required field: from_currency' });
    }
    if (!to_currency) {
        return res.status(400).json({ error: 'Missing required field: to_currency' });
    }
    if (!amount) {
        return res.status(400).json({ error: 'Missing required field: amount' });
    }
    if (!date) {
        return res.status(400).json({ error: 'Missing required field: date' });
    }

    // Find the exchange rate for the from_currency to PLN on the given date
    const fromCurrencyRate = currencyRates.find(rate => rate.currency === from_currency && rate.date === date);

    if (!fromCurrencyRate) {
        return res.status(404).json({ error: 'Exchange rate not found for the given date and currency' });
    }

    // Convert the amount from the from_currency to PLN
    const amountInPLN = amount * parseFloat(fromCurrencyRate.price_pln);

    let reuslt = 0.0
    if (to_currency !== 'PLN') {
        // Find the exchange rate for the to_currency to PLN on the given date
        const toCurrencyRate = currencyRates.find(rate => rate.currency === to_currency && rate.date === date);

        if (!toCurrencyRate) {
            return res.status(404).json({ error: 'Exchange rate not found for the given date and currency' });
        }

        // Convert the amount from PLN to the to_currency
        reuslt = amountInPLN / parseFloat(toCurrencyRate.price_pln);
        // Send response
    } else {
        reuslt = amountInPLN
    }
    // Send response
    res.json({
        currency: to_currency,
        value: reuslt,
        date: date
    });

};// Function to handle adding new currency rates

export const addCurrency = (req: Request, res: Response) => {
    // Extract data from request body
    const { currencies } = req.body;


    // Add new currency rates to the global array
    currencies.forEach((currency: Currency) => {
        // Check if the currency already exists in the array
        const existingCurrency = currencyRates.find(rate =>
            rate.currency === currency.currency &&
            rate.price_pln === currency.price_pln &&
            rate.date === currency.date
        );

        // If the currency does not exist, add it to the array
        if (!existingCurrency) {
            currencyRates.push({
                currency: currency.currency,
                price_pln: currency.price_pln,
                date: currency.date
            });
        }
    });

    // Send response
    res.status(201).json({
        message: 'Currency rates added successfully'
    });
};

// Function to handle getting all currency rates
export const getCurrency = (req: Request, res: Response) => {
    // Send response with all currency rates
    res.json({
        currencies: currencyRates
    });
};