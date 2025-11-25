/*
 *	Mark Slider - jQuery plugin
 *	Version : 1.3
 *	Author : Mark Qin
 *	Date : 2011-09-28
 *	Reference : Easy Slider 1.7
 *
 *	jQuery 1.4.2+
 */
 
/*
 *	markup example for:
 *
 *	$("#JS_promo").markSlider();
 *	
 *	<div class="promo">
 * 		<div id="JS_promo" class="promo_content">
 *			<ul class="promo_list">
 *				<li class="promo_item">...</li>
 *				<li class="promo_item">...</li>
 *				<li class="promo_item">...</li>
 *				<li class="promo_item">...</li>
 *				<li class="promo_item">...</li>
 *			</ul>
 *		</div>
 *	</div>
 *
 */
 
 
 	

(function($) {

	$.fn.markSlider = function(o){
	  
		//默认配置属性
		var defaults = {			
			
			speed: 				600,						//滚动速度，默认600ms
			auto:				true,						//自动播放，默认开启
			pause:				5000,						//间隔时间，默认4秒
			continuous:			true,						//循环播放，默认开启
			vertical:			false,						//垂直滚动，默认关闭
			imgPreload:			true,						//是否开启图片预加载，默认开启
			easing:				'slow',						//滚动动画的easing效果，目前有三个选择：''、'slow'、'fast'，留空则动画没有easing效果，slow表示有减速效果，fast表示有加速效果。
															//更多其它效果可以通过引入jquery.easing插件后进行扩展
			//进度导航
			progressNavId: 		'promo_triggers',			//进度导航的ID（包括数字导航、缩略图导航与自定义导航）
			progressNavCurrent:	'current',					//进度导航当前状态的class
			progressNavHover:	false,						//鼠标移动到数字导航上时触发播放动画，而不需要点击。默认关闭
			
			//自定义进度导航
			customProgressNav:	false,						//是否自定义进度导航，默认关闭
			customProTag:		'li',						//自定义导航的标签，默认是'li'
			hasLink:			false,						//自定义导航中是否有需要跳转的<a>标签
			
			//数字导航（自动生成）
			numeric: 			true,						//数字导航，默认开启（缩略图导航与数字导航只能使用一个）
			
			//缩略图导航（自动生成）
			thumbImgNav:		false,						//缩略图导航，默认关闭（缩略图导航与数字导航只能使用一个；只能在单纯的图片轮转情况下使用）
			smallImg:			'_small',					//缩略图相对大图的的图片名称后缀（在使用缩略图导航时可配置）
			imgType:			'.jpg',						//图片的类型（在使用缩略图导航时可配置）
			
			//方向导航
			directionNav:		false,						//方向导航，默认关闭
			prevId: 			'promo_prev',				//上一个按钮的ID
			prevText: 			'Previous',					//上一个按钮的文本
			nextId: 			'promo_next',				//下一个按钮的ID
			nextText: 			'Next',						//下一个按钮的文本
			directionNavFade:	false,						//当播放到最后一个（第一个）内容块时，隐藏Next（Prev）按钮。需要关闭循环播放
			directionNavToggle:	false,						//鼠标移动到内容上时方向导航出现，移开后隐藏。需要开启方向导航，即"directionNav:true"，默认关闭此功能
			
			//暂停
			pauseShow:			false,						//是否显示暂停按钮，默认不显示
			pauseId:			'promo_pause',				//暂停按钮的ID名
			pausePlayClass:		'promo_pause_play',			//当处于暂停状态时，“播放”按钮的class
			pauseStopText:		'pause',					//当处于播放状态时，"暂停"按钮的文本
			pausePlayText:		'play',						//当处于暂停状态时，“播放”按钮的文本
			
			//全屏模式
			fullScreen:			false,						//全屏模式，默认关闭
			haveBigImg:			false,						//在开启全屏模式的情况下，有超大图且需要自适应居中显示（纯图片）
			bigImgWidth:		1600,						//全屏模式下，超大图片的宽度（使图片居中）
			minWidth:			980,						//最小宽度（全屏模式）
			classicRight:		true,						//是否开启进度导航居右下角绝对定位的经典布局（只全屏模式下,相对于最小内容宽度），默认开启
	
			//计数器
			countShow:			false,						//计数器，显示当前内容块是内容块列表中的第几个，如(2/5)，表示当前显示的是第二个内容块，默认关闭
			countShowId:		'promo_count',				//计数器的ID
			countCurrentId:		'promo_count_current',		//计数器中，当前数字的ID
			countTotalId:		'promo_count_total',		//计数器中，总数字的ID
			countSplitId:		'promo_count_split',		//计数器中，分隔符的ID
			countSplitContent:	'/',						//计数器中，分隔符的内容 
			countCurrentBefore:	'',							//计数器中，当前数字的前缀，默认为空
			countCurrentAfter:	'',							//计数器中，当前数字的后缀，默认为空
			countTotalBefore:	'',							//计数器中，总数字的前缀，默认为空
			countTotalAfter:	''							//计数器中，总数字的后缀，默认为空
			
			
	
		}; 
		
		var o = $.extend(defaults, o);
		
		this.each(function() {
			var obj = $(this),
				listObj = obj.children("ul"),
				itemObj = listObj.children("li"),
				s = itemObj.length,
				w = itemObj.width(),
				h = itemObj.height();
			
			var clickable = true;
			obj.width(w); 
			obj.height(h);
			obj.css({"overflow":"hidden","position":"relative"});
			
			var ts = s-1, t = 0;
			
			if(!o.vertical){
				listObj.css('width',s*w);
				itemObj.css('float','left');
			};			
			

			//自动生产进度导航
			if(!o.customProgressNav && s>1 && $("#"+o.progressNavId).length<1){
			
				var html = "";
				html += '<ul id="'+ o.progressNavId +'"></ul>';
				$(obj).after(html);
				
				//数字导航
				if(o.numeric && !o.thumbImgNav){					
					for(var i=0;i<s;i++){						
						$(document.createElement("li"))
							.html('<a href=\"#\">'+ (i+1) +'</a>')
							.appendTo($("#"+ o.progressNavId)); 
					};
				};
				
				//缩略图导航
				if(o.thumbImgNav && !o.numeric){
					var imgArray = $("img", obj);
					var thumbLength = imgArray.length;
					var thumbArray = new Array();
					if(thumbLength == 1){
						thumbArray.push(new Array(imgArray.attr("src").replace(o.imgType,o.smallImg + o.imgType)));
					}else{
						for(var i = 0; i < thumbLength ; i++){
							thumbArray.push(new Array(imgArray.eq(i).attr("src").replace(o.imgType,o.smallImg + o.imgType)));
						};
					};
								
					for(var i=0;i<s;i++){						
						
						$(document.createElement("li"))
							.html('<a rel='+ i +' href=\"#\"><img src="'+ thumbArray[i] +'" alt="" /></a>')
							.appendTo($("#"+ o.progressNavId)); 
						
						if(o.imgPreload){
							$("#"+o.progressNavId + " img").each(function(){
								var imgSelf = $(this);
								var imgSrc = imgSelf.attr("src");
								ImgPreload(imgSelf,imgSrc);
							});
						};
					};
				};	
			};
			
			ProgressNavAct();
			
			//进度导航按钮触发事件
			function ProgressNavAct(){
				/*$("#"+ o.progressNavId).children(o.customProgressNav?o.customProTag:'li').bind(o.progressNavHover?'mouseover':'click',function(){							
					Animat($(this).index(),false,o.progressNavHover?true:false);
				}).click(function(){
					return o.hasLink&&o.customProgressNav?true:false;
				});*/
				
				var proNavItem = $("#"+ o.progressNavId).children(o.customProgressNav?o.customProTag:'li');
				if(o.progressNavHover){
					var hoverTimer;
					proNavItem.hover(function(){
						var _this = $(this);
						hoverTimer = setTimeout(function(){
							Animat(_this.index(),false,true);
						},150);
					},function(){
						clearTimeout(hoverTimer);
					});
				}else{
					proNavItem.click(function(){
						Animat($(this).index(),true,false);
					});
				};
				proNavItem.click(function(){
					return o.hasLink&&o.customProgressNav?true:false;
				});
				
			};
			

			//进度导航当前状态
			function setCurrent(i){
				i = parseInt(i);
				$("#"+ o.progressNavId).children(o.customProgressNav?o.customProTag:'li').eq(i).addClass(o.progressNavCurrent).siblings(o.customProgressNav?o.customProTag:'li').removeClass(o.progressNavCurrent);				
			};
			
			
			
			//方向导航
			if(o.directionNav){
				var html = " ";
				html += ' <span id="'+ o.prevId +'"><a href=\"#\">'+ o.prevText +'</a></span>';				
				html += ' <span id="'+ o.nextId +'"><a href=\"#\">'+ o.nextText +'</a></span>';
				$(obj).after(html);
				
				$("#"+o.nextId).click(function(){		
					Animat("next",true,false);
					return false;
				});
				$("#"+o.prevId).click(function(){
					Animat("prev",true,false);
					return false;
				});
				
				//方向导航Toggle
				if(o.directionNavToggle){
					var prevBtn = $("#"+o.prevId);
					var nextBtn = $("#"+o.nextId);
					prevBtn.hide();
					nextBtn.hide();
					obj.parent().bind('mouseover',function(){
						prevBtn.show();
						nextBtn.show();
					}).bind('mouseout',function(){
						prevBtn.hide();
						nextBtn.hide();
					});
				};
				
			};
			
			
			//暂停按钮
			if(o.pauseShow && o.auto){
				var html = "";
				html += '<span id="'+ o.pauseId +'"><a href="#"><span>'+o.pauseStopText+'</span></a></span>';
				$(obj).after(html);
				
				$("#"+ o.pauseId).toggle(function(){
					clearTimeout(timeout);
					$(this).find("a").addClass(o.pausePlayClass).find("span").html(o.pausePlayText);
					return false;
				},function(){
					Timeout();
					$(this).find("a").removeClass(o.pausePlayClass).find("span").html(o.pauseStopText);
					return false;
				});
				
			};
			
			
			//计数器
			if(o.countShow){
				var html = "";
				html += '<div id="'+ o.countShowId +'"><span id="' + o.countCurrentId + '"></span><span id="' + o.countSplitId + '">' + o.countSplitContent + '</span><span id="' + o.countTotalId + '"></span></div>';
				$(obj).after(html);
			};
			
	
			//全屏模式
			if(o.fullScreen){
				var winW = $(window).width();
				if(winW<o.minWidth){
					winW=o.minWidth;
				};
				w = winW;
				obj.width(w);
				obj.parent().width(w);
				o.vertical ? listObj.css({'width':w}) : listObj.css({'width':s*w});
				itemObj.css({"overflow":"hidden"}).width(w);
				
				if(o.haveBigImg){
					$("img", obj).each(function(){
						var imgSelf = $(this);
						var imgSrc = imgSelf.attr("src");
						ImgPreload(imgSelf,imgSrc,winW,o.bigImgWidth);
					});
				};
				//全屏模式下进度导航常用居右绝对定位（相对于最小内容宽度）
				if((o.thumbImgNav || o.numeric) && o.classicRight){
					$("#" + o.progressNavId).css({"position":"absolute","right":(winW - o.minWidth)/2});
				};
				
				//浏览器缩放
				$(window).resize(function(){
					var winW = $(window).width();
					if(winW<o.minWidth){
						winW=o.minWidth;
					};
					w = winW;
					obj.width(w);
					obj.parent().width(w);
					o.vertical ? listObj.css({'width':w}) : listObj.css({'width':s*w,'margin-left':-t*w});
					itemObj.css({"overflow":"hidden"}).width(w);
					if(o.haveBigImg){
						$("img", obj).each(function(){
							$(this).css({"margin-left":(winW - o.bigImgWidth)/2});
						});
					};
					if((o.thumbImgNav || o.numeric) && o.classicRight){
						$("#" + o.progressNavId).css({"position":"absolute","right":(winW - o.minWidth)/2});
					};
				});
				
			};
			
			
			//图片预加载
			function ImgPreload(imgobj,src,winW,imgW){
				imgobj.hide();
				var img = new Image();				
				$(img).load(function(){
					imgobj.attr("src",src);
					if(imgW){imgobj.css({"margin-left":(winW - imgW)/2});};
					imgobj.fadeIn(200);
				}).attr("src",src);
				return imgobj;
			};
			
			
			//动画效果回调函数
			function adjust(){
				var nowWinW = $(window).width()<o.minWidth ? o.minWidth :$(window).width();
				if(!o.vertical){
					if(t == -1){
						if(o.fullScreen){
							itemObj.last().attr("style","float:left; overflow:hidden; width:"+nowWinW+"px");
						}else{
							itemObj.last().attr("style","float:left;");
						};
						
						listObj.css({"margin-left":ts*itemObj.width()*-1});
						t = ts;
					};
					if(t == s){
						if(o.fullScreen){
							itemObj.first().attr("style","float:left; overflow:hidden; width:"+nowWinW+"px");
						}else{
							itemObj.first().attr("style","float:left;");
						};
						listObj.css({"margin-left":"0"});
						t = 0;
					};
				}else{
					if(t == -1){
						itemObj.last().attr("style"," ");
						listObj.css({"margin-top":ts*itemObj.height()*-1});
						t = ts;
					};
					if(t == s){
						itemObj.first().attr("style"," ");
						listObj.css({"margin-top":"0"});
						t = 0;
					};
				};
				clickable = true;
			};
			
			
			//动画效果
			function Animat(dir,clicked,rapid){
				if (clickable){
					clickable = rapid ? true : false;
					var ot = t;
					switch(dir){
						case "next":
							t = parseInt((ot>=ts) ? (o.continuous ? t+1 : ts) : t+1);			
							break;
						case "prev":
							t = parseInt((t<=0) ? (o.continuous ? t-1 : 0) : t-1);
							break;
						default:
							t = parseInt(dir);
							break; 
					};
					
					
					//设置数字导航当前状态
					t == s ? setCurrent(0) : setCurrent(t);
					
					//动画
					var speed = o.speed;
					if(!o.vertical) {
						
						if(t == -1){
							itemObj.last().css({"position":"relative","left":listObj.width()*-1});
						};
						if(t == s){
							itemObj.first().css({"position":"relative","left":listObj.width()});
						};
						
						p = (t*w*-1);
						listObj.animate(
							{ marginLeft: p }, 
							{ queue:false, duration:speed, complete:adjust, easing:o.easing }
						);
					} else {
						if(t == -1){
							itemObj.last().css({"position":"relative","top":h*s*-1});
						};
						if(t == s){
							itemObj.first().css({"position":"relative","top":h*s});
						};
						p = (t*h*-1);
						listObj.animate(
							{ marginTop: p },
							{ queue:false, duration:speed, complete:adjust, easing:o.easing }
						);
					};
					
					//不循环播放且方向导航渐隐模式，播放到最后一个（第一个）内容块时，隐藏Next（Prev）按钮
					if(!o.continuous && o.directionNavFade){
						t==ts ? $("#"+o.nextId).hide() : $("#"+o.nextId).show();
						t==0 ? $("#"+o.prevId).hide() : $("#"+o.prevId).show();
					};
					
					//自动播放
					if(o.auto && clicked && !$("#"+ o.pauseId).find("a").hasClass(o.pausePlayClass)){
						clearTimeout(timeout);
						Timeout();
					}else{
						if(o.auto && dir=="next" && !$("#"+ o.pauseId).find("a").hasClass(o.pausePlayClass)){
							Timeout();
						};
					};
					
					//计数器
					if(o.countShow){
						var cnt = o.countCurrentBefore + (parseInt(t == -1 ? ts : ( t == s ? 0 : t ))+1) + o.countCurrentAfter;
						$("#"+o.countCurrentId).html(cnt);
					};
								
				};
				
			};
				
			
			//初始化
			setCurrent(0);
			
			var timeout;
			function Timeout(){
				timeout = setTimeout(function(){
					Animat("next",false);
				},o.pause);
			};
			
			if(o.auto && s>1){
				Timeout();
				obj.parent().hover(function(){
					clearTimeout(timeout);
				},function(){
					if(!$("#"+ o.pauseId).find("a").hasClass(o.pausePlayClass)){
						Timeout();
					};
				});
			};

			if(o.countShow){
				$("#"+o.countCurrentId).html(o.countCurrentBefore +"1" + o.countCurrentAfter);
				$("#"+o.countTotalId).html(o.countTotalBefore + s + o.countTotalAfter);
			};
		
			if(!o.continuous && o.directionNavFade){
				$("#"+o.prevId).hide();
			};
			
			if(o.imgPreload){
				$("img", obj).each(function(){
					var imgSelf = $(this);
					var imgSrc = imgSelf.attr("src");
					ImgPreload(imgSelf,imgSrc);
				});
			};
			
		});
	  
	};
	
	
	//easing效果
	jQuery.extend( jQuery.easing,
		{
			slow: function (x, t, b, c, d) {
				return c*((t=t/d-1)*t*t*t*t + 1) + b;
			},
			fast: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
				return c/2*((t-=2)*t*t*t*t + 2) + b;
			}
		}
	);

})(jQuery);



