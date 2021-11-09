(function($){

	$('.accordion__trigger,.sub-accordion__trigger').on('click', function(){
		$th = $(this);
		$parent = $(this).parent();
		$open = $parent.hasClass('open');
		$acc = $(this).closest('.list--reset').find('.js-accordion');
		$acc.removeClass('open')
			.find('.bar-fill').css('width', '0%');

		if(!$open){
			$parent.addClass('open');
			animateGraphs($acc);
			
			window.scroll({'top': $parent.offset().top - 120, 'left': 0, 'behavior':'smooth'});
		}
		
	})


	$('.sub-accordion__trigger').on('click', function(){
		$th = $(this);
		if(!$th.hasClass('accessed')){

			$content = $th.next();
			$pillarId = $content.find('.pillar-metrics').data('pillar-id');
			$postId = $content.find('.pillar-metrics').data('post-id');
			//console.info('pillar-id',$pillarId);
			$th.addClass('accessed');
			$.ajax({
				url: ajaxmetrics.ajaxurl,
				type: 'post',
				data: {
					action: 'ajax_metrics',
					query_vars: ajaxmetrics.query_vars,
					pillarID: $pillarId,
				},
				success: function( result ) {
					$content.find('.metrics').append(result).end().addClass('loaded');
					$content.find('.lds-roller').remove();
					$t = window.setTimeout(function(){
						animateGraphs($content);

						// load line chart data
						// $content.find('.chart').each(function(){
						// 	console.log('load chart', $(this).attr('id'),  metricdata[$(this).attr('id')]);
						// 	//createChart('#' + $(this).attr('id'), metricdata[$(this).attr('id')]);
						// })
					}, 200);

					$content.find('.compare-toggle select').on('change', function(e){
						$th = $(this);
						$indicator = $th.closest('.indicator');
						$indicator.find('.comp').addClass('hidden');
						$indicator.find('.' + $th.val()).removeClass('hidden');
						animateGraphs($indicator);

						//console.log($indicator.find('.line-group.' + $th.val()));
						$indicator.find('.line-group.comp, .point-group.comp').removeClass('comp');
						$indicator.find('.line-group.' + $th.val()).addClass('comp');
						$indicator.find('.point-group.' + $th.val()).addClass('comp');

						$indicator.find('.stat.comp .num').html($indicator.find('.point-group.comp.' + $th.val() + ' .point').last().data('key'));
						$indicator.find('.stat.comp .year').html($indicator.find('.point-group.comp.' + $th.val() + ' .point').last().data('year'));

					})
				}
			})
		}
	});

	const animateGraphs = (parent) => {
		$bars = parent.find('.bars');

		$bars.each(function(){
			$max = 0;
			$barFills = $(this).find('.bar:not(.hidden) .bar-fill');
			
			$barFills.each(function(){
				$(this).css('width', '0%');
				$val = $(this).data('bar-val');
				if($val > $max){
					$max = $val;
				}
			});
			//console.log($max);
			$barFills.each(function(){
				$pct = $(this).data('bar-val') / $max * 100 ;
				$(this).css('width',$pct + '%');
			});
		});
	}

})(jQuery);