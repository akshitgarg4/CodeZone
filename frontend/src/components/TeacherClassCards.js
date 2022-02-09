import React from "react";
import Color from "color"; // v3.2.1
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useTheme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const CardActionAreaActionArea = styled(CardActionArea)(() => ({
  borderRadius: 10,
  transition: "0.2s",
  "&:hover": {
    transform: "scale(1.09)",
  },
}));

const StyledCard = styled(Card)(({ color }) => ({
  minWidth: 256,
  minHeigth: 256,
  maxWidth: 256,
  maxHeigth: 256,
  borderRadius: 16,
  boxShadow: "none",
  "&:hover": {
    boxShadow: `0 6px 12px 0 ${Color(color).rotate(-12).darken(0.2).fade(0.5)}`,
  },
}));

const CardContentContent = styled(CardContent)(({ color }) => {
  return {
    backgroundColor: color,
    padding: "1rem 1.5rem 1.5rem",
  };
});

const TypographyTitle = styled(Typography)(() => ({
  fontFamily: "Keania One",
  fontSize: "2rem",
  color: "#fff",
  textTransform: "uppercase",
  paddingBottom: "25%",
}));

const TypographySubtitle = styled(Typography)(() => ({
  fontFamily: "Montserrat",
  color: "#fff",
  opacity: 0.87,
  marginTop: "2rem",
  fontWeight: 500,
  fontSize: 14,
}));

const CustomCard = ({
  color,
  title,
  link,
  subheader,
  description,
  creator,
  enrolled,
  classroomCode,
}) => (
  <CardActionAreaActionArea>
    <Link to={link} id="class-card">
      <StyledCard color={color}>
        <CardContentContent color={color}>
          <TypographyTitle variant={"h2"}>{title}</TypographyTitle>
          <TypographySubtitle>
            {subheader} - {enrolled} Students - {classroomCode}
          </TypographySubtitle>
          <TypographySubtitle nowrap={true}>{description}</TypographySubtitle>
        </CardContentContent>
      </StyledCard>
    </Link>
  </CardActionAreaActionArea>
);

export default function Student(props) {
  const theme = useTheme();
  return (
      <Grid item sx={{ borderRadius: "50%" }} m={3} xs={8} sm={3} md={3}>
        <CustomCard
          color={theme.palette.primary.main}
          title={props.classroom.subject}
          link={`/classroom/${props.classroom._id}`}
          subheader={props.classroom.batch}
          description={props.classroom.description}
          creator={props.classroom.creator.name}
          enrolled={props.classroom.students.length}
          classroomCode={props.classroom.code}
        />
      </Grid>
  );
}
