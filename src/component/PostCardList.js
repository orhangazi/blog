//import ReactDOMServer from "react-dom/server"
import HtmlToReactParser from "html-to-react/lib/parser"
import {Link} from "react-router-dom"

var PostCardList = ({post}) => {
	console.log("PostCardList post: ", post)

	const contentSummaryHtml = post.content.substring(0,500)+"..."

	const htmlToReactParser = new HtmlToReactParser()
	const contentSummary = htmlToReactParser.parse(contentSummaryHtml)
	const labels = post.labels
	let postId = post.id
	let linkString = `post/${postId}`

	return (<div className="row mt-3">
			<div className="col-md-8">
				<div className="card">
					<div className="card-body">
						{/* header */}
						<h4>
						<Link to={linkString} state={post} >{post.title}</Link>
						</h4>
						<hr />
						{/* body */}
						{contentSummary} <strong><Link to={linkString} state={post} >devamını gör</Link></strong>
						<hr />
						{/* footer */}
						<strong>Etiketler: </strong>
						{labels.map((label, index) => {
							var comma = labels.length === index + 1 ? "" : ", "
							return <span><a href="#">{label}</a>{comma}</span>
						})}
					</div>
				</div>
			</div>
		</div>)
}

export default PostCardList