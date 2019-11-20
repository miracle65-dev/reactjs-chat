import React, { Component } from 'react';
import {CometChat} from "@cometchat-pro/chat";
import {CC_APP_ID, CC_API_KEY} from "../../constants";
import LoginForm from "./LoginForm";
import ChatContainer from "./ChatContainer";
import { Switch, Route, Redirect } from 'react-router-dom';

export default class Base extends Component {
    
    state = {
        username: '',
        authToken : '',
        loginBtnDisabled : false,
        errors : []
    };

    componentDidMount() {
        
       //initialize cometchat - v1
       CometChat.init(CC_APP_ID).then(
        () => {
            if(this.state.username === "")
            {
                 CometChat.getLoggedinUser().then(user=>{
                         this.setState({username : user.uid, authToken : user.authToken});
                     },
                     error => {
                         
                     }
         
                 );
            }
        }
      );
    }

    handleInputChange = (e) =>
    {
        this.setState({username:e.target.value});
    }

    handleDemoLogin = (e, uid) => {

        this.setState({loginBtnDisabled:true});
        
        CometChat.login(uid, CC_API_KEY).then(
            User => {

                this.setState({username:uid, authToken : User.authToken, loginBtnDisabled:false});
                
                window.location="/#/chat";

        },
        error => {
            this.setState({error : "Username and/or password is incorrect.", loginBtnDisabled:false})   
        });
    }

    handleLogin = (e) => {
        
        e.preventDefault();

        this.setState({loginBtnDisabled:true});

        const username = this.state.username;
        
        CometChat.login(username, CC_API_KEY).then(
            User => {
                this.setState({username:username, authToken : User.authToken, loginBtnDisabled:false });
                
                window.location="/#/chat";

        },
        error => {
            this.setState({error : "Username and/or password is incorrect."})   
        });
     
    }

    handleLogout = () => 
    {
        CometChat.logout().then(() => {
            window.location.reload(true);
        },error=>{
          window.location.reload(true);
        })
    }
   
    render() { 
        const userstate = this.state;
        return ( 
           <React.Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <main className="col-12 col-md-12 col-xl-12">
                            <div className="vertical-center">
                                <div className="container">
                                    <Switch>
                                        <Route path="/chat" name="ChatContainer" render={(props) => <ChatContainer user={userstate} handleLogout={this.handleLogout} />} />
                                        <Route path="/login" name="LoginForm" render={(props) => <LoginForm uid={userstate.username} loginBtnDisabled={userstate.loginBtnDisabled} handleLogin={this.handleLogin} handleDemoLogin={this.handleDemoLogin} handleInputChange={this.handleInputChange} />} />
                                        <Redirect from="/" to="/login"/>
                                    </Switch>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
           </React.Fragment>
            
        );
    }
}
