import DateFnsUtils from "@date-io/date-fns";
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Autocomplete } from "@material-ui/lab";
import { KeyboardDatePicker, DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import axios from "axios";
import "date-fns";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import DragnDropZone from "../../../shared/DragnDropZone";
import Page from "../../../shared/Page";
import { requirePrivateKeyHex } from "../../../utils/keyholder";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "../../../utils/snackbar-utils";

export default function CreateClass(props) {
  const [classGroup, setClassGroup] = useState(null);
  const classGroupOptions = [1, 2, 3, 4, 5];
  const [nameOfClass, setNameOfClass] = useState("");
  const [teacher, setTeacher] = useState({});
  const [teacherOptions, setTeacherOptions] = useState([{ name: "" }]);
  const { enqueueSnackbar } = useSnackbar();

  const [currentTab, setCurrentTab] = useState(0);
  const [students, setStudents] = useState([{}]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    try {
      const response = await axios.get("/staff/teachers");
      const teachersData = response.data.map((teacher, index) => ({ ...teacher, id: index + 1 }));
      setTeacherOptions(teachersData);
    } catch (error) {
      error.response && enqueueSnackbar(JSON.stringify(error.response.data), ERR_TOP_CENTER);
    }
  }

  async function hdSubmit() {
    try {
      const privateKeyHex = await requirePrivateKeyHex(enqueueSnackbar);
      // console.log(students);
      const claxx = { classGroup, nameOfClass, teacher, students };
      const response = await axios.post("/staff/create-class", { claxx, privateKeyHex });
      enqueueSnackbar("T???o l???p th??nh c??ng!", SUCCESS_TOP_CENTER);
      setClassGroup(null);
      setNameOfClass("");
      setTeacher({});
      setStudents([]);
    } catch (error) {
      console.error(error);
      error.response && enqueueSnackbar(JSON.stringify(error.response.data), ERR_TOP_CENTER);
    }
  }

  return (
    <div>
      <Page title="T???o l???p h???c">
        <Typography variant="h3" gutterBottom>
          Th??ng tin l???p h???c
        </Typography>
        <Paper style={{ padding: 16 }}>
          <Grid container spacing={4}>
            <Grid item md={4}>
              <Autocomplete
                value={classGroup}
                onChange={(event, newValue) => {
                  setClassGroup(newValue);
                }}
                options={classGroupOptions}
                getOptionLabel={(option) => `Kh???i l???p ${option}`}
                renderInput={(params) => <TextField {...params} label="Kh???i l???p" variant="outlined"></TextField>}
              ></Autocomplete>
            </Grid>
            <Grid item md={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="T??n l???p"
                value={nameOfClass}
                onChange={(e) => setNameOfClass(e.target.value)}
              ></TextField>
            </Grid>
            <Grid item md={4}>
              <Autocomplete
                value={teacher}
                onChange={(event, newValue) => {
                  setTeacher(newValue);
                }}
                options={teacherOptions}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label="Gi??o vi??n ch??? nhi???m" variant="outlined"></TextField>}
              ></Autocomplete>
            </Grid>
          </Grid>
        </Paper>

        <Box mt={4}></Box>
        <Typography variant="h3" gutterBottom>
          Danh s??ch h???c sinh
        </Typography>

        <AppBar position="static" style={{ padding: "4px 0" }}>
          <Tabs centered value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} aria-label="simple tabs example">
            <Tab label="Nh???p tr???c ti???p" />
            <Tab label="Upload file Excel" />
          </Tabs>
        </AppBar>
        <Box hidden={currentTab !== 0}>
          <TableContainer component={Paper} style={{ borderRadius: 0 }}>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>H??? v?? T??n</TableCell>
                  <TableCell>Ng??y sinh</TableCell>
                  <TableCell style={{ width: 125 }}>Gi???i t??nh</TableCell>
                  <TableCell>Qu?? qu??n</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Kh??a c??ng khai (optional)</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <TextField
                        value={student.name}
                        onChange={(e) => {
                          const clone = students;
                          clone[index].name = e.target.value;
                          setStudents(clone);
                        }}
                      ></TextField>
                    </TableCell>

                    <TableCell style={{ width: 175 }}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableFuture
                          autoOk
                          format="dd/MM/yyyy"
                          value={student.birthday}
                          onChange={(selectedDate) => {
                            const clone = [...students];
                            clone[index].birthday = selectedDate;
                            setStudents(clone);
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </TableCell>

                    <TableCell>
                      <Autocomplete
                        value={student.gender}
                        onChange={(event, newValue) => {
                          const clone = [...students];
                          clone[index].gender = newValue;
                          setStudents(clone);
                        }}
                        options={["Nam", "N???"]}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => <TextField {...params}></TextField>}
                      ></Autocomplete>
                    </TableCell>

                    <TableCell>
                      <TextField
                        value={student.locale}
                        onChange={(e) => {
                          const clone = [...students];
                          clone[index].locale = e.target.value;
                          setStudents(clone);
                        }}
                      ></TextField>
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={student.email}
                        onChange={(e) => {
                          const clone = [...students];
                          clone[index].email = e.target.value;
                          setStudents(clone);
                        }}
                      ></TextField>
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={student.publicKey}
                        onChange={(e) => {
                          const clone = [...students];
                          clone[index].publicKey = e.target.value;
                          setStudents(clone);
                        }}
                      ></TextField>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => {
                          const resultStudents = students.filter((std, idx) => idx !== index);
                          setStudents(resultStudents);
                        }}
                      >
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box p={2} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setStudents([...students, {}]);
                }}
              >
                Th??m
              </Button>
            </Box>
          </TableContainer>
        </Box>
        <Box hidden={currentTab !== 1}>
          <DragnDropZone></DragnDropZone>
        </Box>

        <Box mt={4} textAlign="right">
          <Button variant="contained" color="primary" onClick={hdSubmit}>
            G???i
          </Button>
        </Box>
      </Page>
    </div>
  );
}
