require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

var imageDatas = require('../data/imageData.json');

//获取区间内随机值
function	getRangeRandom(low,high){
		return Math.ceil(Math.random()*(high-low)+low);
	}

//获取0-30°之间任意正负值
function get30DegreeRandom(){
	return getRangeRandom(-30,30);
}

imageDatas = (function(imageDatas){
	for (var i = 0,j=imageDatas.length ;i < j; i++) {
		var singleID = imageDatas[i];
		singleID.imgUrl =
		require('../images/'+imageDatas[i].filename);
		imageDatas[i] =singleID;
	}
	return imageDatas;
})(imageDatas);

class ImgFigure extends React.Component{
	handleClick(e){
		this.props.inverse();
		e.stopPropagation();
		e.preventDefault();

	}


	render(){
		var styleObj = {};

	  	if(this.props.arrange.pos)
	  	{
	  		styleObj = this.props.arrange.pos;
	  	}

		if(this.props.arrange.rotate)
	  	{
	  		(['-moz-','-ms-','-webkit-','']).forEach(function(value){
	  			styleObj.transform = 'rotate(' + this.props.arrange.rotate
	  			+ 'deg)';
	  		}.bind(this));
	  		
	  		
	  	}

	  	var imgFigureClassName = 'img-figure';
	  	imgFigureClassName += this.props.arrange.isInverse ? " is-inverse"
	  		:"";


		return(
			<figure className='img-figure' style={styleObj}
			onClick={this.handleClick}>
				<img src={this.props.data.imgUrl} 
				alt={this.props.data.title}/>
				<figcaption className='fig-caption'>
					<h2 className="img-title">&nbsp;{this.props.data.title}</h2>
					
				</figcaption>

				<div className="img-back" onClick={this.handleClick}>
						<p>{this.props.data.desc}</p>
					</div>
			</figure>
			);
	}
}


//let yeomanImage = require('../images/Tulips.jpg');

class AppComponent extends React.Component {

	constructor(props){
		super(props);
		this.state = {imgsArray:[]};
		this.Constant =
		{
			centerPos:{
				left:0,
				right:0
			},

			//图片横向浮动范围
			hPosRange:{
				leftSex:[0,0],
				rightSex:[0,0],
				y:[0,0]
			},
			//图片纵向浮动范围
			vPosRange:{
				X:[0,0],
				topY:[0,0]
			}

		};
	}

  	
	inverse(index){
		return function(){
			var imgArrangeArr = this.state.imgsArray;
			imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
			this.setState(
			{
				imgsArray:imgArrangeArr
			})
		}
	}
	/*
	*@param centerIndex,指定重新排布哪个图片
	*/
	rearange(centerIndex){
		var imgsArray = this.state.imgsArray,
		Constant = this.Constant,
		centerPos = Constant.centerPos,
		vPosRange = Constant.vPosRange,
		hPosRange = Constant.hPosRange,
		hPosRangeLeftSecX = hPosRange.leftSex,
		hPosRangeRightSecX = hPosRange.rightSex,
		hPosRangeY = hPosRange.y,
		vPosRangeTopY = vPosRange.topY,
		vPosRangeX = vPosRange.X;

		var imgsTopArray = [];
		var topImgNum = Math.ceil(Math.random()*2),
		topImgSpliceIndex = 0,
		imgACArr = imgsArray.splice(centerIndex,1);

		imgACArr[0].pos = centerPos;

		//居中的centerIndex不需要旋转
		imgACArr[0].rotate = 0;

		console.log(imgACArr[0].pos);

		topImgSpliceIndex = Math.ceil
		(Math.random()*imgsArray.length - topImgNum);

		imgsTopArray = imgsArray.splice(topImgSpliceIndex,topImgNum);

//布局上侧图片
		imgsTopArray.forEach(function(value,index){
			imgsTopArray[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
				},
				rotate:get30DegreeRandom()
			}
		});

