//跨浏览器处理XML


//IE9.0之前的版本创建xml文档
function createXMLFromIe(){
	if(typeof arguments.callee.activeXString!="string"){
		var version = ["MSXML2.DOMDocument.6.0","MSXML2.DOMDocument.3.0","MSXML2.DOMDocument"],
			i;
		for(i in version){//遍历每一个库，寻找能支持的最高级的库，并且创建对象
			try{
				new ActiveXObject(version[i]);
				arguments.callee.activeXString = version[i];
				break;
			}catch(e){
				//跳过
			}
		}
		return new ActiveXObject(arguments.callee.activeXString);
	}
}

//解析XML文档为DOM文档
function parseXML(xml){
	var xmlDOM = null;
	if(typeof DOMParser!="undefined"){//兼容ie9+ safari Chrome opera
		var parser = new DOMParser();
		xmlDOM = parser.parseFromString(xml,"text/xml");
		var error = xmlDOM.getElementsByTagName("parsererror");
		if(error.length){
			throw new Error("解析出错！"+error.textContent);
		}
	}else if(typeof ActiveXObject!="undefined"){//兼容ie9.0以下
		xmlDOM = createXMLFromIe();
		xmlDOM.loadXML(xml);
		if(xmlDOM.parseError.errorCode!=0){
			throw new Error("解析出现错误："+xmlDOM.reason+"\n:"+xmlDOM.line+"\n:"+xmlDOM.linepos);
		}
	}
	else{
		throw new Error("no XML parser available!");
	}
	return xmlDOM;
}

//序列化xmldom文档
function serializeXML(xmldom){
    if(typeof XMLSerializer!="undefined"){//兼容ie9+ safari Chrome opera
        var serializer = new XMLSerializer();
        return (serializer.serializeToString(xmldom));
    }
    else if((typeof xmldom.xml)!=undefined){//兼容ie9.0以下
        return (xmldom.xml);
    }
    else{
        throw new Error("serialize XML Dom failed!");
    }
}
	
	
// ie9.0之前 safari Chrome opera下创建空白的XML文档
// document.implementation.createDocument("","root",null);

//测试
try{
	xmlDOM = parseXML("<root>\n\t<user>lee</user>\n\t<age>100</age>\n</root>");
	alert(serializeXML(xmlDOM));
}catch(e){
	throw new Error(e.message);
}