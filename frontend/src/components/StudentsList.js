import React from "react";
import {connect} from "react-redux";
import ChatWindow from "./ChatWindow";
import {fetchUnreadMessageCount} from "../actions/classroom";
import NotificationSound from "../static/sounds/notification.mp3";
import Sound from 'react-sound';
//Material UI
import {FlexRow, Item} from "@mui-treasury/component-flex";
import Avatar from "@mui/material/Avatar";
import {Badge, Paper} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
// eslint-disable-next-line
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";

const PersonItem = ({
	                    src = "",
	                    avatar = "",
	                    name = "",
	                    count = null,
	                    self = {},
	                    other = {},
	                    classroomId = {},
	                    messageArray = {},
	                    unreadMessageCount = 0,
                    }) => {
	return (
		<FlexRow gap={12} p={2} noWrap>
			<Item noShrink>
				<Avatar src={avatar}>
				</Avatar>
			</Item>
			<FlexRow gap={2} p={0.25} grow stackPoint={240} alignItems="center">
				<Item grow>
					<Typography
						noWrap
						sx={{
							fontWeight: 600,
							fontSize: "1rem",
							color: (theme) =>
								theme.palette.mode === "dark" ? "#fff" : "#122740",
						}}
					>
						<b>{name}</b>
					</Typography>
					<Typography
						noWrap
						variant="body2"
						sx={{
							fontSize: "0.875rem",
							color: "#758392",
							mt: - 0.25,
						}}
					>
						{count}
					</Typography>
				</Item>
				<Item>
					<Badge badgeContent={unreadMessageCount} color="error">
						
						<ChatWindow self={self} avatar={avatar} other={other} classroomId={classroomId}
						            messageArray={messageArray}></ChatWindow>
					</Badge>
				</Item>
			</FlexRow>
		</FlexRow>
	);
};

class StudentsList extends React.Component{
	constructor(props){
		super(props);
		this.previousUnreadMessageCount = React.createRef(Object.assign({}, this.props.classroom.unreadMessageCount));
		
	}
	
	componentDidMount(){
		this.play = false;
		this.totalUnreadCount = 0;
		this.props.dispatch(fetchUnreadMessageCount(this.props.classroomId));
		this.previousUnreadMessageCount.current = Object.assign({}, this.props.classroom.unreadMessageCount);
		
		this.timer = setInterval(() => {
			this.props.dispatch(fetchUnreadMessageCount(this.props.classroomId));
			let total = 0;
			let playNotification = false;
			for(let [key, value] of Object.entries(this.previousUnreadMessageCount.current)){
				
				total += this.props.classroom.unreadMessageCount[key]
				
				if(value < this.props.classroom.unreadMessageCount[key] && !playNotification){
					playNotification = true;
					
				}
			}
			this.totalUnreadCount = total;
			this.play = playNotification;
			
			this.previousUnreadMessageCount.current = Object.assign({}, this.props.classroom.unreadMessageCount);
			
		}, 5000);
		
	}
	
	componentWillUnmount(){
		// console.log(this.timer);
		clearInterval(this.timer);
	}
	
	playing = () => {
		console.log("Playing");
	};
	playStopped = () => {
		this.play = false;
		console.log("Stopped Playing");
	};
	handleError = (code, desc) => {
		console.log(code, desc, "ERROR");
	}
	
	handleLoading = (loaded, total, duration) => {
		console.log(loaded, total, duration, "Loading");
	}
	
	render(){
		let {user} = this.props.auth;
		let {students, teachers, messageArray, unreadMessageCount} = this.props.classroom;
		const {classroomId} = this.props;
		return (
			<div>
				<Paper elevation={4} style={{maxHeight: 300, overflow: "auto"}}>
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
									<b>Student List </b>
									{(this.totalUnreadCount > 0) &&
										<Badge badgeContent={this.totalUnreadCount} color="error">
											<EmailIcon color="primary"/>
										</Badge>
									}
								</Typography>
							</Item>
						</FlexRow>
						{teachers.map((value) => (
							<div>
								<PersonItem
									name={value.name}
									self={user}
									other={value}
									avatar={value?.avatar}
									classroomId={classroomId}
									messageArray={messageArray}
									unreadMessageCount={unreadMessageCount[value._id]}
								/>
								<Divider/>
							</div>
						))}
						{students.map((value) => (
							<div>
								<PersonItem
									name={value.name}
									avatar={value?.avatar}
									count={value.SID}
									self={user}
									other={value}
									classroomId={classroomId}
									messageArray={messageArray}
									unreadMessageCount={unreadMessageCount[value._id]}
								/>
								<Divider/>
							
							</div>
						))}
					</Card>
				</Paper>
				{(this.play === true) && <Sound
					url={NotificationSound}
					playStatus={Sound.status.PLAYING}
					onLoading={this.handleLoading}
					onError={this.handleError}
					onPlaying={this.playing}
					onFinishedPlaying={this.playStopped}
				/>}
			</div>
		);
	}
}

function mapStateToProps(state){
	return {
		auth: state.auth,
		darkModetheme: state.theme,
		classroom: state.classroom,
	};
}

export default connect(mapStateToProps)(StudentsList);
