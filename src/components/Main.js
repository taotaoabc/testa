require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

var imageDatas = require('../data/imageData.json');

imageDatas = (function(imageDatas){
	for (var i = 0,j=imageDatas.length ;i < j; i++) {
		var singleID = imageDatas[i];
		singleID.imgUrl =
		require('../images/'+imageDatas[i].filename);
		imageDatas[i] =singleID;
	}
	return imageDatas;
})(imageDatas);

class imgFigure extends React.Component{
	render(){
		return(
			<figure>
				<img src={this.props.data.imgUrl}
				alt={this.props.data.title}/>
				<figcaption>
					<h2>{this.props.data.title}</h2>
				</figcaption>
			</figure>
			);
	}
}


//let yeomanImage = require('../images/Tulips.jpg');

class AppComponent extends React.Component {
  render() {
  	var controllerUnits = [],
  		imgFigures = [];

  	imageDatas.forEach(function(value){
  		imgFigures.push(<imgFigure key={value.filename} data={value}/>);
  	});

    return (
    	<section className="stage">
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
