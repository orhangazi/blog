//import ReactDOMServer from "react-dom/server"
import { useEffect, useState } from "react"
import HtmlToReactParser from "html-to-react/lib/parser"
import { useLoaderData, useLocation } from "react-router-dom"
import { gapi } from "gapi-script"
import ProfileImage from "../images/profile-image.jpg"
import { DiscussionEmbed, Recommendations } from 'disqus-react';

export async function loader ({ params }) {
	return params
}

var PostCard = () => {

	const [post, setPost] = useState(null)
	const params = useLoaderData()

	//state hali hazırdaki blog post objesidir. Eğer yoksa post id ile yenisi çekilir.
	let { state } = useLocation()
	console.log("PostCard state: ", state)
		
	useEffect(() => {
		if (state == null && params?.postId != null) {

			const start = () => {
				// Initializes the client with the API key and the Translate API.
				gapi.client.init({
					'apiKey': 'AIzaSyCshUc_FoswyIEZFh8ymyXPbkOy9oLo2Vk',
					'discoveryDocs': ['https://blogger.googleapis.com/$discovery/rest?version=v3'],
				}).then(function () {
					// Executes an API request, and returns a Promise.
					// The method name `language.translations.list` comes from the API discovery.
					//console.log("gapi.client: ", gapi.client)
					//console.log("gapi.client.blogger: ", gapi.client.blogger.posts.list({ blogId: "5572292692142810577", maxResults: 10 }))
					console.log("gapi.client.blogger.posts.get: ", gapi.client.blogger.posts.get({ blogId: "5572292692142810577", postId: params.postId }))

					//console.log("gapi.client.blogger.blogUserInfos: ", gapi.client.blogger.blogUserInfos.get({ blogId: "5572292692142810577"}))

					return gapi.client.blogger.posts.get({ blogId: "5572292692142810577", postId: params.postId })
				}).then(function (response) {
					console.log("sonuç: ", response.result)
					setPost(response.result)
				}, function (reason) {
					console.log('Error: ' + reason.result.error.message)
				})
			}

			console.log("useEffect çalıştı")
			// Loads the JavaScript client library and invokes `start` afterwards.
			gapi.load('client', start)
		} else {
			console.log("else state: ", state)
			setPost(state)
		}
	}, [])

	//if (post==null) return

	console.log("params: ", params)
	const contentHtml = post?.content

	const htmlToReactParser = new HtmlToReactParser()
	const content = htmlToReactParser.parse(contentHtml)
	const labels = post?.labels
	let postId = post?.id
	console.log("PostCard postId: ", postId)
	let pageUrl = `https://orhangazi.github.io/blog/post/${postId}`
	//original blogger url
	let originalBloggerOriginalUrl = post?.url
	const postTitle = post?.title
	const authorName = post?.author.displayName
	const updatedDate = new Date(post?.updated).toLocaleString("tr-TR", { weekday: 'long', year:"numeric", month:"long", day:"2-digit", hour:"2-digit", minute: "2-digit" })

	return (<div className="container">
				<div className="row mt-3" style={{justifyContent:"space-between"}}>
					<div className="col-md-auto">
						<h4><a href="https://orhangazi.github.io">Orhan Gazi Kılıç</a></h4>
					</div>
					<div className="col-md-auto">
						<h4><a href="https://orhangazi.github.io/blog">Ana Sayfa</a></h4>
					</div>
				</div>
				<div className="row mt-3">
					<div className="col-md-8">
						<div className="card">
							<div className="card-body">
								{/* header */}
								<div className="row" style={{ justifyContent: "space-between" }}>
									<div className="col-md-auto">
										<h4>{postTitle}</h4>
										<span>Yazar: <a href="https://orhangazi.github.io">{authorName}</a> — {updatedDate}</span>
									</div>
									<div className="col-md-auto">
										<span>...</span>
									</div>
								</div>
								<hr />
								{/* body */}
								{content}
								<hr />
								{/* footer */}
								<strong>Etiket: </strong>
								{labels?.length>0 && labels.map((label, index) => {
									var comma = labels.length === index + 1 ? "" : ", "
									return <span key={index.toString()}><a href="#">{label}</a>{comma}</span>
								})}
							</div>
						</div>
					</div>
					<div className="col-md-4">
						<div className="card">
							<img src={ProfileImage} className="card-img-top" alt="Orhan Gazi Kılıç - Software in Turkey" />
							<div className="card-body">
								<span>2017-2018 yılları arasında Gazi Yazılım şirketini kurup yönettim, 2017 Ağustos ayından 2019 Eylül ayına kadar Beyoğlu Kaza Danışmanlık şirketinin kurumsal erp-crm-hrm yazılımının geliştirilmesinde yazılım uzmanı olarak çalıştım. Php, mysql, java, spring framework, react ve react native, redux, JavaScript... <a href="https://orhangazi.github.io/">devamını oku</a>
								</span>
							</div>
						</div>
						<div className="card mt-3">
							<div className="card-body">
								<DiscussionEmbed
									shortname='www-orhangazi-info'
									config={
										{
											url: pageUrl,
											//url: originalBloggerOriginalUrl,
											identifier: postId,
											title: postTitle,
											//language: 'zh_TW' //e.g. for Traditional Chinese (Taiwan)
										}
									}
								/>
							</div>
						</div>
						<div className="card mt-3">
							<div className="card-body">
								<Recommendations
									shortname='www-orhangazi-info'
									config={
										{
											url: pageUrl,
											//url: originalBloggerOriginalUrl,
											identifier: postId,
											title: postTitle,
											//language: 'zh_TW' //e.g. for Traditional Chinese (Taiwan)
										}
									}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>)
}

export default PostCard