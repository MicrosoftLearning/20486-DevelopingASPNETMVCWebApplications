/* NUGET: BEGIN LICENSE TEXT
 *
 * Microsoft grants you the right to use these script files for the sole
 * purpose of either: (i) interacting through your browser with the Microsoft
 * website or online service, subject to the applicable licensing or use
 * terms; or (ii) using the files as included with a Microsoft product subject
 * to that product's license terms. Microsoft reserves all other rights to the
 * files not expressly granted by Microsoft, whether by implication, estoppel
 * or otherwise. Insofar as a script file is dual licensed under GPL,
 * Microsoft neither took the code under GPL nor distributes it thereunder but
 * under the terms set out in this paragraph. All notices and licenses
 * below are for informational purposes only.
 *
 * NUGET: END LICENSE TEXT */
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */
window.matchMedia = window.matchMedia || (function(doc, undefined){
  
  var bool,
      docElem  = doc.documentElement,
      refNode  = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement('body'),
      div      = doc.createElement('div');
  
  div.id = 'mq-test-1';
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none";
  fakeBody.appendChild(div);
  
  return function(q){
    
    div.innerHTML = '&shy;<style media="'+q+'"> #mq-test-1 { width: 42px; }</style>';
    
    docElem.insertBefore(fakeBody, refNode);
    bool = div.offsetWidth == 42;  
    docElem.removeChild(fakeBody);
    
    return { matches: bool, media: q };
  };
  
})(document);




