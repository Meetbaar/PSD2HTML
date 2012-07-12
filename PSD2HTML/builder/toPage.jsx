// @include "../lib/json2-min.jsx"
// @include "../lib/psd.jsx"
// @include "../lib/page.jsx"
// @include "../lib/i18n.jsx"

//alert(JSON.stringify(APP.OPTION)); //设置面板的设置结果
(function(){
	var appOp = APP.OPTION;

	var psd = new PSD({output:appOp.output});
	var pathReg = /([^\x00-\xff]+)/g,
		res = pathReg.exec(APP.OPTION.output) || pathReg.exec(psd.doc.name);
	
	if(res){
		alert(i18n("pathCannotIncludeDoubleBytes")+':['+res[1]+']');
		return;
	}
	psd.parseLayers(null, null, function(layer){
		if(layer.kind != LayerKind.TEXT && !psd.linkReg.test(layer.name) && !psd.imgReg.test(layer.name)) return true;
	});

	//图片输出设置
	var option = new ExportOptionsSaveForWeb();

	if(appOp.image.extension === 'jpg'){
		option.format = SaveDocumentType.JPEG;
		option.quality = appOp.image.quality;
	}else if(appOp.image.extension === 'png'){
		option.format = SaveDocumentType.PNG;
		option.PNG8 = appOp.image.png8;
	}

	var data = null;
	if(APP.OPTION.builder != "normal"){
		data = psd.getTextLayersAndSlices(option,psd.getHeight());
	}else{
	   data = psd.getTextLayersAndSlices(option);
	}
	new page.init(data,{
		'width':psd.getWidth(),
		'height':psd.getHeight(),
		'encode':"gb2312",
		'builder':APP.OPTION.builder,
		'path':psd.dir + "/index.html",
		'exportConfig':option
	},psd);
	//psd.reset();
	psd = null;
})();

