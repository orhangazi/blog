import './App.css'
import { useEffect, useState } from 'react'
import { gapi } from 'gapi-script'

function App() {

	const [posts, setPosts] = useState([])

	const start = () => {
		// Initializes the client with the API key and the Translate API.
		gapi.client.init({
			'apiKey': 'AIzaSyCshUc_FoswyIEZFh8ymyXPbkOy9oLo2Vk',
			'discoveryDocs': ['https://blogger.googleapis.com/$discovery/rest?version=v3'],
		}).then(function () {
			// Executes an API request, and returns a Promise.
			// The method name `language.translations.list` comes from the API discovery.
			console.log("gapi.client: ", gapi.client)
			console.log("gapi.client.blogger: ", gapi.client.blogger.posts.list({ blogId:"5572292692142810577", maxResult: 1}))
			//console.log("gapi.client.blogger.blogUserInfos: ", gapi.client.blogger.blogUserInfos.get({ blogId: "5572292692142810577"}))
			return gapi.client.blogger.posts.list({ blogId:"5572292692142810577", maxResult: 1})
		}).then(function (response) {
			console.log("sonuç: ", response.result.items)
			setPosts(response.result.items)
		}, function (reason) {
			console.log('Error: ' + reason.result.error.message)
		})
	}

	useEffect(()=>{
		console.log("useEffect çalıştı")
		// Loads the JavaScript client library and invokes `start` afterwards.
		gapi.load('client', start)
	}, [])

	return (
		<div className="App">
			<header className="App-header">
				<ul>
					{posts.map(post => <li key={post.id}>{post.title} | {new Date(post.updated).toLocaleString()}</li>)}
				</ul>
			</header>
		</div>
	);
}

export default App;
