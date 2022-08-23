import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchArticlesById, patchVotesById } from "../api functions/api";

const ArticleSingle = () => {

    const [article, setArticle] = useState({})
    const [optimisticVotes, setOptimisticVotes] = useState(0);
    const [voteError, setVoteError] = useState(false);

    let {pathname} = useLocation();
    const regex = /\d+$/gi;
    const article_id = Number(pathname.match(regex))

    useEffect(()=>{
        fetchArticlesById(article_id).then((articleFromApiById) => {
            setArticle(articleFromApiById.data.article)
        })
    }, [optimisticVotes])

    function increaseVotes(article_id, vote_delta, e) {
        e.preventDefault();
        setVoteError(false);
            patchVotesById(article_id, vote_delta).then(() => {
                setOptimisticVotes((currOptimisticVotes) => {
                    console.log(voteError);
                    return currOptimisticVotes + 1;
                })
            }).catch(()=>{setOptimisticVotes((currOptimisticVotes) => {
                setVoteError(true);
                return currOptimisticVotes - 1;
            })})
    }

    return (
        <>
        <div className="article--info">
            <h3 className="article--title">{article.title}</h3>
            <p className="article--body">{article.body}</p>
            <p className="article--author">Author: {article.author}</p>
            <p className="article--topic">Topic: {article.topic}</p>
            <p className="article--created_at">Posted: {article.created_at}</p>
            <div className="article--votes">
                <p className="article--votes_indicator">Votes: {article.votes}</p>
                <button className="article--votes_button" onClick={(e)=>{increaseVotes(article.article_id, 1, e)}}>Upvote!</button>
                <button className="article--votes_button" onClick={(e)=>{increaseVotes(article.article_id, -1, e)}}>Downvote!</button>
                <p className={voteError === true ? 'votes--error_show' : 'votes--error_hide'}>Please refresh and try again!</p>
            </div>
            <p className="article--comment_count">Comments: {article.comment_count}</p>

        </div>
        </>
    )
}

export default ArticleSingle;