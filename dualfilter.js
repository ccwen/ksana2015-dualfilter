var React=require("react");
var ReactList=require("react-list");
var E=React.createElement;
var PT=React.PropTypes;

var styles={
  item:{cursor:"pointer"}
}
var DualFilter=React.createClass({
  getInitialState:function(){
    return {tofind1:this.props.tofind1||"",tofind2:this.props.tofind2||""};
  }
  ,componentDidMount:function() {
    if (this.state.tofind1||this.state.tofind2) {
      this.preparesearch();
    }
  }
  ,getDefaultProps:function(){
    return {items:[]};
  }
  ,propTypes:{
    items:PT.array.isRequired
    ,onFilter:PT.func.isRequired
    ,onItemClick:PT.func.isRequired
    ,inputstyle:PT.object
    ,inputclass:PT.oneOfType([PT.string, PT.func])

  }
  ,renderHit:function(hit) {
    return E("span",{className:"hl0"},hit);
  }
  ,itemClick:function(e) {
    ele=e.target;
    if (!(ele.dataset &&ele.dataset.idx)) ele=ele.parentElement;
    var idx=parseInt(ele.dataset.idx);
    this.props.onItemClick(idx);
  }
  ,renderItem:function(i,idx){
    var hit=(this.props.items[i].hits||[]).length||"";
    var vpos=this.props.items[i].vpos||0;
    return E("div",{key:idx,style:styles.item
      ,"data-vpos":vpos
      ,"data-idx":idx
      ,"data-hit":hit
      ,onClick:this.itemClick},this.props.items[i].text,this.renderHit.call(this,hit));
  }
  ,preparesearch:function() {
    clearTimeout(this.timer);
    this.timer=setTimeout(function(){
      this.props.onFilter(this.state.tofind1,this.state.tofind2);
    }.bind(this),500);    
  }
  ,onChange1:function(e) {
    this.setState({tofind1:e.target.value});
    this.preparesearch();
  }
  ,onChange2:function(e) {
    this.setState({tofind2:e.target.value});
    this.preparesearch();
  }
	,render:function() {
    var Input=this.props.inputclass||"input";
		return E("div",null,
      E(Input,{placeholder:"regular expression",style:this.props.inputstyle,value:this.state.tofind1,onChange:this.onChange1})
      ,E("br")
      ,E(Input,{placeholder:"full text search",style:this.props.inputstyle,value:this.state.tofind2,onChange:this.onChange2})
      ,E("br")
      ,E("span",null,"match count:",this.props.items.length)
      ,E("br")
      ,E(ReactList,{itemRenderer:this.renderItem,length:this.props.items.length})
    )
	}
})
module.exports=DualFilter;