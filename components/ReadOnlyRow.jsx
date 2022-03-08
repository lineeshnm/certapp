import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const ReadOnlyRow = ({ cert , handleEditClick, handleDeleteConfirm, modified }) => {

    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);

    const handleDeleteClick = (certId) => {
        console.log("delete clicked for ", certId)
        setOpen(true)
    };
    // console.log({modified})
  return (
    <div key={cert._id} >
        <Box sx={{ flexGrow: 1 }}
        >
            <Grid container spacing={2} className='text-white'>
                <Grid item xs={1}>
                    <Typography sx={{ fontSize: 14, color: (modified) ? "red" : "white" }} className='px-2'>
                        {cert.serverName}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography sx={{ fontSize: 14 }} className='px-2'>
                        {cert.thumbPrint}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography sx={{ fontSize: 14 }} className='px-2'>
                        {cert.keyStoreLocation}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography sx={{ fontSize: 14 }} className='px-2'>
                        {cert.commonName}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography sx={{ fontSize: 14 }} className='px-2'>
                        {cert.environment}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography sx={{ fontSize: 14 }} className='px-2'>
                        {cert.itServiceInstance}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography sx={{ fontSize: 14 }} className='px-2'>
                        {cert.sfGroup}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography sx={{ fontSize: 14 }} className='px-2'>
                        {String(cert.validTo)}
                    </Typography>
                </Grid>
                <Grid item xs={1} className='space-x-3'>
                    <Tooltip title="Edit Row" arrow>
                        <EditIcon color="primary" sx={{ fontSize: 32 }} onClick={(event) => handleEditClick(event, cert)} />
                    </Tooltip>
                    <Tooltip title="Delete Row" arrow>
                        <DeleteIcon color="error" sx={{ fontSize: 32 }} onClick={() => handleDeleteClick(cert._id)} />
                    </Tooltip>
                </Grid>
            </Grid>
        </Box>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} className='space-x-3 bg-white bg-opacity-10 rounded-2xl text-white shadow-5xl relative z-2 border border-opacity-30 border-r-0 border-b-0 backdrop-filter backdrop-blur-sm'>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Are you Sure?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                You wanted to delete this thumbprint entry ? {cert.thumbPrint}
            </Typography>
            <Button 
                variant="contained" 
                name="delete" 
                className='bg-red-400 hover:bg-red-600' 
                onClick={() => {
                    handleDeleteConfirm(cert._id)
                    setOpen(false)
                }
            }>Delete</Button>
            <Button variant="contained" name="cancel" className='bg-blue-400 hover:bg-blue-600' onClick={handleClose}>Cencel</Button>
            </Box>
        </Modal>
    </div>
  )
};

export default ReadOnlyRow;
