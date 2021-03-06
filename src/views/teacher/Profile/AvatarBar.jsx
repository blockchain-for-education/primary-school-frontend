import { Avatar, Box, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "src/utils/mng-token";
import { ERR_TOP_CENTER } from "../../../utils/snackbar-utils";
import { updateImgSrc } from "./redux";

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    height: "128px",
    width: "128px",
    margin: "auto",
    position: "relative",
  },
  paper: {
    marginTop: "-64px",
    width: "100%",
  },
  name: {
    fontWeight: 600,
  },
  description: {
    fontWeight: 300,
    lineHeight: "1.5rem",
  },
}));

export default function AvatarBar() {
  const cls = useStyles();
  const name = useSelector((state) => state.teacherProfileSlice.name);
  const avatarSrc = useSelector((state) => state.teacherProfileSlice.imgSrc);
  const description = useSelector((state) => state.teacherProfileSlice.description);
  const { enqueueSnackbar } = useSnackbar();
  const dp = useDispatch();

  async function hdChangeAvatar(e) {
    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/teacher/change-avatar`, {
      method: "POST",
      headers: { Authorization: getToken() },
      body: formData,
    });

    if (!res.ok) {
      enqueueSnackbar(await res.text(), ERR_TOP_CENTER);
    } else {
      const imgSrc = await res.json();
      dp(updateImgSrc(imgSrc));
      enqueueSnackbar("Cập nhật Avatar thành công!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
    }
  }

  return (
    <Box className={cls.root}>
      <label htmlFor="avatar">
        <input type="file" accept="image/*" id="avatar" style={{ display: "none" }} onChange={hdChangeAvatar} />
        <Avatar src={avatarSrc} className={cls.avatar}></Avatar>
      </label>
      <Paper className={cls.paper}>
        <Box textAlign="center" px={3} pb={3} pt={"96px"}>
          <Typography variant="h5" gutterBottom>
            Giáo viên
          </Typography>
          <Typography variant="h3" gutterBottom className={cls.name}>
            {name}
          </Typography>
          <Typography variant="body2" className={cls.description}>
            {description ||
              "Quisque laoreet, sem a cursus blandit, lectus libero vestibulum purus, id malesuada risus sem id nulla. Curabitur suscipit, dolor at imperdiet dapibus, arcu massa semper enim, vitae consectetur nulla leo blandit nisi. Duis aliquam non turpis sit amet pellentesque. Sed arcu neque, sollicitudin vel ultricies"}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
