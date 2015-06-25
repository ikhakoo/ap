function ifBadBrowser (){
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf("opera") != -1 || ua.indexOf("msie") != -1)
	{
		$('.searchField').css({'background-image':'url(../img/bg_search_field.jpg)'});
		
		var windowWidth = $(window).width();
		var welcomeBgWidth = parseInt((windowWidth - 1250) / 2);
		$('.welcomeBg_1').css('width', welcomeBgWidth+'px');
		$('.welcomeBg_4').css('width', welcomeBgWidth+'px');
		
		$(window).bind ("resize", function (){
			ifBadBrowser ();
		});
	}
}

function effect(){
	$(".effect").bind("mouseover",function(){
        $(this).animate({opacity: 0.5},200,'',function(){
            $(this).animate({opacity: 1.0},200);
        });
    });
	$(".effect").css('cursor', 'pointer');
}

function dropMenu (){
	$('.dropMenuTd').hover(
		function(){
			var dropMenuTdId = $(this).attr('id');
			$('#'+dropMenuTdId+' > div > ul').slideDown(150);
			$('#'+dropMenuTdId+' > a').css('border-bottom', '7px #ffffff solid');
		},
		function(){
			var dropMenuTdId = $(this).attr('id');
			$('#'+dropMenuTdId+' > div > ul').slideUp(100);
			$('#'+dropMenuTdId+' > a').css('border-bottom', 'none');
		}					   
	);
}

function searchForm (){
	// отчистка поля
	$('#searchField').focus(
		function(){
			if($(this).val() == 'Product Search'){
				$(this).val('');
			}			
		}
	)
	
	// есле поле не заполнено возвращаем значение по умолчанию
	$('#searchField').blur(
		function(){
			if($(this).val() == ''){
				$(this).val('Product Search');
			}
		}
	)	
}

function newslettersForm (){
	$('#signUp').submit(
		function(eventObject) {
			//var signUpName = $.trim($('#signUpName').val());
			//var signUpCompany = $.trim($('#signUpCompany').val());
			var signUpEmail = $.trim($('#signUpEmail').val());
						
			//if(signUpName == '' || signUpCompany == '' || signUpEmail == ''){
				if(signUpEmail == ''){
				eventObject.preventDefault();
				//alert('You do not fill in all fields!');
				alert('Please enter valid email Id!');
			}
			/*else{
				alert("admin test");
				}*/
		}
	);	
}

function contactDisplay ()
{
	$('#contactLink').click(
		function (){
			$('#modalWindDiv').css('display', 'block');
			$('#contactsDiv').css('display', 'block');	
		}
	);
}

function contactDisplayNone ()
{
	$('#modalWindDiv').click(
		contactClose
	);
	
	$('#contactClose').click(
		contactClose
	);
}

function contactClose ()
{
	$('#modalWindDiv').css('display', 'none');
	$('#contactsDiv').css('display', 'none');	
}

function contactForm (){
	$('#contactForm').submit
	(
		function(eventObject) {
			var contactName = $.trim($('#contactName').val());
			var contactMail = $.trim($('#contactMail').val());
			var contactText = $.trim($('#contactText').val());
						
			if(contactName == '' || contactMail == '' || contactText == ''){
				eventObject.preventDefault();
				alert('You do not fill in all fields!');
			}
			else{
				alert('Thank you for your submission. We will contact you within 1 business day.');				
			}
		}
	);	
}

function addToCartFortSubmit (){
	$('#addToCartForm').submit(
		function(eventObject) {
			var idProduct = $('#idProduct').val();
			var sizeSelect = $('#sizeSelect').val();
				if (!sizeSelect) sizeSelect = 0;
			var colorSelect = $('#colorSelect').val();
				if (!colorSelect) colorSelect = 0;
			var quantitySelect = $('#quantitySelect').val();
			eventObject.preventDefault();
			process(idProduct, sizeSelect, colorSelect, quantitySelect);
		}
	);	
}

function loginDisplay ()
{
	$('.loginLink').click(
		function (){
			$('#modalWindDiv').css('display', 'block');
			$('#loginDiv').css('display', 'block');	
		}
	);
}

