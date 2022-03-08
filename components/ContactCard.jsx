import React from 'react';
import Image from 'next/image'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const ContactCard = () => {
  return (
    <div className='flex justify-center w-full py-6'>
        <Card sx={{ maxWidth: 345 }} className='bg-white bg-opacity-10 rounded-2xl text-white shadow-5xl relative z-2 border border-opacity-30 border-r-0 border-b-0 backdrop-filter backdrop-blur-sm'>
        <Image
            height={500}
            width={500}
            src="/lineesh.jpg"
            alt="Picture of the author"
        />
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Lineesh.NM
            </Typography>
            <Typography variant="body1">
              Try login or This feature not available. 
            </Typography>
            <Typography variant="body2">
              Contact Administrator:
              lineesh.niduvappurathmeethal@barclays.com
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" className='bg-blue-600 hover:bg-blue-300 text-white hover:text-black'>Contact</Button>
            <Button size="small" className='bg-blue-600 hover:bg-blue-300 text-white hover:text-black'>Email</Button>
        </CardActions>
        </Card>
    </div>
  )
};

export default ContactCard;
