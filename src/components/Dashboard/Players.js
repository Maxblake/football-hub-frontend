import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ClearSharpIcon from '@material-ui/icons/ClearSharp'
import CheckSharpIcon from '@material-ui/icons/CheckSharp'
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import axios from 'axios'
import auth from '../../lib/auth'





const useStyles = makeStyles({
  table: {
    minWidth: 650,
    overflow: 'scroll',
  },
  icon: {
    color: '#EF5B5B',
    '&:hover': {
      cursor: 'pointer',
    },
  },
})


export default function CompanyPlayersList() {



  const [companyData, setCompanyData] = useState({})
  const [players, setPlayers] = useState({})
  const [filteredNames, setFilteredNames] = useState([])
  const [filters, setFilters] = useState({
    // minimumAge: 0,
    // maximumAge: 100,
    ageRange: '0-100',
    status: 'All'
  })
  const [open, setOpen] = useState(false)

  async function getData() {
    let playerlist = {}
    const response = await axios.get(`/users/${auth.getUserId()}`)
    const data = await response.data[0]
    console.log(data)
    for (const player of Object.keys(data.players)) {
      let playerInfo
      const response = await axios.get(`/users/${player}`)
      playerInfo = await response.data[0]
      console.log(playerInfo)
      // console.log('data', data)
      playerlist[player] = playerInfo
    }
    setCompanyData(data)
    setPlayers(playerlist)
    setFilteredNames(Object.keys(playerlist))

  }


  useEffect(() => {
    // axios.get(`/users/${auth.getUserId()}`)
    //   .then(res => {
    //     console.log(res.data[0])
    //     if (res.data[0].players) {
    //       setPlayers(res.data[0].players)
    //       setFilteredNames(Object.keys(res.data[0].players))
    //     }
    //   })
    getData()
  }, [])

  const handleFilterChange = (event) => {
    console.log(event)
    const name = event.target.name;
    const newFilters = {
      ...filters,
      [name]: event.target.value,
    }
    const [lowAge, highAge] = newFilters.ageRange.split('-')
    const filteredPlayers = []
    for (const player of Object.keys(players)) {
      if (Number(players[player].age) >= lowAge && Number(players[player].age) <= highAge) {
        companyData.players[player].status === newFilters.status || newFilters.status === 'All' ? filteredPlayers.push(player) : console.log('filtered')
      }
    }
    setFilters(newFilters)
    setFilteredNames(filteredPlayers)


  };



  const classes = useStyles()
  // if (!players) return null
  if (companyData && players) return (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Age Range</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filters.ageRange}
          inputProps={{
            name: 'ageRange'
          }}
          onChange={handleFilterChange}
        >
          <MenuItem value={'0-100'}>All</MenuItem>
          <MenuItem value={'7-9'}>7 - 9 Years Old</MenuItem>
          <MenuItem value={'10-13'}>10 - 13 Years Old</MenuItem>
          <MenuItem value={'13-16'}>13 - 16 Years Old</MenuItem>
          <MenuItem value={'17-18'}>17 - Adults</MenuItem>
          <MenuItem value={'18-100'}>Adults</MenuItem>
        </Select>
      </FormControl>
      {/* <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Maximum Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filters.maximumAge}
          inputProps={{
            name: 'maximumAge'
          }}
          onChange={handleFilterChange}
        >
          <MenuItem value={100}>None</MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        </FormControl> */}
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filters.status}
          inputProps={{
            name: 'status'
          }}
          onChange={handleFilterChange}
        >
          <MenuItem value={'All'}>All</MenuItem>
          <MenuItem value={'Active'}>Active</MenuItem>
          <MenuItem value={'Past'}>Past</MenuItem>
          <MenuItem value={'Prospect'}>Prospect</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">  </TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Age</TableCell>
              <TableCell align="right">ID</TableCell>
              <TableCell align="right">Courses</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNames.map((el, i) => (
              <>
                <TableRow key={i}>
                  {/* <TableCell component="th" scope="row">
                {el.name}
              </TableCell> */}
                  <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell align="right"><Link to={`/${players[el].userId}/profile`}>{players[el].name}</Link></TableCell>
                  <TableCell align="right">{players[el].age}</TableCell>
                  <TableCell align="right">{players[el].userId}</TableCell>
                  <TableCell align="right">
                    <div className={classes.root}>


                    </div>
                  </TableCell>
                  <TableCell align="right">{companyData['players'][el].status}</TableCell>
                  <TableCell align="right">
                    <DeleteForeverSharpIcon
                      // onClick={() => handleSetCoachId(el.coachId)}
                      className={classes.icon}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Course Info
                          </Typography>
                        <Typography variant="subtitle1" gutterBottom component="div">
                          Current Courses: {players[el].courses[companyData.userId] ? `${players[el].courses[companyData.userId].active.length}` : '0'}
                        </Typography>

                        {

                          players[el].courses[auth.getUserId()] &&

                          <ul>
                            {players[el].courses[companyData.userId].active.map((elCourse, i) => {

                              return (
                                <>
                                  <li>{elCourse}</li>
                                  <br />
                                </>
                              )
                            })
                            }
                          </ul>

                        }
                        <Typography variant="subtitle1" gutterBottom component="div">
                          Past Courses: {players[el].courses[companyData.userId].past ? `${players[el].courses[companyData.userId].past.length}` : '0'}
                        </Typography>

                        {

                          players[el].courses[companyData.userId].past &&

                          <ul>
                            {players[el].courses[companyData.userId].past.map((elCourse, i) => {

                              return (
                                <li>{elCourse}</li>
                              )
                            })
                            }
                          </ul>

                        }



                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>

            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

