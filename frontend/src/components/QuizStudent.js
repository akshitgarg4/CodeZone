import {Component} from "react";
import {connect} from "react-redux";
import {clearQuiz, submitQuiz} from "../actions/quiz";

// Material UI
import {Grid} from "@mui/material";
import Color from "color"; // v3.2.1
import {styled} from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";


const CardActionAreaActionArea = styled(CardActionArea)(() => ({
	borderRadius: 10,
	transition: "0.2s",
	"&:hover": {
		transform: "scale(1.09)",
	},
}));

const StyledCard = styled(Card)(({color}) => ({
	minWidth: "30vh",
	minHeight: "30vh",
	maxWidth: "30vh",
	maxHeight: "30vh",
	borderRadius: 16,
	boxShadow: "none",
	"&:hover": {
		boxShadow: `0 6px 12px 0 ${Color(color).rotate(-12).darken(0.2).fade(0.5)}`,
	},
}));

const StyledCard2 = styled(Card)(({color}) => ({
	minWidth: "100hh",
	minHeight: "60vh",
	maxWidth: "100hh",
	maxHeight: "60vh",
	borderRadius: 16,
	boxShadow: "none",
	"&:hover": {
		boxShadow: `0 6px 12px 0 ${Color(color).rotate(-12).darken(0.2).fade(0.5)}`,
	},
}));

const CardContentContent = styled(CardContent)(({color}) => {
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
}));

const TypographySubtitle = styled(Typography)(() => ({
	fontFamily: "Montserrat",
	color: "#fff",
	opacity: 0.87,
	fontWeight: 500,
	fontSize: 18,
}));

const CustomCard = ({color, title}) => (
	<CardActionAreaActionArea>
		<StyledCard color={color}>
			<CardContentContent color={color} disableSpacing>
				<TypographySubtitle variant={"h2"}>{title}</TypographySubtitle>
			</CardContentContent>
		</StyledCard>
	</CardActionAreaActionArea>
);

const CustomCard2 = ({color, title, subtitle}) => (
	<StyledCard2 color={color}>
		<CardContentContent color={color} disableSpacing>
			<TypographyTitle variant={"h2"}>{title}</TypographyTitle>
			<TypographySubtitle variant={"h2"}>{subtitle}</TypographySubtitle>
		</CardContentContent>
	</StyledCard2>
);

class QuizStudent extends Component{
	
	componentDidMount(){
		
		let currentQuiz = this.props.quiz.quiz;
		this.checkAnswer = this.checkAnswer.bind(this);
		this.submitted = false;
		this.setState({
			questionData: !currentQuiz ? [] : currentQuiz.questions,
			quizName: !currentQuiz ? "" : currentQuiz.title,
			quizDescription: !currentQuiz ? "" : currentQuiz.description,
			maxScore: !currentQuiz ? 0 : currentQuiz.maxScoreQuiz,
			quizID: !currentQuiz ? "" : currentQuiz.quizID,
			progress: 0,
			score: 0,
			startTime: !currentQuiz ? Date.now() : currentQuiz.dateScheduled,
			endTime: !currentQuiz ? Date.now() : currentQuiz.endTime,
			timeLeft: 0,
			timeLeftToStart: 0,
			studentResponse: {
				finalScore: 0,
				response: {}
			}
		});
		
		if(currentQuiz){
			var timeLeft = new Date(currentQuiz.endTime) - new Date() - 19800000;
			timeLeft /= 1000;
			timeLeft = parseInt(timeLeft);
			timeLeft += 10;
			this.setState({
				timeLeft: timeLeft
			});
			this.decrementTimeLeft = setInterval(() => {
				if(this.state.timeLeft === 1){
					this.submit();
					this.setState((prevState) => ({
							timeLeft: prevState.timeLeft - 1
						})
					)
				}
				
				this.setState((prevState) => ({
						timeLeft: prevState.timeLeft - 1
					})
				)
			}, 1000);
			
			var timeLeftToStart = new Date(currentQuiz.dateScheduled) - new Date() - 19800000;
			timeLeftToStart /= 1000;
			timeLeftToStart = parseInt(timeLeftToStart);
			timeLeftToStart += 10;
			
			this.setState({
				timeLeftToStart: timeLeftToStart
			});
			this.decrementTimeLeftToStart = setInterval(() => {
				
				this.setState((prevState) => ({
						timeLeftToStart: prevState.timeLeftToStart - 1
					})
				)
			}, 1000);
		}
		// this.forceUpdate();
	};
	
	
	componentWillUnmount(){
		// this.props.dispatch(clearQuiz());
		clearInterval(this.decrementTimeLeft);
		clearInterval(this.decrementTimeLeftToStart);
		
	}
	
	
	updateResponse = (index) => {
		let currentQuestion = this.state.questionData[this.state.progress].questionNumber;
		let studentResponse = this.state.studentResponse;
		studentResponse.response[currentQuestion] = index + 1;
		studentResponse.finalScore = this.state.score;
		this.setState({studentResponse});
		
	}
	
