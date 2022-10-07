import React from "react";
import ReactDOM from "react-dom";
import {
	ApolloClient,
	NormalizedCacheObject,
	ApolloProvider,
	InMemoryCache,
} from "@apollo/client";
import { ToastContainer } from "react-toastify";
import * as serviceWorker from "./serviceWorker";
import Pages from "./Router";
import "./styles/app.css";
import "react-toastify/dist/ReactToastify.css";

import Auth from "./auth";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
	cache: new InMemoryCache(),
	uri: "http://localhost:4000/graphql",
	resolvers: {},
});

function App() {
	const auth = true;
	return (
		<ApolloProvider client={client}>
			{!auth ? (
				<Auth />
			) : (
				<div>
					<Pages />
				</div>
			)}
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
			/>
		</ApolloProvider>
	);
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
