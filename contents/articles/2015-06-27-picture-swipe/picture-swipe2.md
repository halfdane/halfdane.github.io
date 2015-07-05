---
template: empty.jade
---

<link rel="stylesheet" type="text/css" href="jTinder.css">

<div id="tinderslide">
    <ul>
        <li class="pane1"><div class="img"></div><div>Miami Beach</div><div class="like"></div><div class="dislike"></div></li>
        <li class="pane2"><div class="img"></div><div>San Francisco</div><div class="like"></div><div class="dislike"></div></li>
        <li class="pane3"><div class="img"></div><div>Chicago</div><div class="like"></div><div class="dislike"></div></li>
        <li class="pane4"><div class="img"></div><div>New York</div><div class="like"></div><div class="dislike"></div></li>
        <li class="pane5"><div class="img"></div><div>Beach</div><div class="like"></div><div class="dislike"></div></li>
    </ul>
</div>

<!-- jQuery lib -->
<script type="text/javascript" src="jquery.min.js"></script>

<!-- transform2d lib -->
<script type="text/javascript" src="jquery.transform2d.js"></script>

<!-- jTinder lib -->
<script type="text/javascript" src="jquery.jTinder.js"></script>

<!-- jTinder initialization script -->
<script>$("#tinderslide").jTinder();</script>