/**
 * SamsonJS LightBox plugin 
 * 
 * Плагин работает для ссылок с картинкой внутри, пример:
 * <a href="путь к полной картинке"><img src="путь к маленькой картинке" title="описание картинки"></a>
 */
var SamsonJSLightBox = 
{		
	lightbox : function( _padding )
	{		
		// Если есть выборка элементов DOM
		return this.each(function(image_tn)
		{			
			// Получим ссылку на полную картинку
			var image_link = image_tn.parent();			
			
			// Padding relative to screen 
			var padding = typeof(_padding)==='undefined' ? 0.8 : _padding;	
	
			// Обработчик нажатия на маленькую картинку
			image_link.click( function( link )
			{
				// Получим ссылку на полную картинку
				var img_link = link.a('href');
				// Получим описание картинки
				var img_title= link.a('title');
				
				// Обработчик закрытия 
				var close = function( container )
				{
					// Уберем контейнер плагина
					lb_container.remove();
					
					// Уберем "темный" фон
					bg_container.remove();
				};
				
				// Повесим обработчик для закрытия 
				s(document.body).click(function( obj, opt, e )
				{					
					// Получим элемент на который нажали 
					var clickedElement = s(e.toElement);				
				
					// Если мы нажали НЕ на наш контейнер - закроем
					if( clickedElement && !clickedElement.hasClass('fckn_img') ) close();										
				});		
				
				// Если полная картинка существует
				if( img_link ) 
				{					
					// Контейнер документа
					var bd_container = s(document.body);
					
					// Добавим его в документ
					bd_container.append('<div class="sjs-lightbox"><div class="sjs-lightbox-close">x</div><img class="fckn_img" src="' + img_link + '" title="' + img_title + '"></div>');
					
					// Получим контейнер "темного" фона
					var bg_container = s('<div class="sjs-lightbox-bg"></div>');
					
					// Добавим фон к документу
					bd_container.append( bg_container );
					
					// Контейнер с изображением
					var lb_container = s('div.sjs-lightbox');					
					// Устаном специальный CSS стиль для позиционирования элемента
					lb_container.css('position','fixed');
					// Установим элемент поверх всех остальных
					lb_container.css('z-index','99999');
					
					// Получим полную картинку
					var lb_img = s( 'img', lb_container );
						
					// Контейнер для закрытия 
					var lb_close = s( '.sjs-lightbox-close', lb_container );
					lb_close.a('title','Закрыть изображение');
					
					// Получим картинку-загрузчик 
					var lb_loader = s('<div class="sjs-lightbox-loader"><img src="/resourcer/lightbox?p=img/loading.gif"></div>');
					
					// Если картинка не загружена - выведем ожидалку
					if( ! lb_img.loaded() ) lb_container.append(lb_loader);
					
					// Обработчик закрытия 
					lb_close.click(close);					
					
					// Подождем пока полная картинка загрузится
					lb_img.load( function( lb_img )
					{			
						// Покажем саму картинку
						lb_container.show();
						
						// Получим размеры "нового" блока
						var lb_width = lb_img.width();
						var lb_height = lb_img.height();
						
						// Получим размеры экрана
						var bd_width = s(window).width();
						var bd_height = s(window).height();
						
						// Count sreen ratio
						var screen_ratio = bd_width / bd_height;
						// Count image ratio
						var img_ratio = lb_width / lb_height;						
						
						//var status = s('<div style="position:fixed; top:0; left:0; background-color:white; z-index:999;"></div>');
						//var _status = 'screen:'+bd_width+'x'+bd_height+'('+screen_ratio+'), img:'+lb_width+'x'+lb_height+'('+img_ratio+')<br>';						
						//status.html(_status);
						//s(document.body).append(status);
						
						// Картинки вытянутая по высоте
						if( screen_ratio > img_ratio ) 
						{
							lb_width = lb_width * (bd_height / lb_height);
							lb_height = bd_height;							
						}
						// Картинка вытянутая по ширине 
						else 
						{
							lb_width = bd_width;
							lb_width = lb_height * (bd_width / lb_width);
						}		
						
						// Add padding
						lb_width *= padding;
						lb_height *= padding;
						
						//s.trace(bd_width+' - '+bd_height);
						
						/*
						// Ограничим размеры картинки - размером экрана
						if( lb_width > bd_width )
						{							
							lb_width = bd_width * 0.8;							
							lb_height = lb_img.height();
							if( lb_height > bd_height )
							{
								lb_img.DOMElement.removeAttribute('width');
								lb_height = bd_height * 0.8;
								lb_img.height( lb_height );
								lb_width = lb_img.width();
							}
						}
						else if( lb_height > bd_height )
						{
							lb_height = bd_height * 0.8;
							
							lb_width = lb_img.width();
							if( lb_width > bd_width )
							{	
								lb_img.DOMElement.removeAttribute('height');
								lb_width = bd_width * 0.8;
								lb_img.width( lb_width );
								lb_height = lb_img.height();
							}
						}	
						*/	
						
						// Set image dimensions
						lb_img.width( lb_width );
						lb_img.height( lb_height );
						
						// Рассчитаем новые "центровые" координаты
						var lb_top = (bd_height - lb_height) / 2;
						var lb_left = (bd_width - lb_width) / 2;
						
						// Рассчитаем высоту контейнера фона
						bg_container_height = s(document.body).height() + 1000;
						
						// Изменим размер контейнера "темного" фона
						bg_container.height( bg_container_height + "px" );
										
						// Разместим наш контейнер по новым координатам
						lb_container.top( lb_top + "px");
						lb_container.left( lb_left + "px");
						
						// Спрячем загрузщик
						lb_loader.remove();								
					});				
				}
			}, true, true );			
		});
	}
};

// Добавим плагин к SamsonJS
SamsonJS.extend( SamsonJSLightBox );