function loginDisplayNone ()
{
	$('#modalWindDiv').click(
		loginClose
	);
	
	$('#loginClose').click(
		loginClose
	);
}

function loginClose ()
{
	$('#modalWindDiv').css('display', 'none');
	$('#loginDiv').css('display', 'none');	
}

function selectCountry (countrySelectParam){
	var canada = '<option value="" selected="selected">-- SELECT PROVINCE --</option><option value="Alberta">Alberta</option><option value="British Columbia">British Columbia</option><option value="Manitoba">Manitoba</option><option value="New Brunswick">New Brunswick</option><option value="Newfoundland">Newfoundland</option><option value="Northwest Territories">Northwest Territories</option><option value="Nova Scotia">Nova Scotia</option><option value="Nunavut">Nunavut</option><option value="Ontario">Ontario</option><option value="Prince Edward Island">Prince Edward Island</option><option value="Quebec">Quebec</option><option value="Saskatchewan">Saskatchewan</option><option value="Yukon Territories">Yukon Territories</option><option value="Yukon Territory">Yukon Territory</option>';
	var usa = '<option value="Alabama">Alabama</option><option value="Alaska">Alaska</option><option value="Arizona">Arizona</option><option value="Arkansas">Arkansas</option><option value="California">California</option><option value="Colorado">Colorado</option><option value="Connecticut">Connecticut</option><option value="Delaware">Delaware</option><option value="District Of Columbia">District Of Columbia</option><option value="Florida">Florida</option><option value="Georgia">Georgia</option><option value="Hawaii">Hawaii</option><option value="Idaho">Idaho</option><option value="Illinois">Illinois</option><option value="Indiana">Indiana</option><option value="Iowa">Iowa</option><option value="Kansas">Kansas</option><option value="Kentucky">Kentucky</option><option value="Louisiana">Louisiana</option><option value="Maine">Maine</option><option value="Maryland">Maryland</option><option value="Massachusetts">Massachusetts</option><option value="Michigan">Michigan</option><option value="Minnesota">Minnesota</option><option value="Mississippi">Mississippi</option><option value="Missouri">Missouri</option><option value="Montana">Montana</option><option value="Nebraska">Nebraska</option><option value="Nevada">Nevada</option><option value="New Hampshire">New Hampshire</option><option value="New Jersey">New Jersey</option><option value="New Mexico">New Mexico</option><option value="New York">New York</option><option value="North Carolina">North Carolina</option><option value="North Dakota">North Dakota</option><option value="Ohio">Ohio</option><option value="Oklahoma">Oklahoma</option><option value="Oregon">Oregon</option><option value="Pennsylvania">Pennsylvania</option><option value="Rhode Island">Rhode Island</option><option value="South Carolina">South Carolina</option><option value="South Dakota">South Dakota</option><option value="Tennessee">Tennessee</option><option value="Texas">Texas</option><option value="Utah">Utah</option><option value="Vermont">Vermont</option><option value="Virginia">Virginia</option><option value="Washington">Washington</option><option value="West Virginia">West Virginia</option><option value="Wisconsin">Wisconsin</option><option value="Wyoming">Wyoming</option>';

	var selectedCountry = $('#country_'+countrySelectParam).val();
	if (selectedCountry == 'Canada'){
		$('#state_'+countrySelectParam).html(canada);
	}else if(selectedCountry == 'USA'){
		$('#state_'+countrySelectParam).html(usa);
	}
}

