import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { requirePrivateKeyHex } from "../../../utils/keyholder";
import { ERR_TOP_CENTER } from "../../../utils/snackbar-utils";
import { getLinkFromTxid } from "../../../utils/utils";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function ClassCollapse({ claxx, fetch5thClasses, minWidth }) {
  const cls = useStyles();
  const [show, setShow] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [stateClass, setStateClass] = useState(claxx);

  async function hdIssueAll(e, stateClass) {
    e.stopPropagation();
    try {
      const privateKeyHex = await requirePrivateKeyHex(enqueueSnackbar);
      const response = await axios.post("/staff/issue-all", { privateKeyHex, claxx: stateClass });
      fetch5thClasses();
      // setStateClass(response.data);
    } catch (error) {
      error.response && enqueueSnackbar(JSON.stringify(error.response.data), ERR_TOP_CENTER);
    }
  }

  async function hdIssueOne(e, sIndex) {
    e.stopPropagation();
    try {
      const privateKeyHex = await requirePrivateKeyHex(enqueueSnackbar);
      const response = await axios.post("/staff/issue-all", { privateKeyHex, claxx: stateClass, sIndex });
      setStateClass(response.data);
    } catch (error) {
      error.response && enqueueSnackbar(JSON.stringify(error.response.data), ERR_TOP_CENTER);
    }
  }

  function toggleCollapse() {
    setShow(!show);
  }

  return (
    <Paper>
      <Box
        pl={2}
        pr={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={toggleCollapse}
        style={{ cursor: "pointer" }}
      >
        <Typography variant="h4">
          L???p {stateClass.nameOfClass}, GVCN: {stateClass.teacher.name}
        </Typography>
        <Box>
          {stateClass.isIssued ? (
            <i>???? c??ng nh???n</i>
          ) : (
            <Button
              className={cls.button}
              variant="outlined"
              color="primary"
              onClick={(e) => hdIssueAll(e, claxx)}
              disabled={stateClass.isIssued}
            >
              C??ng nh???n c??? l???p
            </Button>
          )}
          {show ? (
            <IconButton onClick={toggleCollapse}>
              <KeyboardArrowUpIcon />
            </IconButton>
          ) : (
            <IconButton onClick={toggleCollapse}>
              <KeyboardArrowDownIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <Divider></Divider>
      <Collapse in={show}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell style={{ width: "20%" }}>H??? v?? T??n</TableCell>
                <TableCell>Ng??y sinh</TableCell>
                <TableCell>Gi???i t??nh</TableCell>
                <TableCell>Qu?? qu??n</TableCell>
                {claxx.isIssued && <TableCell>Ng??y c??ng nh???n</TableCell>}
                {claxx.isIssued && <TableCell>Ng?????i c??ng nh???n</TableCell>}
                {claxx.isIssued ? <TableCell>Txid</TableCell> : <TableCell>C??ng nh???n</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {stateClass.students.map((student, sIndex) => (
                <TableRow key={sIndex}>
                  <TableCell>{sIndex + 1}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.birthday.split("T")[0]}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.locale}</TableCell>
                  {claxx.isIssued && <TableCell>{new Date(claxx.issueDate).toISOString().split("T")[0]}</TableCell>}
                  {claxx.isIssued && <TableCell>{claxx.issuer}</TableCell>}
                  <TableCell>
                    {student.issueTxid ? (
                      getLinkFromTxid(student.issueTxid, 10)
                    ) : (
                      <Button variant="contained" color="primary" size="small" onClick={(e) => hdIssueOne(e, sIndex)}>
                        C??ng nh???n
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );
}
