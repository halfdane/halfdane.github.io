$(function() {
  var dose=window.location.hash;
  if (dose) {
	var content='Mail an halfdane@gmx.net wegen der Dose '+dose;
	var subject='Solargraph-Dose '+dose+' gefunden';
	var body='Hallo Halfdane,\nich habe die Dose '+dose+' gefunden.\n\nMit freundlichen Grüßen '
	var mailto='mailto:halfdane@gmx.net?subject='+encodeURIComponent(subject)+'&body'+encodeURIComponent(body);
	$('pre').replaceWith($('<a>').attr('href',mailto).text(content));
  }
});