		//布局左右两侧图片
		for (var i = 0, j=imgsArray.length,k=j/2; i < j; i++) {
			var hPosRangeLORX = null;
			
			if(i<k){
				hPosRangeLORX = hPosRangeLeftSecX;
			}
			else
			{
				hPosRangeLORX = hPosRangeRightSecX;
			}

			imgsArray[i] = {
				pos:{
					top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
					left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
				},
				rotate:get30DegreeRandom()
				
			}
		}

		if(imgsTopArray && imgsTopArray[0]){
			imgsArray.splice(topImgSpliceIndex,0,imgsTopArray[0])
		}
		imgsArray.splice(centerIndex,0,imgACArr[0]);

		this.setState({
			imgsArray: imgsArray
		});
	}




	componentDidMount(){
		//首先拿到舞台的大小
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
		  stageWidth = stageDOM.scrollWidth,
		  stageHeight = stageDOM.scrollHeight,
		  halfStageWidth = Math.ceil(stageWidth/2),
		  halfStageHeight = Math.ceil(stageHeight/2);
		  console.log(stageWidth);
		  console.log(stageHeight);
		  console.log(halfStageWidth);
		  console.log(halfStageHeight);

		  var ImageFigureDOM = ReactDOM.findDOMNode(this.refs.ImgFigure0),
		  imgWidth = ImageFigureDOM.scrollWidth,
		  imgHeight = ImageFigureDOM.scrollHeight,
		  hfImgWidth = Math.ceil(imgWidth/2),
		  hfImgHeight = Math.ceil(imgHeight/2);

		  console.log(hfImgWidth);
		  console.log(hfImgHeight);


		  //计算图片中心点的位置
		  this.Constant.centerPos = {
		  	left: halfStageWidth - hfImgWidth,
		  	top: halfStageHeight - hfImgHeight
		  };

		  //计算左侧右侧图片排布取值范围
		  this.Constant.hPosRange.leftSex[0] = -hfImgWidth;
		  this.Constant.hPosRange.leftSex[1] = halfStageWidth - hfImgWidth*3;
		  this.Constant.hPosRange.rightSex[0] = halfStageWidth + hfImgWidth;
		  this.Constant.hPosRange.rightSex[1] = stageWidth - hfImgWidth;

		  this.Constant.hPosRange.y[0] = -hfImgHeight;
		  this.Constant.hPosRange.y[1] = stageHeight - hfImgHeight;

		  //计算上侧图片取值范围
		  this.Constant.vPosRange.topY[0] = -hfImgHeight;
		  this.Constant.vPosRange.topY[1] = halfStageHeight - hfImgHeight*3;
		  this.Constant.vPosRange.X[0] = halfStageWidth - hfImgWidth;
		  this.Constant.vPosRange.X[1] = halfStageWidth;


		  this.rearange(0);



	}

	// getInitialState(){
	// 	return {
	// 		imgsArray:[
	// 		pos:{
	// 			left:'0',
	// 			top:'0'
	// 		}
	// 		]
	// 	};
	// }

  render() {


  	var controllerUnits = [],
  		imgFigures = [];

  	

  	imageDatas.forEach(function(value ,index){

  		if(!this.state.imgsArray[index]){
  			this.state.imgsArray[index] = {
  				pos:{
  					top:0,
  					left:0
  				},
  				rotate:0,
  				isInverse:false
  			}
  		}
  		imgFigures.push(<ImgFigure className="img-figure"
  			key={value.filename} data={value} ref={'ImgFigure' + index}
  			arrange = {this.state.imgsArray[index]}
  			inverse = {this.inverse(index)}/>);
  	}.bind(this));

    return (
    	<section className="stage" ref="stage">
    		<section className='imgSec'>
    			{imgFigures}
    		</section>
    		<nav className='ctrl-nav'>
    			{controllerUnits}
    		</nav>
    	</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
