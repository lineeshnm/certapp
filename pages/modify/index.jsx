import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Stack from '@mui/material/Stack';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BackspaceIcon from '@mui/icons-material/Backspace';
import Tooltip from '@mui/material/Tooltip';
import ReadOnlyRow from '../../components/ReadOnlyRow';
import EditableRow from '../../components/EditableRow';
import { isAuth } from '../../actions/auth';
import ContactCard from '../../components/ContactCard';

import Background from '../../components/Background';

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


const Modify = ({certs}) => {
  const router = useRouter()
  const [serverSearch, setServerSearch] = useState('');
  const [cnSearch, setCnSearch] = useState('')
  const [itsiSearch, setItsiSearch] = useState('')
  const [thumbPrintSearch, seThumbPrintSearch] = useState('')
  const [environment, setEnvironment] = useState('Select')
  const [certList, setCertList] = useState(certs)
  // const [date, setDate] = useState(new Date())
  const [date, setDate] = useState()
  const [keyStoreLocation, setKeyStoreLocation] = useState('');
  const [sfGroupSearch, setSfGroupSearch] = useState('');
  const [editCertId, setEditCertId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    thumbPrint: "",
    serverName: "",
    validTo: "",
    managedDN: "",
    commonName: "",
    itServiceInstance: "",
    environment: "",
    resource: "",
  });
  const [deletedID, setdeletedID] = useState([]);
  const [modifiedID, setModifiedID] = useState([]);



  const handleSaveClick = (event) => {
    event.preventDefault();

    const editedCert = {
      _id: editCertId,
      serverName: editFormData.serverName,
      thumbPrint: editFormData.thumbPrint,
      keyStoreLocation: editFormData.keyStoreLocation,
      commonName: editFormData.commonName,
      environment: editFormData.environment,
      itServiceInstance: editFormData.itServiceInstance,
      sfGroup: editFormData.sfGroup,
      validTo: editFormData.validTo,
    };

    const newCertList = [...certList];

    const index = certList.findIndex((cert) => cert._id === editCertId);

    newCertList[index] = {...newCertList[index], ...editedCert}; // Lineesh Modified

    setCertList(newCertList);
    setEditCertId(null);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleEditClick = (event, cert) => {
    event.preventDefault();
    setEditCertId(cert._id);
    const existingID = modifiedID && modifiedID.find((id) => id === cert._id)
    if (!!existingID === false) {
      setModifiedID(oldArray => [...oldArray, cert._id])
    }
    // console.log(modifiedID.includes(cert._id))

    const formValues = {
      serverName: cert.serverName,
      thumbPrint: cert.thumbPrint,
      keyStoreLocation: cert.keyStoreLocation,
      commonName: cert.commonName,
      environment: cert.environment,
      itServiceInstance: cert.itServiceInstance,
      sfGroup: cert.sfGroup,
      validTo: cert.validTo,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditCertId(null);
  };

  const handleUploadDB = async () => {
    if ( deletedID.length > 0 ) {
      try {
        const res =  await fetch(`${URL}/api/certs/bulk?ids=${deletedID}`, {
            method: 'DELETE',
        })
        const data = await res.json()
        console.log({data})
        // Router.back()
      } catch (error) {
          console.log({error})
      }
    } else {
      console.log("Nothing to Delete")
    }
    if ( modifiedID.length > 0 ) {
      console.log("Starting to modify")
      try {
        for (const id of modifiedID) {
          const {serverName, thumbPrint, keyStoreLocation, commonName, environment, itServiceInstance, sfGroup, validTo} = certList.filter(cert => cert._id === id)[0]
          const res =  await fetch(`${URL}/api/certs/${id}`, {
            method: 'PUT',
            headers: {
                "Accept" : "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({serverName, thumbPrint, keyStoreLocation, commonName, environment, itServiceInstance, sfGroup, validTo})
          })
          const data = await res.json()
          console.log({data})
        }
      } catch (error) {
          console.log({error})
      }
    } else {
      console.log("Nothing to Modify")
    }
    // https://stackoverflow.com/questions/59724331/mongodb-update-multiple-documents-with-different-values
    // Iterate through modifiedID and get the modified details from certList and call individual ID modification {API}/cert/[id].PUT
    // Check every update worked well. 
    // Refresh the page
    router.reload(window.location.pathname)
  }

  const handleDiscardClick = () => {
    seThumbPrintSearch('')
    setServerSearch('')
    setKeyStoreLocation('')
    setCnSearch('')
    setEnvironment('Select')
    setItsiSearch('')
    setSfGroupSearch('')
    setDate()
    setCertList(certs)
  }

  const handleDeleteConfirm = (certId) => {
    const existingID = deletedID && deletedID.find((id) => id === certId)
    if (!!existingID === false) {
      setdeletedID(oldArray => [...oldArray, certId])
    }
    console.log({deletedID})
    const newCertList = [...certList];

    const index = certList.findIndex((cert) => cert._id === certId);

    newCertList.splice(index, 1);

    setCertList(newCertList);
    // setOpen(false)
    console.log({deletedID})
};

  const filterThumbPrint = (array) => {
    if (thumbPrintSearch === '') {
      return array
    }
    return array.filter((item) => item.thumbPrint.toLowerCase().includes(thumbPrintSearch.toLowerCase()))
  }

  const filterServer = (array) => {
    if (serverSearch === '') {
      return array
    }
    return array.filter((item) => item.serverName.toLowerCase().includes(serverSearch.toLowerCase()))
  }

  const filterKeyStoreLocation = (array) => {
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

  const filterEnv = (array) => {
    if (environment === 'Select') {
      return array
    }
    return array.filter((item) => item.environment.toLowerCase().includes(environment.toLowerCase()))
  }

  
  const filterITSI = (array) => {
    // console.log(array, itsiSearch)
    if (itsiSearch === '') {
      return array
    }
    return array.filter((item) => item.itServiceInstance.toLowerCase().includes(itsiSearch.toLowerCase()))
  }

  const filterSfGroup = (array) => {
    // console.log(array, itsiSearch)
    if (sfGroupSearch === '') {
      return array
    }
    return array.filter((item) => item.sfGroup.toLowerCase().includes(sfGroupSearch.toLowerCase()))
  }

  const filterDate = (array) => {
    if (date) {
      let dateNew = date.toLocaleString().split(/\D/).slice(0,3).map(num=>num.padStart(2,"0")).join("/")
      return array.filter((item) => {
        // console.log(item.validTo)
        return (item.validTo.split('-')[0] === dateNew.split('/')[2] && item.validTo.split('-')[1] === dateNew.split('/')[0])
      })
    } else {
      return array
    }
  }


  useEffect(() => {
    let result = certs
    result = filterThumbPrint(result)
    result = filterServer(result)
    result = filterKeyStoreLocation(result)
    result = filterCN(result)
    result = filterEnv(result)
    result = filterITSI(result)
    result = filterSfGroup(result)
    result = filterDate(result)
    setCertList(result)
    return () => {
      console.log('Unmounted')
    }
  }, [thumbPrintSearch, serverSearch, keyStoreLocation, cnSearch, environment, itsiSearch, sfGroupSearch, date])

  return (
    <div className='flex-grow px-12' >
      <div className="text-center text-4xl font-semibold text-white mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 tracking-widest">
      {`${APP_NAME} - DB Modify`}
      </div>
      {
        !isAuth() && (
          <ContactCard />
        )
      }
      { isAuth() && (
        <div className='h-screen w-full relative overflow-hidden flex justify-center py-6'>
          <Background />
          <Card sx={{ minWidth: 275 }} className='px-12 mb-8 bg-white bg-opacity-10 rounded-2xl text-white shadow-5xl relative z-2 border border-opacity-30 border-r-0 border-b-0 backdrop-filter backdrop-blur-sm' >
            <Grid container spacing={1} className='py-8'>
              <Grid item xs={1}>
                Server Name
                <br />
                <TextField label="Server Search" value={serverSearch} color="primary" onChange={(event) => setServerSearch(event.target.value)} />
              </Grid>
              <Grid item xs={2}>
                Finger Print
                <br />
                <TextField label="FingerPrint Search" value={thumbPrintSearch} color="primary" onChange={(event) => seThumbPrintSearch(event.target.value)} />
              </Grid>
              <Grid item xs={2}>
                KeyStore Location
                <br />
                <TextField label="KeyStore Search" value={keyStoreLocation} color="primary" onChange={(event) => setKeyStoreLocation(event.target.value)} />
              </Grid>
              <Grid item xs={1}>
                Common Name
                <br />
                <TextField label="CN Search" value={cnSearch} color="primary" onChange={(event) => setCnSearch(event.target.value)} />
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
                <TextField label="ITSI Search" value={itsiSearch} color="primary" onChange={(event) => setItsiSearch(event.target.value)} />
              </Grid>
              <Grid item xs={1}>
                SF Group
                <br />
                <TextField label="SF Group Search" value={sfGroupSearch} color="primary" onChange={(event) => setSfGroupSearch(event.target.value)} />
              </Grid>
              <Grid item xs={1}>
                Expiry Date
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
              <Grid item xs={1} className='space-x-3'>
                Actions
                <br />
                <Tooltip title="Update DataBase" arrow>
                  <CloudUploadIcon color="primary" sx={{ fontSize: 32 }} onClick={handleUploadDB}/>
                </Tooltip>
                <Tooltip title="Discard changes" arrow>
                  <BackspaceIcon color="error" sx={{ fontSize: 32 }} onClick={handleDiscardClick}/>
                </Tooltip>  
              </Grid>
            </Grid>
            {certList.map((cert) => (
              <div key={cert._id}>
              {
                editCertId === cert._id ? (
                  <EditableRow 
                  key={cert._id}
                  cert={cert} 
                  editFormData={editFormData}
                  handleEditFormChange={handleEditFormChange}
                  handleCancelClick={handleCancelClick}
                  handleSaveClick={handleSaveClick}
                  environments={environments}
                  />
                ) : (
                <ReadOnlyRow 
                  key={cert._id}
                  cert={cert} 
                  handleEditClick={handleEditClick}
                  handleDeleteConfirm={handleDeleteConfirm}
                  modified={modifiedID.includes(cert._id)}
                />
                )
              }
              </div>                        
            ))}
          </Card>
        </div>
      )}
    </div>
  )
};

export default Modify;

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
    props: { certs: data.data }, // will be passed to the page component as props
    revalidate: 10
  }
}
