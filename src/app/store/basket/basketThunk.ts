import { createAsyncThunk } from "@reduxjs/toolkit";
import { Basket } from "../../Interfaces/IBasket";
import agent from "../../api/agent";

export const addBasketItemAsync = createAsyncThunk<
  Basket,
  { productId: number; quantity?: number }
>("basket/addBasketItemAsync", async ({ productId, quantity = 1 }) => {
  try {
    return await agent.Basket.addItem(productId, quantity);
  } catch (error) {
    console.log(error);
  }
});

export const removeBasketItemAsync = createAsyncThunk<
  void,
  { productId: number; quantity: number; name?: string }
>("basket/removeBasketItemAsync", async ({ productId, quantity }) => {
  try {
    await agent.Basket.removeItem(productId, quantity);
  } catch (error) {
    console.log(error);
  }
});
