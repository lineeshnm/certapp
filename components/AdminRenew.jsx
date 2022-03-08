import Link from 'next/link'
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import React, { useState, useEffect } from 'react'
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Stack from '@mui/material/Stack';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import RateReviewIcon from '@mui/icons-material/RateReview';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import CertificateCard from './CertificateCard';
import Background from './Background';
// import MonthPicker from '@mui/lab/MonthPicker';
const APP_NAME = process.env.APP_NAME
const URL = process.env.URL
const environments = [
  {
    value: 'Select',
    label: 'Select',
  },
  {
    value: 'PROD',
    label: 'PROD',
  },
  {
    value: 'DR',
    label: 'DR',
  },
  {
    value: 'UAT',
    label: 'UAT',
  },
  {
    value: 'DEV',
    label: 'DEV',
  },
  {
    value: 'LAB',
    label: 'LAB',
  },
  {
    value: 'Unknown',
    label: 'Unknown',
  },
];

export default function AdminRenew({certs, pageName}) {
  // console.log({certs})
  const [serverSearch, setServerSearch] = useState('');
  const [keyStoreLocation, setKeyStoreLocation] = useState('');
  const [cnSearch, setCnSearch] = useState('')
  const [itsiSearch, setItsiSearch] = useState('')
  const [thumbPrint, setThumbPrint] = useState('');
  const [resourceSearch, setResourceSearch] = useState('');
  const [environment, setEnvironment] = useState('Select')
  const [certList, setCertList] = useState(certs)
  const [date, setDate] = useState()
  const [view, setView] = useState(false);
  const [viewCert, setViewCert] = useState({_id: null});

  const handleView = (cert) => {
    if (cert._id === viewCert._id) {
      setView(false)
      setViewCert({_id: null})
    } else {
      setView(true)
      setViewCert(cert)
    }
  }

  const filterServer = (array) => {
    if (serverSearch === '') {
      return array
    }
    return array.filter((item) => item.serverName.toLowerCase().includes(serverSearch.toLowerCase()))
  }

  const filterDate = (array) => {
    if (date) {
      let dateNew = date.toLocaleString().split(/\D/).slice(0,3).map(num=>num.padStart(2,"0")).join("/")
      return array.filter((item) => {
        // console.log(item.renewDate)
        return (item.renewDate.split('-')[0] === dateNew.split('/')[2] && item.renewDate.split('-')[1] === dateNew.split('/')[0])
      })
    } else {
      return array
    }
  }

  const filterKeyStore = (array) => {
    if (keyStoreLocation === '') {
      return array
    }
    return array.filter((item) => item.keyStoreLocation.toLowerCase().includes(keyStoreLocation.toLowerCase()))
  }

  const filterCN = (array) => {
    if (cnSearch === '') {
      return array
    }
    return array.filter((item) => item.commonName.toLowerCase().includes(cnSearch.toLowerCase()))
  }

  const filterITSI = (array) => {
    // console.log(array, itsiSearch)
    if (itsiSearch === '') {
      return array
    }
    return array.filter((item) => item.itServiceInstance.toLowerCase().includes(itsiSearch.toLowerCase()))
  }

  const filterEnv = (array) => {
    if (environment === 'Select') {
      return array
    }
    return array.filter((item) => item.environment.toLowerCase().includes(environment.toLowerCase()))
  }
  const filterThumbPrint = (array) => {
    if (thumbPrint === 'Select') {
      return array
    }
    return array.filter((item) => String(item.thumbPrint).toLowerCase().includes(thumbPrint.toLowerCase()))
  }

  const filterResource = (array) => {
    if (resourceSearch === '') {
      return array
    }
    return array.filter((item) => item.resource.toLowerCase().includes(resourceSearch.toLowerCase()))
  }

  useEffect(() => {
    let result = certs
    result = filterServer(result)
    result = filterDate(result)
    result = filterKeyStore(result)
    result = filterCN(result)
    result = filterITSI(result)
    result = filterEnv(result)
    result = filterThumbPrint(result)
    result = filterResource(result)
    setCertList(result)
    return () => {
      console.log('Unmounted')
    }
  }, [serverSearch, date, keyStoreLocation, cnSearch, itsiSearch, environment, thumbPrint, resourceSearch])

  return (
    <div className='flex-grow px-12'>
      <div className="text-center text-4xl font-semibold text-white mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-opacity-10">{`${APP_NAME} - ${pageName}`}</div>
      {
        view && viewCert && (
          <CertificateCard cert={viewCert} button={true} edit={false} />
        )
      }
      <div className='h-screen w-full relative overflow-hidden flex justify-center py-6'>
        <Background />
        <Card sx={{ minWidth: 275 }} className='px-12 bg-white bg-opacity-10 rounded-2xl text-white shadow-5xl relative z-2 border border-opacity-30 border-r-0 border-b-0 backdrop-filter backdrop-blur-sm' >
        <Grid container spacing={1} className='py-8 text-white'>
        <Grid item xs={1} >
          Server Name
          <br />
          <TextField label="Server Search" color="primary" onChange={(event) => setServerSearch(event.target.value)} />
        </Grid>
        <Grid item xs={2}>
          Finger Print
          <br />
          <TextField label="FingerPrint Search" color="primary" onChange={(event) => setThumbPrint(event.target.value)} />
        </Grid>
        <Grid item xs={2}>
          KeyStore Location
          <br />
          <TextField label="KeyStore Search" color="primary" onChange={(event) => setKeyStoreLocation(event.target.value)} />
        </Grid>
        <Grid item xs={1}>
          Common Name
          <br />
          <TextField label="CN Search" color="primary" onChange={(event) => setCnSearch(event.target.value)} />
        </Grid>
        <Grid item xs={1}>
          Environment
          <br />
          <TextField
            id="environment"
            select
            label="Environment"
            value={environment}
            onChange={(event) => setEnvironment(event.target.value)}
          >
            {environments.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
              // <div>{option.label}</div>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={2}>
          ITSI
          <br />
          <TextField label="ITSI Search" color="primary" onChange={(event) => setItsiSearch(event.target.value)} />
        </Grid>
        <Grid item xs={1}>
          Resource
          <br />
          <TextField label="Resource Search" color="primary" onChange={(event) => setResourceSearch(event.target.value)} />
        </Grid>
        <Grid item xs={1}>
          Date to Renew
          <br />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DesktopDatePicker
                label="Month & year"
                inputFormat="MMM-yyyy"
                value={date}
                views={["year", "month"]}
                onChange={(newDate) => setDate(newDate)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={1}>
          Actions
        </Grid>
        </Grid>
          {certList.map((cert, index) => (
            <div key={index} >
              <Box sx={{ flexGrow: 1 }}
              >
                <Grid container spacing={1} className='py-1 text-white'>
                  <Grid item xs={1}>
                    <Typography sx={{ fontSize: 14 }}  className='px-2'>
                      <Link href={`/modify/${cert._id}`}>
                        <a>{cert.serverName}</a>
                      </Link>
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography sx={{ fontSize: 14 }} gutterBottom className='px-2'>
                      {cert.thumbPrint}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography sx={{ fontSize: 14 }}  gutterBottom className='px-2'>
                      {cert.keyStoreLocation}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography sx={{ fontSize: 14 }}  gutterBottom className='px-2'>
                      {cert.commonName}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography sx={{ fontSize: 14 }}  gutterBottom className='px-2'>
                      {cert.environment}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography sx={{ fontSize: 14 }}  gutterBottom className='px-2'>
                      {cert.itServiceInstance}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography sx={{ fontSize: 14 }}  gutterBottom className='px-2'>
                      {String(cert.resource)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography sx={{ fontSize: 14 }}  className='px-2'>
                      {cert.renewDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} className='space-x-3'>
                    <Link href={`/modify/${cert._id}`}>
                      <Tooltip title="Update Renewal" arrow>
                        <RateReviewIcon color="primary" sx={{ fontSize: 32 }} />
                      </Tooltip>
                    </Link>                    
                    <Tooltip title="View Details" arrow>
                        <InfoIcon color="success" sx={{ fontSize: 32 }} onClick={() => handleView(cert)} />
                    </Tooltip>
                </Grid>
                </Grid>
              </Box>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

export const getStaticProps = async (context) => {

  const res = await fetch(`${URL}/api/certs`)
  const data = await res.json()
  // console.log({data})
  if (!data.success) {
    return {
      notFound: true,
      revalidate: 10
    }
  }
  return {
    props: { certs: data.data.filter(row => !row.hasOwnProperty('renew') && !row.hasOwnProperty('renewed') ) }, // will be passed to the page component as props
    revalidate: 10
  }
}