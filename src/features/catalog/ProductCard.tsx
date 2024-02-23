import {  Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia,  Typography } from "@mui/material";
import { Product } from "../../app/Interfaces/IProduct";


interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Card sx={{ width: 200  }} key={product.id}>
      <CardHeader 
      
      avatar={
        <Avatar sx={{backgroundColor :'secondary.main'}}>
           {product.name.charAt(0).toUpperCase()}
        </Avatar>
      
      }

      title={product.name}
      titleTypographyProps={{
        sx: {fontWeight: 'bold'}
      }}
      />
          
      
      <CardMedia
        sx={{ height: 140 }}
        image="https://robohash.org/stefan-one"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" color='secondary'>
          ${(product.price /100).toFixed(2)}
        </Typography>
        <Typography variant="body2" color='text.secondary'>
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions >
            <Button size="small">Add to cart</Button>
            <Button  href={`/catalog/${product.id}`}>View</Button>
      </CardActions>
      
    </Card>
  );
}