/*! Respond.js v1.2.0: min/max-width media query polyfill. (c) Scott Jehl. MIT/GPLv2 Lic. j.mp/respondjs  */
(function( win ){
	//exposed namespace
	win.respond		= {};
	
	//define update even in native-mq-supporting browsers, to avoid errors
	respond.update	= function(){};
	
	//expose media query support flag for external use
	respond.mediaQueriesSupported	= win.matchMedia && win.matchMedia( "only all" ).matches;
	
	//if media queries are supported, exit here
	if( respond.mediaQueriesSupported ){ return; }
	
	//define vars
	var doc 			= win.document,
		docElem 		= doc.documentElement,
		mediastyles		= [],
		rules			= [],
		appendedEls 	= [],
		parsedSheets 	= {},
		resizeThrottle	= 30,
		head 			= doc.getElementsByTagName( "head" )[0] || docElem,
		base			= doc.getElementsByTagName( "base" )[0],
		links			= head.getElementsByTagName( "link" ),
		requestQueue	= [],
		
		//loop stylesheets, send text content to translate
		ripCSS			= function(){
			var sheets 	= links,
				sl 		= sheets.length,
				i		= 0,
				//vars for loop:
				sheet, href, media, isCSS;

			for( ; i < sl; i++ ){
				sheet	= sheets[ i ],
				href	= sheet.href,
				media	= sheet.media,
				isCSS	= sheet.rel && sheet.rel.toLowerCase() === "stylesheet";

				//only links plz and prevent re-parsing
				if( !!href && isCSS && !parsedSheets[ href ] ){
					// selectivizr exposes css through the rawCssText expando
					if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
						translate( sheet.styleSheet.rawCssText, href, media );
						parsedSheets[ href ] = true;
					} else {
						if( (!/^([a-zA-Z:]*\/\/)/.test( href ) && !base)
							|| href.replace( RegExp.$1, "" ).split( "/" )[0] === win.location.host ){
							requestQueue.push( {
								href: href,
								media: media
							} );
						}
					}
				}
			}
			makeRequests();
		},
		
		//recurse through request queue, get css text
		makeRequests	= function(){
			if( requestQueue.length ){
				var thisRequest = requestQueue.shift();
				
				ajax( thisRequest.href, function( styles ){
					translate( styles, thisRequest.href, thisRequest.media );
					parsedSheets[ thisRequest.href ] = true;
					makeRequests();
				} );
			}
		},
		
		//find media blocks in css text, convert to style blocks
		translate			= function( styles, href, media ){
			var qs			= styles.match(  /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi ),
				ql			= qs && qs.length || 0,
				//try to get CSS path
				href		= href.substring( 0, href.lastIndexOf( "/" )),
				repUrls		= function( css ){
					return css.replace( /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g, "$1" + href + "$2$3" );
				},
				useMedia	= !ql && media,
				//vars used in loop
				i			= 0,
				j, fullq, thisq, eachq, eql;

			//if path exists, tack on trailing slash
			if( href.length ){ href += "/"; }	
				
			//if no internal queries exist, but media attr does, use that	
			//note: this currently lacks support for situations where a media attr is specified on a link AND
				//its associated stylesheet has internal CSS media queries.
				//In those cases, the media attribute will currently be ignored.
			if( useMedia ){
				ql = 1;
			}
			

			for( ; i < ql; i++ ){
				j	= 0;
				
				//media attr
				if( useMedia ){
					fullq = media;
					rules.push( repUrls( styles ) );
				}
				//parse for styles
				else{
					fullq	= qs[ i ].match( /@media *([^\{]+)\{([\S\s]+?)$/ ) && RegExp.$1;
					rules.push( RegExp.$2 && repUrls( RegExp.$2 ) );
				}
				
				eachq	= fullq.split( "," );
				eql		= eachq.length;
					
				for( ; j < eql; j++ ){
					thisq	= eachq[ j ];
					mediastyles.push( { 
						media	: thisq.split( "(" )[ 0 ].match( /(only\s+)?([a-zA-Z]+)\s?/ ) && RegExp.$2 || "all",
						rules	: rules.length - 1,
						hasquery: thisq.indexOf("(") > -1,
						minw	: thisq.match( /\(min\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/ ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" ), 
						maxw	: thisq.match( /\(max\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/ ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" )
					} );
				}	
			}

			applyMedia();
		},
        	
		lastCall,
		
		resizeDefer,
		
		// returns the value of 1em in pixels
		getEmValue		= function() {
			var ret,
				div = doc.createElement('div'),
				body = doc.body,
				fakeUsed = false;
									
			div.style.cssText = "position:absolute;font-size:1em;width:1em";
					
			if( !body ){
				body = fakeUsed = doc.createElement( "body" );
				body.style.background = "none";
			}
					
			body.appendChild( div );
								
			docElem.insertBefore( body, docElem.firstChild );
								
			ret = div.offsetWidth;
								
			if( fakeUsed ){
				docElem.removeChild( body );
			}
			else {
				body.removeChild( div );
			}
			
			//also update eminpx before returning
			ret = eminpx = parseFloat(ret);
								
			return ret;
		},
		
		//cached container for 1em value, populated the first time it's needed 
		eminpx,
		
		//enable/disable styles
		applyMedia			= function( fromResize ){
			var name		= "clientWidth",
				docElemProp	= docElem[ name ],
				currWidth 	= doc.compatMode === "CSS1Compat" && docElemProp || doc.body[ name ] || docElemProp,
				styleBlocks	= {},
				lastLink	= links[ links.length-1 ],
				now 		= (new Date()).getTime();

			//throttle resize calls	
			if( fromResize && lastCall && now - lastCall < resizeThrottle ){
				clearTimeout( resizeDefer );
				resizeDefer = setTimeout( applyMedia, resizeThrottle );
				return;
			}
			else {
				lastCall	= now;
			}
										
			for( var i in mediastyles ){
				var thisstyle = mediastyles[ i ],
					min = thisstyle.minw,
					max = thisstyle.maxw,
					minnull = min === null,
					maxnull = max === null,
					em = "em";
				
				if( !!min ){
					min = parseFloat( min ) * ( min.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 );
				}
				if( !!max ){
					max = parseFloat( max ) * ( max.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 );
				}
				
				// if there's no media query at all (the () part), or min or max is not null, and if either is present, they're true
				if( !thisstyle.hasquery || ( !minnull || !maxnull ) && ( minnull || currWidth >= min ) && ( maxnull || currWidth <= max ) ){
						if( !styleBlocks[ thisstyle.media ] ){
							styleBlocks[ thisstyle.media ] = [];
						}
						styleBlocks[ thisstyle.media ].push( rules[ thisstyle.rules ] );
				}
			}
			
			//remove any existing respond style element(s)
			for( var i in appendedEls ){
				if( appendedEls[ i ] && appendedEls[ i ].parentNode === head ){
					head.removeChild( appendedEls[ i ] );
				}
			}
			
			//inject active styles, grouped by media type
			for( var i in styleBlocks ){
				var ss		= doc.createElement( "style" ),
					css		= styleBlocks[ i ].join( "\n" );
				
				ss.type = "text/css";	
				ss.media	= i;
				
				//originally, ss was appended to a documentFragment and sheets were appended in bulk.
				//this caused crashes in IE in a number of circumstances, such as when the HTML element had a bg image set, so appending beforehand seems best. Thanks to @dvelyk for the initial research on this one!
				head.insertBefore( ss, lastLink.nextSibling );
				
				if ( ss.styleSheet ){ 
		        	ss.styleSheet.cssText = css;
		        } 
		        else {
					ss.appendChild( doc.createTextNode( css ) );
		        }
		        
				//push to appendedEls to track for later removal
				appendedEls.push( ss );
			}
		},
		//tweaked Ajax functions from Quirksmode
		ajax = function( url, callback ) {
			var req = xmlHttp();
			if (!req){
				return;
			}	
			req.open( "GET", url, true );
			req.onreadystatechange = function () {
				if ( req.readyState != 4 || req.status != 200 && req.status != 304 ){
					return;
				}
				callback( req.responseText );
			}
			if ( req.readyState == 4 ){
				return;
			}
			req.send( null );
		},
		//define ajax obj 
		xmlHttp = (function() {
			var xmlhttpmethod = false;	
			try {
				xmlhttpmethod = new XMLHttpRequest();
			}
			catch( e ){
				xmlhttpmethod = new ActiveXObject( "Microsoft.XMLHTTP" );
			}
			return function(){
				return xmlhttpmethod;
			};
		})();
	
	//translate CSS
	ripCSS();
	
	//expose update for re-running respond later on
	respond.update = ripCSS;
	
	//adjust on resize
	function callMedia(){
		applyMedia( true );
	}
	if( win.addEventListener ){
		win.addEventListener( "resize", callMedia, false );
	}
	else if( win.attachEvent ){
		win.attachEvent( "onresize", callMedia );
	}
})(this);

// SIG // Begin signature block
// SIG // MIIdkQYJKoZIhvcNAQcCoIIdgjCCHX4CAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFOUxUIg8Gqmq
// SIG // ZzTQOc5mQ4X/uR83oIIYUzCCBMIwggOqoAMCAQICEzMA
// SIG // AAC/kWz7fBok4CIAAAAAAL8wDQYJKoZIhvcNAQEFBQAw
// SIG // dzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBMB4XDTE2MDkwNzE3
// SIG // NTg0OVoXDTE4MDkwNzE3NTg0OVowgbIxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xDDAKBgNVBAsTA0FPQzEnMCUGA1UECxMe
// SIG // bkNpcGhlciBEU0UgRVNOOjU3QzgtMkQxNS0xQzhCMSUw
// SIG // IwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2
// SIG // aWNlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
// SIG // AQEAre1/hsD2onVXFU0U9sqIVfy9XaUzAr3+Ax5QmNBl
// SIG // JoRMw+GJ9tqv6p6mUxw3fCJSPzh7yoVgvZLChBfgYAR7
// SIG // VED0oO7OvmV8uval+uK+pu1/zWIs3it9Q7EnC7Ax56rG
// SIG // 58CWjWdgtruYYXCrB73PAWkrL/5ypa+vnoNol9svWotb
// SIG // gdckjXrpxLXX3IQK9VOkG+wCR61zE3SpfKbS6L+u2hVN
// SIG // K0UTMECTlh0fqP4EGvb+M/3+N0WNj5zEaBew87Z+nYra
// SIG // EPQoE4jHUjLbKhVjAEDTLeW2fKGNYZoJEgzehcE41clB
// SIG // BOrdyibYF9oTB4zlarR10JbndBkd2S7QDjG0uwIDAQAB
// SIG // o4IBCTCCAQUwHQYDVR0OBBYEFORsGjkax5NYtEY2ZQfE
// SIG // ALd5F5wRMB8GA1UdIwQYMBaAFCM0+NlSRnAK7UD7dvuz
// SIG // K7DDNbMPMFQGA1UdHwRNMEswSaBHoEWGQ2h0dHA6Ly9j
// SIG // cmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3Rz
// SIG // L01pY3Jvc29mdFRpbWVTdGFtcFBDQS5jcmwwWAYIKwYB
// SIG // BQUHAQEETDBKMEgGCCsGAQUFBzAChjxodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY3Jvc29m
// SIG // dFRpbWVTdGFtcFBDQS5jcnQwEwYDVR0lBAwwCgYIKwYB
// SIG // BQUHAwgwDQYJKoZIhvcNAQEFBQADggEBAI7eto3GftmA
// SIG // apu0SorfNuw0VPTioqIuhxBEU9F9Gy/iY1E7t+5OKYj3
// SIG // Ctyf9HH5LVrj462ErskmvzW5JpbwIUFeFaaFsYqcd3Ga
// SIG // ZRfRyvSB+LfAA2A8VCObtcW9q9uGhMRiM1mPtbh/dm80
// SIG // ymwI7sDc0zENc9dCnGuF1zyOBxWWpV8YC324wpFdyCjb
// SIG // KVNUyC1dA85NLXSgMMfzKHmTdRxXAfVo826RZwlR/jsv
// SIG // zcniTsojROLk/+osh89flwqn9pyK1fw117CWCsIn1ZTr
// SIG // 0ieGa1eNDGLnKt5VkLihEX14ryxV5XSsl0K0uHnk6ET0
// SIG // nr0YrHNBgWLmXM6ZHXjeX2gwggYAMIID6KADAgECAhMz
// SIG // AAAAww6bp9iy3PcsAAAAAADDMA0GCSqGSIb3DQEBCwUA
// SIG // MH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01p
// SIG // Y3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTEwHhcN
// SIG // MTcwODExMjAyMDI0WhcNMTgwODExMjAyMDI0WjB0MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMR4wHAYDVQQDExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24wggEiMA0GCSqGSIb3DQEBAQUA
// SIG // A4IBDwAwggEKAoIBAQC7V9c40bEGf0ktqW2zY596urY6
// SIG // IVu0mK6N1KSBoMV1xSzvgkAqt4FTd/NjAQq8zjeEA0BD
// SIG // V4JLzu0ftv2AbcnCkV0Fx9xWWQDhDOtX3v3xuJAnv3VK
// SIG // /HWycli2xUibM2IF0ZWUpb85Iq2NEk1GYtoyGc6qIlxW
// SIG // SLFvRclndmJdMIijLyjFH1Aq2YbbGhElgcL09Wcu53kd
// SIG // 9eIcdfROzMf8578LgEcp/8/NabEMC2DrZ+aEG5tN/W1H
// SIG // OsfZwWFh8pUSoQ0HrmMh2PSZHP94VYHupXnoIIJfCtq1
// SIG // UxlUAVcNh5GNwnzxVIaA4WLbgnM+Jl7wQBLSOdUmAw2F
// SIG // iDFfCguLAgMBAAGjggF/MIIBezAfBgNVHSUEGDAWBgor
// SIG // BgEEAYI3TAgBBggrBgEFBQcDAzAdBgNVHQ4EFgQUpxNd
// SIG // HyGJVegD7p4XNuryVIg1Ga8wUQYDVR0RBEowSKRGMEQx
// SIG // DDAKBgNVBAsTA0FPQzE0MDIGA1UEBRMrMjMwMDEyK2M4
// SIG // MDRiNWVhLTQ5YjQtNDIzOC04MzYyLWQ4NTFmYTIyNTRm
// SIG // YzAfBgNVHSMEGDAWgBRIbmTlUAXTgqoXNzcitW2oynUC
// SIG // lTBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vd3d3Lm1p
// SIG // Y3Jvc29mdC5jb20vcGtpb3BzL2NybC9NaWNDb2RTaWdQ
// SIG // Q0EyMDExXzIwMTEtMDctMDguY3JsMGEGCCsGAQUFBwEB
// SIG // BFUwUzBRBggrBgEFBQcwAoZFaHR0cDovL3d3dy5taWNy
// SIG // b3NvZnQuY29tL3BraW9wcy9jZXJ0cy9NaWNDb2RTaWdQ
// SIG // Q0EyMDExXzIwMTEtMDctMDguY3J0MAwGA1UdEwEB/wQC
// SIG // MAAwDQYJKoZIhvcNAQELBQADggIBAE2XTzR+8XCTnOPV
// SIG // GkucEX5rJsSlJPTfRNQkurNqCImZmssx53Cb/xQdsAc5
// SIG // f+QwOxMi3g7IlWe7bn74fJWkkII3k6aD00kCwaytWe+R
// SIG // t6dmAA6iTCXU3OddBwLKKDRlOzmDrZUqjsqg6Ag6HP4+
// SIG // e0BJlE2OVCUK5bHHCu5xN8abXjb1p0JE+7yHsA3ANdkm
// SIG // h1//Z+8odPeKMAQRimfMSzVgaiHnw40Hg16bq51xHykm
// SIG // CRHU9YLT0jYHKa7okm2QfwDJqFvu0ARl+6EOV1PM8piJ
// SIG // 858Vk8gGxGNSYQJPV0gc9ft1Esq1+fTCaV+7oZ0NaYMn
// SIG // 64M+HWsxw+4O8cSEQ4fuMZwGADJ8tyCKuQgj6lawGNSy
// SIG // vRXsN+1k02sVAiPGijOHOtGbtsCWWSygAVOEAV/ye8F6
// SIG // sOzU2FL2X3WBRFkWOCdTu1DzXnHf99dR3DHVGmM1Kpd+
// SIG // n2Y3X89VM++yyrwsI6pEHu77Z0i06ELDD4pRWKJGAmEm
// SIG // Whm/XJTpqEBw51swTHyA1FBnoqXuDus9tfHleR7h9VgZ
// SIG // b7uJbXjiIFgl/+RIs+av8bJABBdGUNQMbJEUfe7K4vYm
// SIG // 3hs7BGdRLg+kF/dC/z+RiTH4p7yz5TpS3Cozf0pkkWXY
// SIG // ZRG222q3tGxS/L+LcRbELM5zmqDpXQjBRUWlKYbsATFt
// SIG // XnTGVjELMIIGBzCCA++gAwIBAgIKYRZoNAAAAAAAHDAN
// SIG // BgkqhkiG9w0BAQUFADBfMRMwEQYKCZImiZPyLGQBGRYD
// SIG // Y29tMRkwFwYKCZImiZPyLGQBGRYJbWljcm9zb2Z0MS0w
// SIG // KwYDVQQDEyRNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0
// SIG // ZSBBdXRob3JpdHkwHhcNMDcwNDAzMTI1MzA5WhcNMjEw
// SIG // NDAzMTMwMzA5WjB3MQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSEw
// SIG // HwYDVQQDExhNaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0Ew
// SIG // ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCf
// SIG // oWyx39tIkip8ay4Z4b3i48WZUSNQrc7dGE4kD+7Rp9FM
// SIG // rXQwIBHrB9VUlRVJlBtCkq6YXDAm2gBr6Hu97IkHD/cO
// SIG // BJjwicwfyzMkh53y9GccLPx754gd6udOo6HBI1PKjfpF
// SIG // zwnQXq/QsEIEovmmbJNn1yjcRlOwhtDlKEYuJ6yGT1VS
// SIG // DOQDLPtqkJAwbofzWTCd+n7Wl7PoIZd++NIT8wi3U21S
// SIG // tEWQn0gASkdmEScpZqiX5NMGgUqi+YSnEUcUCYKfhO1V
// SIG // eP4Bmh1QCIUAEDBG7bfeI0a7xC1Un68eeEExd8yb3zuD
// SIG // k6FhArUdDbH895uyAc4iS1T/+QXDwiALAgMBAAGjggGr
// SIG // MIIBpzAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQj
// SIG // NPjZUkZwCu1A+3b7syuwwzWzDzALBgNVHQ8EBAMCAYYw
// SIG // EAYJKwYBBAGCNxUBBAMCAQAwgZgGA1UdIwSBkDCBjYAU
// SIG // DqyCYEBWJ5flJRP8KuEKU5VZ5KShY6RhMF8xEzARBgoJ
// SIG // kiaJk/IsZAEZFgNjb20xGTAXBgoJkiaJk/IsZAEZFglt
// SIG // aWNyb3NvZnQxLTArBgNVBAMTJE1pY3Jvc29mdCBSb290
// SIG // IENlcnRpZmljYXRlIEF1dGhvcml0eYIQea0WoUqgpa1M
// SIG // c1j0BxMuZTBQBgNVHR8ESTBHMEWgQ6BBhj9odHRwOi8v
// SIG // Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0
// SIG // cy9taWNyb3NvZnRyb290Y2VydC5jcmwwVAYIKwYBBQUH
// SIG // AQEESDBGMEQGCCsGAQUFBzAChjhodHRwOi8vd3d3Lm1p
// SIG // Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY3Jvc29mdFJv
// SIG // b3RDZXJ0LmNydDATBgNVHSUEDDAKBggrBgEFBQcDCDAN
// SIG // BgkqhkiG9w0BAQUFAAOCAgEAEJeKw1wDRDbd6bStd9vO
// SIG // eVFNAbEudHFbbQwTq86+e4+4LtQSooxtYrhXAstOIBNQ
// SIG // md16QOJXu69YmhzhHQGGrLt48ovQ7DsB7uK+jwoFyI1I
// SIG // 4vBTFd1Pq5Lk541q1YDB5pTyBi+FA+mRKiQicPv2/OR4
// SIG // mS4N9wficLwYTp2OawpylbihOZxnLcVRDupiXD8WmIsg
// SIG // P+IHGjL5zDFKdjE9K3ILyOpwPf+FChPfwgphjvDXuBfr
// SIG // Tot/xTUrXqO/67x9C0J71FNyIe4wyrt4ZVxbARcKFA7S
// SIG // 2hSY9Ty5ZlizLS/n+YWGzFFW6J1wlGysOUzU9nm/qhh6
// SIG // YinvopspNAZ3GmLJPR5tH4LwC8csu89Ds+X57H2146So
// SIG // dDW4TsVxIxImdgs8UoxxWkZDFLyzs7BNZ8ifQv+AeSGA
// SIG // nhUwZuhCEl4ayJ4iIdBD6Svpu/RIzCzU2DKATCYqSCRf
// SIG // WupW76bemZ3KOm+9gSd0BhHudiG/m4LBJ1S2sWo9iaF2
// SIG // YbRuoROmv6pH8BJv/YoybLL+31HIjCPJZr2dHYcSZAI9
// SIG // La9Zj7jkIeW1sMpjtHhUBdRBLlCslLCleKuzoJZ1GtmS
// SIG // hxN1Ii8yqAhuoFuMJb+g74TKIdbrHk/Jmu5J4PcBZW+J
// SIG // C33Iacjmbuqnl84xKf8OxVtc2E0bodj6L54/LlUWa8kT
// SIG // o/0wggd6MIIFYqADAgECAgphDpDSAAAAAAADMA0GCSqG
// SIG // SIb3DQEBCwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMTIw
// SIG // MAYDVQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0
// SIG // ZSBBdXRob3JpdHkgMjAxMTAeFw0xMTA3MDgyMDU5MDla
// SIG // Fw0yNjA3MDgyMTA5MDlaMH4xCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xKDAmBgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25p
// SIG // bmcgUENBIDIwMTEwggIiMA0GCSqGSIb3DQEBAQUAA4IC
// SIG // DwAwggIKAoICAQCr8PpyEBwurdhuqoIQTTS68rZYIZ9C
// SIG // Gypr6VpQqrgGOBoESbp/wwwe3TdrxhLYC/A4wpkGsMg5
// SIG // 1QEUMULTiQ15ZId+lGAkbK+eSZzpaF7S35tTsgosw6/Z
// SIG // qSuuegmv15ZZymAaBelmdugyUiYSL+erCFDPs0S3XdjE
// SIG // LgN1q2jzy23zOlyhFvRGuuA4ZKxuZDV4pqBjDy3TQJP4
// SIG // 494HDdVceaVJKecNvqATd76UPe/74ytaEB9NViiienLg
// SIG // Ejq3SV7Y7e1DkYPZe7J7hhvZPrGMXeiJT4Qa8qEvWeSQ
// SIG // Oy2uM1jFtz7+MtOzAz2xsq+SOH7SnYAs9U5WkSE1JcM5
// SIG // bmR/U7qcD60ZI4TL9LoDho33X/DQUr+MlIe8wCF0JV8Y
// SIG // KLbMJyg4JZg5SjbPfLGSrhwjp6lm7GEfauEoSZ1fiOIl
// SIG // XdMhSz5SxLVXPyQD8NF6Wy/VI+NwXQ9RRnez+ADhvKwC
// SIG // gl/bwBWzvRvUVUvnOaEP6SNJvBi4RHxF5MHDcnrgcuck
// SIG // 379GmcXvwhxX24ON7E1JMKerjt/sW5+v/N2wZuLBl4F7
// SIG // 7dbtS+dJKacTKKanfWeA5opieF+yL4TXV5xcv3coKPHt
// SIG // bcMojyyPQDdPweGFRInECUzF1KVDL3SV9274eCBYLBNd
// SIG // YJWaPk8zhNqwiBfenk70lrC8RqBsmNLg1oiMCwIDAQAB
// SIG // o4IB7TCCAekwEAYJKwYBBAGCNxUBBAMCAQAwHQYDVR0O
// SIG // BBYEFEhuZOVQBdOCqhc3NyK1bajKdQKVMBkGCSsGAQQB
// SIG // gjcUAgQMHgoAUwB1AGIAQwBBMAsGA1UdDwQEAwIBhjAP
// SIG // BgNVHRMBAf8EBTADAQH/MB8GA1UdIwQYMBaAFHItOgIx
// SIG // kEO5FAVO4eqnxzHRI4k0MFoGA1UdHwRTMFEwT6BNoEuG
// SIG // SWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3Js
// SIG // L3Byb2R1Y3RzL01pY1Jvb0NlckF1dDIwMTFfMjAxMV8w
// SIG // M18yMi5jcmwwXgYIKwYBBQUHAQEEUjBQME4GCCsGAQUF
// SIG // BzAChkJodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
// SIG // L2NlcnRzL01pY1Jvb0NlckF1dDIwMTFfMjAxMV8wM18y
// SIG // Mi5jcnQwgZ8GA1UdIASBlzCBlDCBkQYJKwYBBAGCNy4D
// SIG // MIGDMD8GCCsGAQUFBwIBFjNodHRwOi8vd3d3Lm1pY3Jv
// SIG // c29mdC5jb20vcGtpb3BzL2RvY3MvcHJpbWFyeWNwcy5o
// SIG // dG0wQAYIKwYBBQUHAgIwNB4yIB0ATABlAGcAYQBsAF8A
// SIG // cABvAGwAaQBjAHkAXwBzAHQAYQB0AGUAbQBlAG4AdAAu
// SIG // IB0wDQYJKoZIhvcNAQELBQADggIBAGfyhqWY4FR5Gi7T
// SIG // 2HRnIpsLlhHhY5KZQpZ90nkMkMFlXy4sPvjDctFtg/6+
// SIG // P+gKyju/R6mj82nbY78iNaWXXWWEkH2LRlBV2AySfNIa
// SIG // SxzzPEKLUtCw/WvjPgcuKZvmPRul1LUdd5Q54ulkyUQ9
// SIG // eHoj8xN9ppB0g430yyYCRirCihC7pKkFDJvtaPpoLpWg
// SIG // Kj8qa1hJYx8JaW5amJbkg/TAj/NGK978O9C9Ne9uJa7l
// SIG // ryft0N3zDq+ZKJeYTQ49C/IIidYfwzIY4vDFLc5bnrRJ
// SIG // OQrGCsLGra7lstnbFYhRRVg4MnEnGn+x9Cf43iw6IGmY
// SIG // slmJaG5vp7d0w0AFBqYBKig+gj8TTWYLwLNN9eGPfxxv
// SIG // FX1Fp3blQCplo8NdUmKGwx1jNpeG39rz+PIWoZon4c2l
// SIG // l9DuXWNB41sHnIc+BncG0QaxdR8UvmFhtfDcxhsEvt9B
// SIG // xw4o7t5lL+yX9qFcltgA1qFGvVnzl6UJS0gQmYAf0AAp
// SIG // xbGbpT9Fdx41xtKiop96eiL6SJUfq/tHI4D1nvi/a7dL
// SIG // l+LrdXga7Oo3mXkYS//WsyNodeav+vyL6wuA6mk7r/ww
// SIG // 7QRMjt/fdW1jkT3RnVZOT7+AVyKheBEyIXrvQQqxP/uo
// SIG // zKRdwaGIm1dxVk5IRcBCyZt2WwqASGv9eZ/BvW1taslS
// SIG // cxMNelDNMYIEqjCCBKYCAQEwgZUwfjELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEoMCYGA1UEAxMfTWljcm9zb2Z0IENvZGUg
// SIG // U2lnbmluZyBQQ0EgMjAxMQITMwAAAMMOm6fYstz3LAAA
// SIG // AAAAwzAJBgUrDgMCGgUAoIG+MBkGCSqGSIb3DQEJAzEM
// SIG // BgorBgEEAYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgor
// SIG // BgEEAYI3AgEVMCMGCSqGSIb3DQEJBDEWBBTktpViz2w3
// SIG // EYa6X1xODT7Tp3y79zBeBgorBgEEAYI3AgEMMVAwTqAm
// SIG // gCQATQBpAGMAcgBvAHMAbwBmAHQAIABMAGUAYQByAG4A
// SIG // aQBuAGehJIAiaHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L2xlYXJuaW5nIDANBgkqhkiG9w0BAQEFAASCAQAgDN8K
// SIG // jcxYrpuP5KjHw7iEaeBcd9S4ZpuYfvyfLlJOCbQGzvvc
// SIG // QnNVS+KIHJF0CN/Eoh2qNXy+bY21lD//EGVRlYDqF+He
// SIG // J65WqidiMZfBMmzF/5Lorrgk/MPTzsSzrkAZQmHZs8uy
// SIG // uWjN1l++M8/Vi15lsMQr8aNjrwI6ZVCab/P07Lx9gMdG
// SIG // DoCk0tRZt58rQV56Xr1s/1P8x0eNVG476odPN9+liRMp
// SIG // Pfd0Gr8njIAzOU7RX5hlSRUdsgWBu2OPhYmBegyd7Yaa
// SIG // n0gIS3xG3UJ/T+bJ1tje5oEoNc6sDyXcXPmR70AeAVaO
// SIG // HIDrQ1VVzS7UWL80Pdm/LZCpKWi6oYICKDCCAiQGCSqG
// SIG // SIb3DQEJBjGCAhUwggIRAgEBMIGOMHcxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xITAfBgNVBAMTGE1pY3Jvc29mdCBUaW1l
// SIG // LVN0YW1wIFBDQQITMwAAAL+RbPt8GiTgIgAAAAAAvzAJ
// SIG // BgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3
// SIG // DQEHATAcBgkqhkiG9w0BCQUxDxcNMTcxMjI5MDYyMTAz
// SIG // WjAjBgkqhkiG9w0BCQQxFgQUPSJPTejYjjF75IcTtIP8
// SIG // Za/lUi8wDQYJKoZIhvcNAQEFBQAEggEAH2UbAV4ZUtM+
// SIG // P9FJ0PAFzBP+qoj62dtsofMYBoHjMQxbmhAvRne7GU0R
// SIG // YtTG5Yg38YINs7elgokEf7lkY/F5ycVVZ90C3B4XGblM
// SIG // gL1MYjUQ55Zn6RhZmOvaVMV0n2e0HEn6BosR1bvJpH31
// SIG // 0MQE42ZvaMPzH7j0px03T96c9n6cnByuoo4OfopTyHh5
// SIG // m8G050ePcubhHhFyD2qMCL5qM52X69gnvFndqxri+Hxc
// SIG // Gs4jljnWqfTVb2+LtqkLbgp3SkJojHMiT7CY/gA+DN3f
// SIG // 7dwoB3EDZe68zWpazyYeevBXDy2QH1xGQ6mZNqNDJ5QO
// SIG // CyFyPkybSRMxyLpt0AT9IQ==
// SIG // End signature block
