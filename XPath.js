 

// ie9.0之前 safari Chrome opera下创建空白的XML文档
// document.implementation.createDocument("","root",null);

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
      
//DOM3级下的XPath
/* 	xmlDOM = parseXML("<root><user>lee</user><user>rosh</user><age>100</age></root>");
	var result = xmlDOM.evaluate("root/user",xmlDOM,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);
	if(result !== null){
		alert(result.singleNodeValue); */
/* 	xmlDOM = parseXML("<root><user>lee</user><user>rosh</user><age>100</age></root>");
	var result = xmlDOM.evaluate("root/user",xmlDOM,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null);
	alert(1);
	if(result !== null){
		var element = result.iterateNext();
		while(element){
			alert(element.tagName);
			element = result.iterateNext();
		}
	} */
		

//IE9以前的XPath
/* 	xmlDOM = parseXML("<root><user>lee</user><user>rosh</user><age>100</age></root>");
	var result = xmlDOM.selectSingleNode("root/user");
	alert(result);
	alert(result.xml); */
/* 	xmlDOM = parseXML("<root><user>lee</user><user>rosh</user><age>100</age></root>");
	var result = xmlDOM.selectNodes("root/user");
	alert(result.length);
	alert(result[1].xml); */

//跨浏览器处理XPath
//获取一个节点集合
function selectNodes(xmldom,xpath){
	var result = [];
	if(document.implementation.hasFeature("XPath","3.0")){
		//解决bug，多节点的时候，IE下和DOM3级下的索引不一样，分别从0和1开始。让DOM3级的索引减一。
		var patten = /\[(\d+)\]/;
		var flag = xpath.match(patten);
		var num = 0;
		if(flag!==null){
			num = parseInt(RegExp.$1)+1;
			xpath = xpath.replace(patten,"["+num+"]");
		}
		var result = xmlDOM.evaluate(xpath,xmldom,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null);
		if(result !== null){
			var i=0,element =[];
			element.push(result.iterateNext());
			while(element[i++]){
				element.push(result.iterateNext());
			}
			element.pop();
		return element;
		}
	}else if(typeof xmldom.selectNodes!="undefined"){
		return xmldom.selectNodes(xpath);
	}
	else{
		throw new Error("你的浏览器无法使用XPath！");
	}
}

//获取单一节点
function selectSingleNode(xmldom,xpath){
	var result = null;
	if(document.implementation.hasFeature("XPath","3.0")){
		result = xmldom.evaluate(xpath,xmldom,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);
		if(result !== null){
			return result;
		}
	}else if(typeof xmldom.selectSingleNode!="undefined"){
		return xmldom.selectSingleNode(xpath);
	}
	else{
		throw new Error("你的浏览器无法使用XPath！");
	}

}

//测试
try{
	xmlDOM = parseXML("<root><user>lee</user><user>rosh</user><age>100</age></root>");
	var result = selectNodes(xmlDOM,"root/user[1]");
}catch(e){
	throw new Error(e.message);
}