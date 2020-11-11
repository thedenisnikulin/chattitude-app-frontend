import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import UserAvatar from "../services/UserAvatar";

const useStyles = makeStyles((theme) => ({
  heading: {
    display: "flex",
    flexDirection: "row"
  },
  panel: {
      margin: "0 0 0.5rem 8%",
      padding: "0",
      
  },
  smth: {
    width: "90%",
    "&:hover": {
      background: "#d5dce3"
    },
  }
}));

export default function ControlledExpansionPanel(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.panel}>
      <ExpansionPanel className={classes.smth} style={{overflow: "hidden"}} expanded={expanded === 'panel'} onChange={handleChange('panel')}>
        <ExpansionPanelSummary className={classes.smth}
          style={{overflow: "hidden"}}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography style={{overflow: "hidden"}} className={classes.heading}>
            <div className="flexx">
                <UserAvatar username={props.user.username} size="small" />
                <div className="member-username">@{props.user.username}</div>
            </div>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            <div><span style={{color: "#74d69d"}}>reputation:</span> {props.user.rep}</div>
            <div><span style={{color: "#74d69d"}}>bio:</span> {props.user.bio}</div>
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}