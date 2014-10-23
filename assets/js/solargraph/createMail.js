$(function() {
  var dose=window.location.hash;
  if (dose) {
	var content='Mail an halfdane@gmx.net wegen Dose '+dose;
	var subject='Solargraph-Dose '+dose+' gefunden';
	var body='Hallo Halfdane,\nich habe die Dose '+dose+' gefunden.\n\nMit freundlichen Grüßen '
	var mailto='mailto:halfdane@gmx.net?subject='+encodeURI(subject)+'&body'+encodeURI(body);
	$('pre').replaceWith($('<a>').attr('href',mailto).text(content));
  }
});
