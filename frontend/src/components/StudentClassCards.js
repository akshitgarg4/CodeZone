import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import { Paper,Button,Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {Grid} from "@mui/material";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function StudentClassCards(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Container>
    <Grid item sx={{ borderRadius: '50%' }} m={4} item xs={12} sm={4} md={4}>
    <Paper elevation={4}>
    <Card sx={{ minWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar> {props.classroom.subject} </Avatar>
        }
        action={
            <Link to={`/classroom/${props.classroom._id}`}>
                <Button style={{maxWidth: '120px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}} endIcon={<SendIcon />}>Enter</Button>
            </Link>
        }
        title={props.classroom.subject}
        subheader={props.classroom.batch} 
      />
      <CardActions disableSpacing>
          <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.classroom.description}
        </Typography>
      </CardContent>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Paper elevation={3}>
          <CardContent>
          <Typography paragraph>
            CreatedBy - {props.classroom.creator.name}
          </Typography>
          <Typography paragraph>
            Students Enrolled - {props.classroom.students.length}
          </Typography>
          <Typography paragraph>
            Classroom code - {props.classroom.code}
          </Typography>
        </CardContent>
        </Paper>
      </Collapse>
    </Card>
    </Paper>
    </Grid></Container>
  );
}
