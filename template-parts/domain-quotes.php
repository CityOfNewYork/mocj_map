<div class="quote-carousel js-slider" data-flickity='{ "cellAlign": "center", "groupCells": false }'>

<?php

$quotes = $args['quotes'];

foreach ($quotes as $i => $quote) {
?>

<blockquote class="quote-carousel__quote carousel-cell">
<?php echo $quote['quote']; ?>
</blockquote>

<?php
}
?>

</div>
