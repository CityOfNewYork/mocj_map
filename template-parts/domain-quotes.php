<?php $quotes = $args['quotes']; ?>

<div class="quote-carousel js-slider" data-flickity='{ "cellAlign": "center", "groupCells": false, <?php if (count($quotes) == 1) : echo '"pageDots": false, "prevNextButtons": false'; endif; ?> }'>

<?php foreach ($quotes as $i => $quote) { ?>

<blockquote class="quote-carousel__quote carousel-cell">
<?php echo $quote['quote']; ?>
</blockquote>

<?php } ?>

</div>
