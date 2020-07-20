import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
import ProgramsList from "./components/pages/ProgramsList";
import Program from "./components/pages/ProgramDetail";
import Listtodo from "./components/pages/Listtodo";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserContext from "./context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import history from "./history";
import ProgramDetail from "./components/pages/ProgramDetail";
import TodoApp from "./components/pages/TodoApp";

export default function App() {
	const [userData, setUserData] = useState({
		token: undefined,
		user: undefined,
	});

	useEffect(() => {
		const checkLoggedIn = async () => {
			let token = localStorage.getItem("auth-token");
			if (token === null) {
				return;
			}
			const tokenRes = await Axios.post("http://localhost:3001/users/tokenIsValid", null, { headers: { "x-auth-token": token } });
			if (tokenRes.data) {
				const userRes = await Axios.get("http://localhost:3001/users/", {
					headers: { "x-auth-token": token },
				});
				console.log(userRes.data);
				setUserData({
					token,
					user: userRes.data,
				});
			}
		};

		checkLoggedIn();
	}, []);

	return (
		<>
			<BrowserRouter history={history}>
				<UserContext.Provider value={{ userData, setUserData }}>
					<Header />
					<div>
						<Switch>
							<Route exact path="/" component={Home} />
							<div className="container">
								<Route path="/login" component={Login} />
								<Route path="/register" component={Register} />
								<Route exact path="/programs/:id" component={ProgramDetail} />
								<Route exact path="/programs" component={ProgramsList} />
								<Route path="/todoapp" component={TodoApp} />
								<Route path="/listtodo" component={Listtodo} />
							</div>
						</Switch>
					</div>
				</UserContext.Provider>
			</BrowserRouter>
		</>
	);
}
