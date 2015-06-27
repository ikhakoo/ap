// в этой переменной хранится ссылка на экземпляр XMLHttpRequest:
var xmlHttp = createXmlHttpRequestObject();

// создать экземпляр XMLHttpRequest:
function createXmlHttpRequestObject()
{
	// переменная для хранения ссылки на объект XMLHttpRequest:
	var xmlHttp;
	
	try
	{
		// эта часть кода должна работать во всех браузерах, за исключением IE_6 и более старых его версий
		// попытаться создать объект XMLHttpRequest:
		xmlHttp = new XMLHttpRequest();
	}
	catch(e)
	{
		// предпологается что в качестве браузера используется IE_6 или более старая его версия
		var XmlHttpVersions = new Array('MSXML2.XMLHTTP.6.0',
										'MSXML2.XMLHTTP.5.0',
										'MSXML2.XMLHTTP.4.0',
										'MSXML2.XMLHTTP.3.0',
										'MSXML2.XMLHTTP',
										'Microsoft.XMLHTTP');
										
		// пытаться создать объект наиболее свежей версии пока одна из попыток не увенчается успехом
		for(var i=0; i<XmlHttpVersions.lenght && !xmlHttp; i++)
		{
			try
			{
				// попытаться создать объект XMLHttpRequest:
				xmlHttp = new ActiveXObject("XmlHttpVersions[i]");
			}
			catch(e) {} // игнорировать возможные ошибки.
		}
	}
	
	// вернуть созданый объект или вывести сообщение об ошибке
	if(!xmlHttp)
		alert("Failed to create object XMLHttpRequest.");
	else
		return xmlHttp;
}


//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// вызвать для чтения файл с сервера:
function process(id, size, color, quantity)
{
	// продолжать только если в xmlHttp не пустая ссылка:
	if(xmlHttp)
	{
		// попытаться установить соединение с сервером:
		try
		{
			var param = 'id='+id+'&size='+size+'&color='+color+'&quantity='+quantity;
                        
            // инициировать асинхронный запрос HTTP
			//xmlHttp.open("GET", "js/ajax.php?" + param, true);
			xmlHttp.open("GET", "js/ajax.php?" + param, true);
			xmlHttp.onreadystatechange = handleRequestStateChange;
			xmlHttp.send(null);
		}
		// вывести сообщение об ошибке в случае неудачи:
		catch(e)
		{
			alert("Can not connect with server:\n" + e.toString());
		}
	}
}

// эта функция вызывается при изменении состояния запроса HTTP:
function handleRequestStateChange()
{
// если readyState = 4, мы можем прочитать ответ сервера:
	if(xmlHttp.readyState == 4)
	{
		// продолжать, только если статус HTTP равен "ОК"
		
		//alert(xmlHttp.status);
		if(xmlHttp.status==200)
		{
			
			try
			{
				// обработать ответ, полученый от сервера:
				handleServerResponse();
				
			}
			catch(e)
			{
				// вывести сообщение об ошибке:
				alert("Failed to read response: " + e.toString());
			}
		}
		/*else
		{
			// вывести сообщение о состоянии:
			alert("There were problems during the data acquisition:\n" + xmlHttp.statusText);
		}*/
	}	
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// обработать ответ получены от сервера:
function handleServerResponse()
{
	// прочитать сообщение полученое от сервера:
	var xmlResponse = xmlHttp.responseXML;
	
	// предотвратить потенциально возможные ошибки  в IE и Opera:
	if(!xmlResponse || !xmlResponse.documentElement)
		throw("Invalid XML structure:\n" + xmlHttp.responseText);
		
	// предотвратить потенциально возможные ошибки  в Firefox:
	var rootNodeName = xmlResponse.documentElement.nodeName;
	if(rootNodeName == "parsererror") throw("Invalid XML structure:\n" + xmlHttp.responseText);
	
	// получить ссылку на корневой элемент XML:
	xmlRoot = xmlResponse.documentElement;
	
        // поверить коректность принятого документа XML
        if (rootNodeName != "response" || !xmlRoot.firstChild)
            throw ('Invalid format of the XML document:\n' + xmlHttp.responseText);
            
        // значение, которое требуется отобразить, находится
        // в дочернем элементе корневого элемента <response>
        responseText = xmlRoot.firstChild.data;
	
	// получить ссылку на элемент div:
	myDiv = document.getElementById("tovarov");
	
	// вывести полученый код HTML:
	myDiv.innerHTML = responseText;
	alert('Item has been added to cart');
}



