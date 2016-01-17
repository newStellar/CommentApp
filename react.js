

var Comment = React.createClass({
    rawMarkup: function(){
        var rawMarkup = marked( this.props.children.toString(), {santize:true} );
        return { __html: rawMarkup };

    },
    render: function(){
        return(
            <div className = "comment">
                <h2 className= "commentAuthor"> {this.props.author}</h2>
                <span dangerouslySetInnerHTML = {this.rawMarkup()} />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function(){

        var commentNodes = this.props.data.map(function(comment){
            return (

                <Comment author= {comment.name} key = {comment.id}>
                    {comment.msg}
                </Comment>
            );
        });

        return(
            <div className = "commentList">
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState :function(){
        return {author: '', text: ''};
    },
    handleAuthorChange :function(e){
        console.log("okay");
        this.setState({author: e.target.value});
    },
    handleTextChange:function(e){

        this.setState({ text: e.target.value});
    },
    handleSubmit:function(e)
    {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if(!text || !author)return;

        this.props.onCommentSubmit({name: author, msg: text });
        this.setState({author:'', text:''});
    },
    render:function() {
        return (
            <form className = "commentForm" >
                <input  type = "text"
                        placeholder = "Your name"
                        value= {this.state.author}
                        onChange = {this.handleAuthorChange} />

                <input  type = "text"
                        placeholder = "Your Comment"
                        value = {this.state.text}
                        onChange = {this.handleTextChange} />

                <input  type = "submit" onClick = {this.handleSubmit}/>
            </form>
        );
    }
});

var CommentBox = React.createClass({

    handleCommentSubmit:function(comment)
    {
        var tmp = this.state.data;
        comment.id = this.state.data[tmp.length].id;
        tmp.push(comment);
        var res = {
            cmd  : "insertData",
            data : comment
        };
        //console.log(JSON.stringify(res));

        $.ajax({
            url      : this.props.url,
            dataType : "json",
            type     : "POST",
            data     : JSON.stringify(res),

            success  :function(e){
                console.log(e);

            }.bind(this),
            error:function(error){

            }.bind(this)
        });

        this.setState({data:tmp});
        //console.log(JSON.stringify(this.state.data));
    },

    loadCommentsFromServer:function(){
        var command = {
                cmd : "load"
        };
        $.ajax({
            url      : this.props.url,
            dataType : 'json',
            cache    : false, 
            data     : JSON.stringify(command),
            success  :function(data){

                //console.log(JSON.stringify(data));
                //var data = JSON.parse(JSON.stringify(data));

                this.setState({data:data});
                console.log(JSON.toString(data));

            }.bind(this),
            error:function(error){
                console.error(this.props.url, status, error.toString());
            }.bind(this)
        });
    },

    componentDidMount:function(){
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer,this.props.pollInterval);
    },

    getInitialState:function(){
        return {data:[]};
    },
    render: function() {
        return (
            <div className="commentBox">
                <h2> Comments </h2>
                <CommentList data = {this.state.data} />
                <CommentForm  onCommentSubmit= {this.handleCommentSubmit}/>
            </div>
        );
    }
});


ReactDOM.render(
     <CommentBox url = "comments.json" pollInterval = {2000} />,
     document.getElementById('content')
);
