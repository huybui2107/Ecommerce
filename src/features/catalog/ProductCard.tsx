import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/Interfaces/IProduct";
import { LoadingButton } from "@mui/lab";
import LinesEllipsis from 'react-lines-ellipsis'
import { useAppDispatch, useAppSelector } from "../../app/store/ConfigureStore";
import { addBasketItemAsync } from "../../app/store/basket/basketThunk";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  // const [loading, setLoading] = useState(false);
  const { status } = useAppSelector(state => state.basket)
  const dispatch = useAppDispatch();

  // const handleAddItemToCart = (productId: number) => {
  //   setLoading(true);
  //   agent.Basket.addItem(productId)

  //     .then(basket => dispatch(setBasket(basket)))
  //     .catch(err => console.log(err))
  //     .finally(() => setLoading(false));

  // }
  return (
    <Card sx={{ width: 200 }} key={product.id}>
      <CardHeader

        title={
          <LinesEllipsis
            text={product.name}
            maxLine='2'
            ellipsis='...'
            trimRight
            style={{
              fontSize: 15,
              textAlign: 'center'
            }}
          />
        }

      />


      <CardMedia
        sx={{ height: 140 }}
        image="https://robohash.org/stefan-one"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" color='secondary'>
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <Typography variant="body2" color='text.secondary'>
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions >
        <LoadingButton loading={status.includes('pendingAddItem' + product.id)} size="small" onClick={() => dispatch(addBasketItemAsync({ productId: product.id }))}>Add to cart</LoadingButton>
        <Button href={`/catalog/${product.id}`}>View</Button>
      </CardActions>

    </Card>
  );
}
