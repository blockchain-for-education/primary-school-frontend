import { Box, Button, Grid, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import "date-fns";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "src/utils/mng-token";
import { ERR_TOP_CENTER, SUCCESS_BOTTOM_CENTER } from "../../../utils/snackbar-utils";
import { setProfile } from "./redux";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormLabel-root.Mui-disabled": {
      color: theme.palette.primary.main,
    },
    "& .MuiInputBase-input.Mui-disabled": {
      color: "black",
    },
  },
  head: {
    width: "95%",
    margin: "auto",
    padding: theme.spacing(2.5, 2),
    backgroundColor: theme.palette.primary.main,
    color: "white",
    position: "relative", // this bring head foreground
  },
  body: { width: "100%", marginTop: "-32px" },
  box: {
    padding: theme.spacing(8, 3, 3, 3),
    "& > *": {
      marginBottom: theme.spacing(4),
      "&:last-child": {
        marginBottom: 0,
      },
    },
  },
}));

export default function TeacherProfileForm() {
  const cls = useStyles();
  const profile = useSelector((state) => state.teacherProfileSlice);
  const [state, setState] = useState(profile);
  const dp = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const disable = true;

  async function hdSubmit(e) {
    try {
      let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/teacher/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: getToken() },
        // delete fetching field before send data to backend to avoid fail validate, delete imgSrc to avoid request too large error.
        body: JSON.stringify({ ...state, fetching: undefined, imgSrc: undefined }),
      });

      if (!response.ok) {
        enqueueSnackbar(`${response.status}: ${await response.text()}`, ERR_TOP_CENTER);
      } else {
        const result = await response.json();
        if (!result.ok) {
          enqueueSnackbar("C?? l???i ???? x???y ra, vui l??ng th??? l???i sau!", ERR_TOP_CENTER);
          dp(setProfile({ ...state, imgSrc: profile.imgSrc }));
        } else {
          enqueueSnackbar("C???p nh??t th??nh c??ng!", SUCCESS_BOTTOM_CENTER);
          dp(setProfile({ ...state, imgSrc: profile.imgSrc }));
        }
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <Box className={cls.root}>
      <Paper className={cls.head}>
        <Typography variant="h3">Th??ng tin Gi??o vi??n</Typography>
        <Typography variant="subtitle1">M???t s??? th??ng tin c?? th??? s??? kh??ng ???????c ph??p thay ?????i</Typography>
      </Paper>
      <Box className={cls.body}>
        <Paper>
          <Box className={cls.box}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  label="M?? GV"
                  value={state?.teacherId}
                  onChange={(e) => setState({ ...state, teacherId: e.target.value })}
                  disabled={disable}
                ></TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  label="H??? v?? t??n"
                  value={state?.name}
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                  disabled={disable}
                ></TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  label="Email"
                  value={state?.email}
                  onChange={(e) => setState({ ...state, email: e.target.value })}
                  disabled={disable}
                ></TextField>
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  label="Khoa/Vi???n"
                  value={state?.department}
                  onChange={(e) => setState({ ...state, department: e.target.value })}
                  disabled={disable}
                ></TextField>
              </Grid> */}
            </Grid>
            <TextField
              InputLabelProps={{ shrink: true }}
              fullWidth
              label="Kh??a c??ng khai"
              value={state?.publicKey}
              onChange={(e) => setState({ ...state, publicKey: e.target.value })}
              disabled={disable}
            ></TextField>
            <TextField
              InputLabelProps={{ shrink: true }}
              fullWidth
              label="Kh??a b?? m???t"
              value={state?.privateKey}
              onChange={(e) => setState({ ...state, publicKey: e.target.value })}
              disabled={disable}
            ></TextField>
            {/* <TextField
              InputLabelProps={{ shrink: true }}
              fullWidth
              label="M?? t??? kh??c"
              multiline
              rows={4}
              value={state?.description}
              onChange={(e) => setState({ ...state, description: e.target.value })}
              disabled={disable}
            ></TextField> */}
            {/* TODO: allow teacher update description */}
            {/* <Box textAlign="right">
              <Button color="primary" variant="contained" onClick={hdSubmit}>
                C???p nh???t m?? t???
              </Button>
            </Box> */}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
