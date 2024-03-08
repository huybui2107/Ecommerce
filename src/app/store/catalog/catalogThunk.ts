import { createAsyncThunk } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../Interfaces/IProduct";
import agent from "../../api/agent";
import { RootState } from "@reduxjs/toolkit/query";
import { setMetaData } from "./catalogSlice";

function getAxiosParams(productParams: ProductParams) {
  const params = new URLSearchParams();
  params.append("orderBy", productParams.orderBy);
  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());

  if (productParams.searchTerm)
    params.append("searchTerm", productParams.searchTerm.toString());
  if (productParams.brands)
    params.append("brands", productParams.brands.toString());
  if (productParams.types)
    params.append("types", productParams.types.toString());

  return params;
}

export const fetchProductsAsync = createAsyncThunk<
  Product[],
  void,
  { state: RootState }
>("catalog/fetchProductsAsync", async (_, thunkAPI) => {
  try {
    console.log(thunkAPI.getState().catalog.productParams);
    const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
    const res = await agent.Catalog.list(params);
    thunkAPI.dispatch(setMetaData(res.metaData));
    console.log("huy", res.metaData);
    return res.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchProductAsync = createAsyncThunk<Product, number>(
  "catalog/fetchProductAsync",
  async (productId, thunkAPI) => {
    try {
      return await agent.Catalog.detail(productId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchFilter = createAsyncThunk(
  "catalog/fetchFilter",
  async (_, thunkAPI) => {
    try {
      return await agent.Catalog.filter();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