	checkAnswer(index){
		var correct = this.state.questionData[this.state.progress].correct;
		var newScore = 0,
			newProgress = 0;
		if(correct === index){
			newScore =
				parseInt(this.state.score) +
				parseInt(this.state.questionData[this.state.progress].questionMarks);
			this.setState({score: newScore});
			newProgress = this.state.progress + 1;
			this.setState({progress: newProgress});
		} else{
			newProgress = this.state.progress + 1;
			this.setState({progress: newProgress});
		}
		this.updateResponse(index);
	}
	
	submit(){
		if( !this.submitted){
			console.log("Submit");
			let submission = {
				quiz: this.state.quizID,
				answers: this.state.studentResponse.response,
			}
			this.props.dispatch(submitQuiz(submission));
		}
		this.submitted = true;
	}
	
	render(){
		if( !this.props.quiz.quiz || !this.state){
			return (
				<div><CircularProgress/></div>
			)
		}
		var currentQuestion = this.state.questionData[this.state.progress];
		var classroom_id = this.props.location.classroom_id;
		// console.log(classroom_id,this.props,this);
		if(this.state.timeLeftToStart > 0){
			return (
				<div>
					<TypographyTitle>QUIZ hasn't started yet!!</TypographyTitle>
					
					<TypographyTitle>Time
						Left for quiz to
						start: {parseInt(this.state.timeLeftToStart / 3600)} : {parseInt((this.state.timeLeftToStart % 3600) / 60)} : {parseInt((this.state.timeLeftToStart % 3600) % 60)}</TypographyTitle>
				</div>
			)
			
		} else if(this.state.questionData.length > this.state.progress && this.state.timeLeft > 0){
			return (
				<div>
					<div>
						<TypographyTitle>Time
							Left: {parseInt(this.state.timeLeft / 3600)} : {parseInt((this.state.timeLeft % 3600) / 60)} : {parseInt((this.state.timeLeft % 3600) % 60)}</TypographyTitle>
						<Grid height="100vh" m={10}>
							<Card
								sx={{
									bgcolor: (theme) =>
										theme.palette.mode === "dark" ? "#272727" : "#fff",
									boxShadow: (theme) =>
										theme.palette.mode === "dark"
											? "unset"
											: "0 8px 16px 0 #BDC9D7",
								}}
							>
								{this.state.quizName}
								{this.state.quizDescription}
								<Grid
									item
									container
									direction="row"
									justifyContent="space-evenly"
									alignItems="center"
								>
									<Grid item m={2} sx={2}>
										{" "}
										<CustomCard2
											title={currentQuestion.question}
											color="#5879ad"
										/>
									</Grid>
									<Grid
										container
										sx={2}
										direction="row"
										justifyContent="center"
										alignItems="center"
									>
										<Grid item m={2} sx={2} onClick={() => this.checkAnswer(0)}>
											<CustomCard
												title={currentQuestion.answers[0]}
												color="#253145"
											/>
										</Grid>
										<Grid item m={2} sx={2} onClick={() => this.checkAnswer(1)}>
											<CustomCard
												title={currentQuestion.answers[1]}
												color="#253145"
											/>
										</Grid>
										<Grid
											container
											sx={12}
											direction="row"
											justifyContent="center"
											alignItems="center"
										>
											<Grid
												item
												m={2}
												sx={2}
												onClick={() => this.checkAnswer(2)}
											>
												<CustomCard
													title={currentQuestion.answers[2]}
													color="#253145"
												/>
											</Grid>
											<Grid
												item
												m={2}
												sx={2}
												onClick={() => this.checkAnswer(3)}
											>
												<CustomCard
													title={currentQuestion.answers[3]}
													color="#253145"
												/>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Grid
									item
									m={2}
									container
									justifyContent="space-evenly"
									alignItems="center"
								>
                  <span>
                    Question {this.state.progress + 1} of{" "}
	                  {this.state.questionData.length}
                  </span>
								</Grid>
							</Card>
						</Grid>
					</div>
				</div>
			);
		} else{
			this.submit();
			return (
				<div>
					<Grid container direction="column" height="100vh">
						<Grid item m={15} container justifyContent="center"></Grid>
						<Grid item container justifyContent="center" alignItems="center">
							<CustomCard2 title={"Quiz Finished!"} color="#253145"/>
						</Grid>
					</Grid>
					<Link to= {"/classroom/" + classroom_id}>
						<Button variant="contained" justifyContent="center" alignItems="center" sx={{mt: 3, mb: 2}}>
							Go Back To Classroom
						</Button>
					</Link>
					
				</div>
			);
		}
	}
}

function mapStateToProps(state){
	return {
		auth: state.auth,
		quiz: state.quiz,
	};
}

export default connect(mapStateToProps)(QuizStudent);
