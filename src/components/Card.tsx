// components/Card.tsx
import { Paper, Typography } from '@mui/material';

interface CardProps {
  title: string;
  image: string;
  onClick?: () => void; // Definimos onClick como una función opcional sin parámetros y sin valor de retorno
}

function Card({ title, image, onClick }: CardProps) {
  return (
    <Paper
      elevation={3}
      style={{
        padding: '20px',
        backgroundColor: '#fbfacc',
        borderRadius: '10px',
        textAlign: 'center',
        cursor: 'pointer', // Añadimos un cursor pointer para indicar que es clickable
      }}
      onClick={onClick} // Usamos onClick aquí para manejar el clic en la tarjeta
    >
      <img src={image} alt={title} style={{ width: '100px', height: '100px' }} />
      <Typography variant="h5" component="div" style={{ marginTop: '10px' }}>
        {title}
      </Typography>
    </Paper>
  );
}

export default Card;