function selectCountryOrder (countrySelectParam){
	var canada = '<option value="" selected="selected">-- SELECT PROVINCE --</option><option value="Alberta">Alberta</option><option value="British Columbia">British Columbia</option><option value="Manitoba">Manitoba</option><option value="New Brunswick">New Brunswick</option><option value="Newfoundland">Newfoundland</option><option value="Northwest Territories">Northwest Territories</option><option value="Nova Scotia">Nova Scotia</option><option value="Nunavut">Nunavut</option><option value="Ontario">Ontario</option><option value="Prince Edward Island">Prince Edward Island</option><option value="Quebec">Quebec</option><option value="Saskatchewan">Saskatchewan</option><option value="Yukon Territories">Yukon Territories</option><option value="Yukon Territory">Yukon Territory</option>';
	var usa = '<option value="Alabama">Alabama</option><option value="Alaska">Alaska</option><option value="Arizona">Arizona</option><option value="Arkansas">Arkansas</option><option value="California">California</option><option value="Colorado">Colorado</option><option value="Connecticut">Connecticut</option><option value="Delaware">Delaware</option><option value="District Of Columbia">District Of Columbia</option><option value="Florida">Florida</option><option value="Georgia">Georgia</option><option value="Hawaii">Hawaii</option><option value="Idaho">Idaho</option><option value="Illinois">Illinois</option><option value="Indiana">Indiana</option><option value="Iowa">Iowa</option><option value="Kansas">Kansas</option><option value="Kentucky">Kentucky</option><option value="Louisiana">Louisiana</option><option value="Maine">Maine</option><option value="Maryland">Maryland</option><option value="Massachusetts">Massachusetts</option><option value="Michigan">Michigan</option><option value="Minnesota">Minnesota</option><option value="Mississippi">Mississippi</option><option value="Missouri">Missouri</option><option value="Montana">Montana</option><option value="Nebraska">Nebraska</option><option value="Nevada">Nevada</option><option value="New Hampshire">New Hampshire</option><option value="New Jersey">New Jersey</option><option value="New Mexico">New Mexico</option><option value="New York">New York</option><option value="North Carolina">North Carolina</option><option value="North Dakota">North Dakota</option><option value="Ohio">Ohio</option><option value="Oklahoma">Oklahoma</option><option value="Oregon">Oregon</option><option value="Pennsylvania">Pennsylvania</option><option value="Rhode Island">Rhode Island</option><option value="South Carolina">South Carolina</option><option value="South Dakota">South Dakota</option><option value="Tennessee">Tennessee</option><option value="Texas">Texas</option><option value="Utah">Utah</option><option value="Vermont">Vermont</option><option value="Virginia">Virginia</option><option value="Washington">Washington</option><option value="West Virginia">West Virginia</option><option value="Wisconsin">Wisconsin</option><option value="Wyoming">Wyoming</option>';

	var selectedCountry = $('#country_'+countrySelectParam).val();
	if (selectedCountry == 'Canada'){
		$('#state_'+countrySelectParam).html(canada);
	}else if(selectedCountry == 'USA'){
		$('#state_'+countrySelectParam).html(usa);
	}
	
	reHST();
}

function sameAsBilling (){
	if (document.getElementById('sameAsBillingCheckbox').checked == true){
		$('#address_s, #city_s, #country_s, #state_s, #zip_s').val('');
		selectCountry('s');
		document.getElementById('address_s').disabled = true;
		document.getElementById('city_s').disabled = true;
		document.getElementById('country_s').disabled = true;
		document.getElementById('state_s').disabled = true;
		document.getElementById('zip_s').disabled = true;
		$('#address_s, #city_s, #country_s, #state_s, #zip_s').css('background-color', '#e6e6e6');		
	}else{
		document.getElementById('address_s').disabled = false;
		document.getElementById('city_s').disabled = false;
		document.getElementById('country_s').disabled = false;
		document.getElementById('state_s').disabled = false;
		document.getElementById('zip_s').disabled = false;
		$('#address_s, #city_s, #country_s, #state_s, #zip_s').css('background-color', '#ffffff');
	}
}

function country_bEdit (countryB){
	if (countryB == 'USA'){
		$('#country_b option[value="USA"]').attr('selected', 'selected');
		selectCountry('b');
	}
}

function country_sEdit (countryS){
	if (countryS == 'USA'){
		$('#country_s option[value="USA"]').attr('selected', 'selected');
		selectCountry('s');
	}	
}

function state_bEdit (stateB){
	$('#state_b option[value="'+stateB+'"]').attr('selected', 'selected');
}

function state_sEdit (stateS){
	$('#state_s option[value="'+stateS+'"]').attr('selected', 'selected');	
}

$ (document).ready (function () 
{
	ifBadBrowser ();
    effect ();
	dropMenu ();
	searchForm ();
	newslettersForm ();
	loginDisplay ();
	loginDisplayNone ();	
	contactDisplay ();
	contactDisplayNone ();
	contactForm ();
	addToCartFortSubmit ();
});


