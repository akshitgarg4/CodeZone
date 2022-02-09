import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

//Material UI
import Card from "@mui/material/Card";
import { FlexRow, Item } from "@mui-treasury/component-flex";
import CardContent from "@mui/material/CardContent";
import { Paper, Button } from "@mui/material";
import Typography from "@mui/material/Typography";

class QuizBoard extends React.Component {
  render() {
    const { auth } = this.props;

    return (
      <div>
        <Paper>
          <Card
            sx={{
              minWidth: 0,
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "#272727" : "#fff",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "unset"
                  : "0 8px 16px 0 #BDC9D7",
            }}
          >
            <FlexRow
              alignItems="center"
              p={2}
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#2f3c50" : "#fff",
              }}
            >
              <Item grow mr={1}>
                <Typography variant="h6" align="center">
                  <b>Quiz</b>
                </Typography>
              </Item>
            </FlexRow>
            <CardContent>
              <Link to="/Quiz">
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Join Quiz
                </Button>
              </Link>
              <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Quiz Results
              </Button>
              {auth.user.role === "Teacher" && (
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Create Quiz
                </Button>
              )}
            </CardContent>
          </Card>
        </Paper>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    auth: state.auth,
    darkModetheme: state.theme,
    classroom: state.classroom,
  };
}
export default connect(mapStateToProps)(QuizBoard);
