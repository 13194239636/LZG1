

//创建xhr对象，兼容各种浏览器
function createXHR(){
	if(typeof XMLHttpRequest!="undefined"){                                  //IE7以上
		return new XMLHttpRequest();
	}
	else if(typeof ActiveXObject!="underfined"){							//IE7以下
		var version = ["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],
			i, len;
		for(i=0,len=version.length;i<len;i++){	
			try{
					new ActiveXObject(version[i]);
					arguments.callee.activeXString = version[i];
				}catch(e){
					//跳过
				}
		}
		return new ActiveXObject(arguments.callee.activeXString);
	}
	else{
		throw new Error("您的浏览器不支持ajax！");
	}
}


//封装函数
function ajax(obj){	

	var xhr = createXHR();												//创建xhr对象
	obj.data = serialize(obj.data);									
	obj.url+="?ranNum="+Math.random();									//解决缓存问题					
	obj.url += (obj.url.indexOf("?") == -1 ? "?" : "&");
	
	xhr.onreadystatechange=function(){
		callback(xhr);
	}
	if(obj.method == "get"){				
		obj.url += obj.data;
		alert(obj.url);
	    xhr.open(obj.method,obj.url,obj.async);
		xhr.send(null);
	}
	if(obj.method == "post"){
		alert(obj.url);
		xhr.open(obj.method,obj.url,obj.async);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.send(obj.data);
	}
}


function callback(xhr){
	if(xhr.readyState == 4){
		if(xhr.status>=200&&xhr.status<=300||xhr.status==304){
			alert(xhr.responseText);
		}
		else{
			alert("响应失败"+ xhr.status + xhr.statusText);
		}
	}
}


//序列化对象为字符串数组
function serialize(data){					
	var result = [];
	for(var i in data){
		result.push(encodeURIComponent(i)+"="+encodeURIComponent(data[i]));
	}
	return result.join("&");
}

//测试
ajax({
	"method" : "get",
	"url" : "demo.php",
	"async" : "true",
	"data" : {
		"name" : "lee",
		"age" : "100"
	}
});



//get方式请求
/* 	var xhr = createXHR();
	xhr.open("get","demo.php",true);//准备请求
	xhr.send(null);//发送请求
	xhr.onreadystatechange=function(){//当XHR对象的readyState改变时发生
		if(xhr.readyState==4){//响应完成时
		if(xhr.status>=200&&xhr.status<=300||xhr.status==304){//响应成功条件
			alert(xhr.responseText);
		}
		else{
			alert("响应失败"+xhr.status+xhr.statusText);
		}
	}
	} */
	
//post方式请求
/* var xhr = createXHR();
	xhr.open("get","demo.php",true);
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhr.send("name=lee&age=100");
	xhr.onreadystatechange = function(){
		if(xhr.readyState==4){
			if(xhr.status>=200&&xhr.status<=300||xhr.status==304){
				alert(xhr.responseText);
			}
			else{
				alert("响应失败"+xhr.status+xhr.statusText);
			}
		}
	} */
